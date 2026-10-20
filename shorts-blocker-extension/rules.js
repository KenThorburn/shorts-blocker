const onDomain = (u, domain) => u.hostname === domain || u.hostname.endsWith(`.${domain}`);

export const PLATFORMS = [
  {
    id: 'youtube',
    label: 'YouTube Shorts',
    domains: ['youtube.com'],
    home: 'https://www.youtube.com/',
    blocks: (u) => /\/shorts(\/|$)/.test(u.pathname),
  },
  {
    id: 'instagram',
    label: 'Instagram Reels',
    domains: ['instagram.com'],
    home: 'https://www.instagram.com/',
    blocks: (u) => /\/reels?(\/|$)/.test(u.pathname),
  },
  {
    id: 'facebook',
    label: 'Facebook Reels',
    domains: ['facebook.com'],
    home: 'https://www.facebook.com/',
    blocks: (u) => /\/(reels?|share\/r)(\/|$)/.test(u.pathname),
  },
  {
    id: 'reddit',
    label: 'Reddit video posts',
    domains: ['reddit.com', 'redd.it'],
    home: 'https://www.reddit.com/',
    blocks: (u) => onDomain(u, 'v.redd.it'),
  },
  {
    id: 'snapchat',
    label: 'Snapchat Spotlight',
    domains: ['snapchat.com'],
    home: 'https://www.snapchat.com/',
    blocks: (u) => /\/spotlight(\/|$)/.test(u.pathname),
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    domains: ['tiktok.com'],
    blocks: () => true,
  },
  {
    id: 'other',
    label: 'Likee, Triller, Kwai, Douyin',
    domains: ['likee.video', 'triller.co', 'kwai.com', 'douyin.com'],
    blocks: () => true,
  },
];

export const ALL_DOMAINS = PLATFORMS.flatMap((p) => p.domains);

export function matchPlatform(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  return PLATFORMS.find((p) => p.domains.some((d) => onDomain(u, d)) && p.blocks(u)) ?? null;
}
