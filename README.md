# Shorts Blocker

A Chrome extension that hard-blocks short-form video feeds and leaves the rest of each site usable.

You can still watch regular YouTube videos, read Instagram posts and use Messenger. Shorts, Reels and TikTok-style feeds send you to a "Blocked" page instead.

| Platform | What gets blocked |
|---|---|
| YouTube | Shorts (`/shorts/…`), the Shorts tab on channel pages, Shorts shelves and the Shorts sidebar link |
| Instagram | Single Reels (`/reel/…`), the Reels feed, the Reels profile tab and Reels in the home feed and DMs |
| Facebook | Reels (`/reel/…`, `/reels/`), Reels share links (`/share/r/…`), Reels in the feed |
| Reddit | Video posts in feeds, posts linking to Shorts, TikTok or Reels, and direct `v.redd.it` links |
| Snapchat | Spotlight (`/spotlight`) |
| TikTok | The whole site |
| Likee, Triller, Kwai, Douyin | The whole site |

You can turn each platform on or off in the toolbar popup. The popup also counts how many times the extension blocked something today and in total.

## Install

The extension isn't on the Chrome Web Store yet, so you load it from source.

1. Get the code. Either clone it:
   ```sh
   git clone https://github.com/KenThorburn/shorts-blocker.git
   ```
   or click **Code → Download ZIP** on this page and unzip it.
2. In Chrome, go to `chrome://extensions`.
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked** and select the **`shorts-blocker-extension`** folder inside the repo. Don't select the repo root.
5. Optional: click the puzzle-piece icon next to the address bar and pin **Shorts Blocker**.

It also works in Edge, Brave, Arc and other Chromium browsers. Use their extensions page, such as `edge://extensions`.

Chrome loads the extension from that folder each time it starts. Don't move or delete the folder after installing. Chrome may show a "Developer mode extensions" warning at startup; that's expected for unpacked extensions.

### Updating

```sh
git pull
```

Then click the reload arrow on the Shorts Blocker card in `chrome://extensions`.

## How it works

The extension blocks in two layers:

1. **Blocking addresses** ([`background.js`](shorts-blocker-extension/background.js)). A background script listens to Chrome's `webNavigation` and `tabs` events. These include the address changes single-page apps like YouTube and Instagram make without reloading. If the new address matches a rule in [`rules.js`](shorts-blocker-extension/rules.js), the tab goes to the "Blocked" page. This layer doesn't depend on any site's page layout, so it's the dependable one.
2. **Hiding entry points** ([`content/`](shorts-blocker-extension/content/)). Per-site CSS hides Shorts and Reels shelves, sidebar links and feed items, so you aren't tempted to click them in the first place. It's best-effort: the sites change their page structure often, and these selectors will need occasional updates.

DNS or hosts-file blocking can't do this. Shorts and Reels are served from the same domains as everything else on those sites, so network-level blocking would take down the whole site.

## Privacy

Nothing leaves your browser. The extension makes no network requests and has no analytics. It stores two things locally with `chrome.storage.local`: your on/off settings and the block counts.

## Known limitations

- **Desktop browsers only.** It can't block anything in the native Instagram, YouTube or TikTok apps on your phone.
- **Reddit:** Reddit has no Shorts-style feed address on the web, so this hides all video posts. That's broader than "short-form only." Turn it off in the popup if you don't want it.
- **X, Pinterest and LinkedIn aren't covered yet.** There's no dependable address for their short-video feeds.
- The hiding CSS will break from time to time as the sites change. Blocking by address keeps working when it does.

## Contributing

To add a platform, add an entry to `PLATFORMS` in [`rules.js`](shorts-blocker-extension/rules.js):

```js
{
  id: 'example',
  label: 'Example Clips',
  domains: ['example.com'],
  home: 'https://www.example.com/',
  blocks: (u) => /\/clips(\/|$)/.test(u.pathname),
},
```

Then:

1. Add the domain to `host_permissions` in [`manifest.json`](shorts-blocker-extension/manifest.json).
2. Optionally, add a CSS file in `content/` to hide entry points.
3. Add test cases to [`tests/rules.test.mjs`](tests/rules.test.mjs).

Run the tests with Node 20 or newer:

```sh
npm test
```

When a site's layout changes and Shorts or Reels show up again, fix the selectors in `content/*.css`. Pull requests for these are especially welcome.

## License

[MIT](LICENSE)
