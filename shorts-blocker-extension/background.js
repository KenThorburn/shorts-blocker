import { ALL_DOMAINS, matchPlatform } from './rules.js';

const BLOCK_PAGE = chrome.runtime.getURL('blocked.html');
const NAV_FILTER = { url: ALL_DOMAINS.map((hostSuffix) => ({ hostSuffix })) };

// Several events can fire for one navigation; only redirect/count once.
const recentRedirects = new Map();

async function isDisabled(id) {
  const { disabled = [] } = await chrome.storage.local.get('disabled');
  return disabled.includes(id);
}

async function recordBlock(id) {
  const today = new Date().toLocaleDateString('en-CA');
  const { stats = {} } = await chrome.storage.local.get('stats');
  if (stats.date !== today) {
    stats.date = today;
    stats.today = 0;
  }
  stats.today = (stats.today ?? 0) + 1;
  stats.total = (stats.total ?? 0) + 1;
  stats.byPlatform = { ...stats.byPlatform, [id]: (stats.byPlatform?.[id] ?? 0) + 1 };
  await chrome.storage.local.set({ stats });
}

async function block(tabId, url) {
  if (tabId < 0) return;
  const platform = matchPlatform(url);
  if (!platform) return;

  const last = recentRedirects.get(tabId);
  if (last && Date.now() - last < 1500) return;
  recentRedirects.set(tabId, Date.now());

  if (await isDisabled(platform.id)) {
    recentRedirects.delete(tabId);
    return;
  }

  const target = new URL(BLOCK_PAGE);
  target.searchParams.set('site', platform.label);
  if (platform.home) target.searchParams.set('home', platform.home);

  chrome.tabs.update(tabId, { url: target.href }).catch(() => {});
  recordBlock(platform.id);
}

function onNavigation(details) {
  // Prerendered pages (e.g. from search results) aren't the visible tab; redirecting would hijack it.
  if (details.frameId !== 0 || details.documentLifecycle === 'prerender') return;
  block(details.tabId, details.url);
}

chrome.webNavigation.onBeforeNavigate.addListener(onNavigation, NAV_FILTER);
chrome.webNavigation.onCommitted.addListener(onNavigation, NAV_FILTER);
// SPA route changes (clicking a Short/Reel from inside the site) only surface here.
chrome.webNavigation.onHistoryStateUpdated.addListener(onNavigation, NAV_FILTER);

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) block(tabId, changeInfo.url);
});

chrome.tabs.onRemoved.addListener((tabId) => recentRedirects.delete(tabId));
