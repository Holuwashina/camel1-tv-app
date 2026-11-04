(() => {
  // Banner containers seen on camel1.tv, and ad networks the site links out to.
  const CSS = '.homeTopBanner,.ads-video{display:none!important}';
  const AD_HOSTS = ['bwredir.com', 'rapidadexchange.com'];
  const style = document.createElement('style');
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  const hideAds = () => {
    for (const a of document.querySelectorAll('a[href]')) {
      if (a.dataset.noAd) continue;
      if (AD_HOSTS.some((h) => a.href.includes(h))) {
        a.dataset.noAd = '1';
        (a.closest('.swiper, .banner') || a).style.setProperty('display', 'none', 'important');
      }
    }
  };

  // window.open: stay in-app for the site's own pages, block everything else.
  const SITE = ['camel1.tv', 'camel1.to', 'camel1.link'];
  const realOpen = window.open;
  window.open = function (url, ...rest) {
    try {
      const u = new URL(url, location.href);
      if (SITE.some((h) => u.hostname === h || u.hostname.endsWith('.' + h))) {
        location.href = u.href;
      } else if (/(^|\.)(t\.me|instagram\.com|youtube\.com|tiktok\.com|facebook\.com)$/.test(u.hostname)) {
        return realOpen.call(window, url, ...rest);
      }
    } catch (e) {}
    return null;
  };

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; hideAds(); }, 300);
  }).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', hideAds);
})();
