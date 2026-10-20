const params = new URLSearchParams(location.search);
const site = params.get('site');
const home = params.get('home');

if (site) {
  document.getElementById('site').textContent = site;
  document.title = `Blocked: ${site}`;
}

if (home && /^https:\/\/[a-z0-9.-]+\//i.test(home)) {
  const link = document.getElementById('home');
  link.href = home;
  link.textContent = `Go to ${new URL(home).hostname.replace(/^www\./, '')}`;
  link.hidden = false;
}

document.getElementById('close').addEventListener('click', async () => {
  const tab = await chrome.tabs.getCurrent();
  if (tab?.id != null) chrome.tabs.remove(tab.id);
});

chrome.storage.local.get('stats').then(({ stats = {} }) => {
  const today = new Date().toLocaleDateString('en-CA');
  document.getElementById('today').textContent = stats.date === today ? stats.today ?? 0 : 0;
  document.getElementById('total').textContent = stats.total ?? 0;
});
