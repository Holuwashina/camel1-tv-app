(() => {
  'use strict';
  // Runs at document start (before <html> exists on Android, so DOM work waits for <head>).

  const SITE = ['camel1.tv', 'camel1.to', 'camel1.link', 'cameltv.live', 'camel4.live'];
  const SOCIAL = ['t.me', 'instagram.com', 'youtube.com', 'tiktok.com', 'facebook.com'];
  const AD_HOSTS = ['acscdn.com', 'rapidadexchange.com', 'usrpubtrck.com', 'refpa2518.com',
    'bwredir.com', '1xbet.ng', 'suphelper.top'];

  const hostIn = (host, list) => list.some((d) => host === d || host.endsWith('.' + d));
  const hostOf = (url) => { try { return new URL(url, location.href).hostname; } catch (e) { return ''; } };

  // 1. If the pop-under library runs anyway, its entry points do nothing.
  const noop = () => {};
  const inert = Object.freeze({ runPop: noop, runBanner: noop, runAutoTag: noop,
    runInterstitial: noop, runInPagePush: noop, runSuv: noop });
  try { Object.defineProperty(window, 'aclib', { value: inert, writable: false, configurable: false }); } catch (e) {}

  // 2. Pop-ups: the site's own pages stay in-app, its social links may open, nothing else.
  const realOpen = window.open;
  window.open = function (url, ...rest) {
    const h = hostOf(url);
    if (hostIn(h, SITE)) { location.href = new URL(url, location.href).href; return null; }
    if (hostIn(h, SOCIAL)) return realOpen.call(window, url, ...rest);
    return null;
  };

  // 3. Clicks that would lead to an ad host never navigate.
  document.addEventListener('click', (ev) => {
    const a = ev.target && ev.target.closest && ev.target.closest('a[href]');
    if (a && hostIn(hostOf(a.href), AD_HOSTS)) { ev.preventDefault(); ev.stopImmediatePropagation(); }
  }, true);

  // 4. Script allow-list. Anything not listed never executes, including ad
  //    libraries the site may add later. Inline scripts stay allowed because the
  //    site itself (Next.js) needs them.
  const CSP = [
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    'https://*.camel1.tv https://*.cameltv.live https://*.camel4.live',
    'https://web.sdk.qcloud.com https://*.myqcloud.com',
    'https://accounts.google.com https://appleid.cdn-apple.com',
    "; worker-src 'self' blob:",
  ].join(' ');

  // 5. Banner slots and ad script tags.
  const CSS = '.homeTopBanner,.ads-video,.roomBannerWrapper,.roomBanner,' +
    '[data-positiontype="Banner"],[id^="camel-ad-script"]{display:none!important}';

  const sweep = (root) => {
    for (const s of root.querySelectorAll('script[src]')) {
      if (hostIn(hostOf(s.src), AD_HOSTS)) { s.type = 'text/blocked'; s.removeAttribute('src'); s.remove(); }
    }
    for (const a of root.querySelectorAll('a[href]')) {
      if (a.dataset.noAd) continue;
      if (hostIn(hostOf(a.href), AD_HOSTS)) {
        a.dataset.noAd = '1';
        (a.closest('.swiper, .banner, .roomBannerWrapper') || a).style.setProperty('display', 'none', 'important');
      }
    }
  };

  // 6. Theme: follow the OS unless the user picked one; applied before first paint.
  const THEMES = ['dark', 'light', 'daybreak'];
  const readTheme = () => { try { return localStorage.getItem('ninety.theme'); } catch (e) { return null; } };
  const currentTheme = () => {
    const t = readTheme();
    if (THEMES.includes(t)) return t;
    return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };
  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t;
    for (const b of document.querySelectorAll('.ninety-theme button')) b.setAttribute('aria-pressed', String(b.dataset.t === t));
  };
  const setTheme = (t) => { try { localStorage.setItem('ninety.theme', t); } catch (e) {} applyTheme(t); };
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (!THEMES.includes(readTheme())) applyTheme(currentTheme()); });
  const mountSwitcher = () => {
    const host = document.querySelector('.header-content');
    if (!host || host.querySelector('.ninety-theme')) return;
    const box = document.createElement('div');
    box.className = 'ninety-theme';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Theme');
    for (const t of THEMES) {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.t = t; b.title = t[0].toUpperCase() + t.slice(1);
      b.setAttribute('aria-label', b.title + ' theme');
      b.appendChild(document.createElement('span'));
      b.addEventListener('click', () => setTheme(t));
      box.appendChild(b);
    }
    host.appendChild(box);
    applyTheme(currentTheme());
  };
  // A way back from a match page. The page's own breadcrumb is hidden.
  const mountBack = () => {
    const host = document.querySelector('.header-content');
    if (!host) return;
    const onMatch = location.pathname !== '/';
    const old = host.querySelector('.ninety-back');
    if (!onMatch) { if (old) old.remove(); return; }
    if (old) return;
    const a = document.createElement('a');
    a.className = 'ninety-back'; a.href = '/'; a.textContent = 'Matches';
    a.setAttribute('aria-label', 'Back to matches');
    const logo = host.querySelector('.header-logo');
    if (logo) logo.after(a); else host.prepend(a);
  };

  // 7a. The page's first-visit guide is a full-window modal whose backdrop
  // swallows every click (play, header). It only opens when this cookie is
  // missing, so keep the cookie set; if it opens anyway, use its own close.
  const quietGuide = () => {
    try { document.cookie = 'showRoomGuide=1; path=/; max-age=31536000; SameSite=Lax'; } catch (e) {}
    const close = document.querySelector('.MuiModal-root .roomGuide-close');
    if (close) close.click();
    // Phone match page opens on a tab we do not show; move to the match tab.
    const chat = document.querySelector('.roomTab-items-chat.roomTab-items-active');
    const match = chat && document.querySelector('.roomTab-items-match');
    if (match) match.click();
  };
  quietGuide();

  // 7. Dismiss the page's own interstitial once its countdown ends.
  const closeHouseAds = () => {
    for (const b of document.querySelectorAll('button[aria-label="Close ad"]')) {
      if (b.textContent.trim() === '\u00d7') b.click();
    }
    for (const d of document.querySelectorAll('.roomPatchBanner div')) {
      if (d.childElementCount === 0 && d.textContent.trim().toUpperCase() === 'CLOSE') d.click();
    }
  };

  const install = (head) => {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = CSP;
    head.prepend(meta);
    applyTheme(currentTheme());
    const fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Barlow+Condensed:wght@600;700&display=swap';
    head.appendChild(fonts);
    const style = document.createElement('style');
    style.textContent = CSS + (typeof NINETY_CSS === 'string' ? NINETY_CSS : '');
    head.appendChild(style);
    sweep(document);
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      setTimeout(() => { queued = false; sweep(document); mountSwitcher(); mountBack(); quietGuide(); closeHouseAds(); }, 250);
    }).observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', () => { sweep(document); mountSwitcher(); mountBack(); quietGuide(); closeHouseAds(); });
  };

  if (document.head) {
    install(document.head);
  } else {
    // Fires when the parser creates <html> and <head>, before the page's own scripts.
    const early = new MutationObserver(() => {
      if (document.head) { early.disconnect(); install(document.head); }
    });
    early.observe(document, { childList: true, subtree: true });
  }
})();
