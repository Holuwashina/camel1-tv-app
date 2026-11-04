// Ninety theme: tokens for Dark, Light and Daybreak, then layout and styling rules.
// Stable site class names first; utility names via [class*=…].
const NINETY_CSS = `
:root{--bg:#0A0A0B;--surface:#141416;--surface-2:#1C1C1F;--line:#26262A;--text:#F2F2F3;--muted:#A3A3AB;--accent:#5FD36B;--accent-text:#5FD36B;--accent-ink:#06240B;color-scheme:dark}
:root[data-theme="light"]{--bg:#F6F6F7;--surface:#FFFFFF;--surface-2:#EFEFF1;--line:#E3E3E7;--text:#0E0E10;--muted:#5B5B63;--accent-text:#12802C;color-scheme:light}
:root[data-theme="daybreak"]{--bg:#FBF4EA;--surface:#FFFBF5;--surface-2:#F3E9DB;--line:#EBDFD0;--text:#1F1A14;--muted:#6B5F52;--accent-text:#12802C;color-scheme:light}

/* ground, surfaces, text */
html,body,.app,.content,.home,.index,.homeMatch,.room,.roomScroll{background:var(--bg)!important;color:var(--text)!important}
body,.app{font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important}
header.header,.header-content{background:var(--surface)!important;border-bottom:1px solid var(--line)!important;box-shadow:none!important}
.roomBox,.homeMatch [class*="bg-[#1E1E1E]"],.homeMatch [class*="bg-[#1e1e1e]"],.homeMatch [class*="bg-[#121212]"],.room [class*="bg-[#1E1E1E]"],.roomLive-wrapper,.roomContent [class*="bg-[#1E1E1E]"]{background:var(--surface)!important;border:1px solid var(--line)!important;border-radius:12px!important;color:var(--text)!important}
.homeMatch [class*="text-[#"],.room [class*="text-[#"],.homeMatch [class*="text-white"],.room [class*="text-white"],.homeMatch [class*="text-gray"],.room [class*="text-gray"]{color:var(--text)!important}
.homeMatch [class*="text-[#a0a0a0]"],.homeMatch [class*="text-[#A0A0A0]"],.room [class*="text-[#a0a0a0]"],.roomLineup-title,.homeMatchTeam-items-time{color:var(--muted)!important}
.homeMatch [class*="border-white"],.room [class*="border-white"],[class*="border-b-2"]{border-color:var(--line)!important}
a:hover{color:var(--accent-text)!important}

/* numerals */
.fm-sb-score-row,.fm-sb-timer,[class*="score"],[class*="Score"],.homeMatchTeam-items-time span{font-family:"Barlow Condensed",Inter,sans-serif!important;font-weight:700!important;font-variant-numeric:tabular-nums}

/* layout: schedule and player only */
#home-footer,.home-breadcrumb,.room>div:has(.room-breadcrumb-parent),.searchInput,.homeHeader-language,.homeHeader-help,.header-right,.homeHeader-setting,.indexTab,
.homeMatch div:has(> .news),.news,.newsC,.homeMatchTeam,.homeMatch section[class*="xl:hidden"],.homeMatch section:has(> ul[class*="overflow-x-auto"]),
#room-about,#room-odds,.right-column-tab-item:nth-child(3),.room>div.fixed,[class*="roomGuide"],
.roomLive-wrapper>:not(.roomLive),[class*="roomLiveChat"],.roomLiveVideo-streams-login,.roomTab-channel-tips,
[class*="z-[700]"],.roomBannerWrapper,.roomBanner,.homeTopBanner,.ads-video,[data-positiontype]{display:none!important}
.roomBox>div.hidden.text-center,.roomBox>div[class*="text-center"][class*="font-[700]"]{display:none!important}

/* layout: schedule full width, player full width */
.homeMatch [class*="grid-cols-2"]{display:block!important}
.homeMatch [class*="grid-cols-2"]>div:first-child{max-width:none!important;padding:16px 20px!important}
.roomLive{width:100%!important;max-width:none!important}
.roomLive-wrapper{border:0!important;background:#000!important;overflow:hidden}
.content{padding-top:12px!important}

/* controls: square, compact */
.homeMatch .rounded-full,.homeMatch [class*="rounded-full"]{border-radius:8px!important}
.homeMatch button[class*="rounded-full"]{padding:6px 12px!important;font-size:13px!important;min-height:32px!important;border-width:1px!important;background:var(--surface-2)!important;color:var(--muted)!important}
.homeMatch button[class*="rounded-full"][class*="bg-white"],.homeMatch button[class*="rounded-full"][class*="bg-[#fff"],.homeMatch button[class*="rounded-full"][class*="bg-[#FFF"],.homeMatch button[class*="rounded-full"].selected,.homeMatch button[class*="rounded-full"][aria-selected="true"]{background:var(--text)!important;color:var(--bg)!important}
.homeMatch button[class*="rounded-full"] h2{font-weight:600}
.homeMatch [class*="bg-[#37DE4A]"],.homeMatch [class*="bg-[#20F551]"]{background:var(--accent)!important}
.homeMatchList [class*="text-[#20F551]"]{color:var(--text)!important}
.room [class*="text-[#20F551]"]{color:var(--accent-text)!important}
/* match list rows: the site styles these from its own stylesheet (.grouped-match-item), not utility classes */
.grouped-match-item,.grouped-match-item-content,.homeMatchList [class*="rounded-b-"]{background:var(--surface)!important;color:var(--text)!important}
.grouped-match-item{border-top:1px solid var(--line)!important}
.grouped-match-item-before{background:transparent!important}
.grouped-match-item .team-name h4,.grouped-match-item .time-status,.grouped-match-item .time-status span,.grouped-match-item .team-score{color:var(--text)!important}
.grouped-match-item .time-live{color:var(--muted)!important;font-family:"Barlow Condensed",Inter,sans-serif!important;font-weight:700!important;font-size:16px!important}
.grouped-match-item-live .time-live{color:var(--accent-text)!important}
.grouped-match-item .team-score{font-family:"Barlow Condensed",Inter,sans-serif!important;font-weight:700!important;font-size:22px!important}
.match-items-type{background:var(--accent)!important;color:var(--accent-ink)!important;border-radius:6px!important;border:0!important}
.match-items-type img{display:none!important}
.match-items-type-text,.match-items-pv{color:var(--accent-ink)!important}
.homeMatch button[class*="border-[#17a337]"]{color:var(--accent-text)!important;border-color:var(--accent)!important;background:var(--surface)!important}
.homeMatch [class*="bg-[#1e1e1e]"] button[class*="bg-transparent"]{background:transparent!important;color:var(--muted)!important}
.right-column-tab-item{color:var(--muted)!important;font-weight:500}

/* header: our mark and name in place of theirs */
.header-logo{display:inline-flex!important;align-items:center;gap:10px;height:44px}
.header-logo img.logo{display:none!important}
.header-logo::before{content:"";width:28px;height:28px;border-radius:7px;background:#5FD36B url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2260 200 880 600%22%3E%3Cg fill=%22none%22 stroke=%22%2306240B%22 stroke-width=%2280%22 stroke-linecap=%22round%22%3E%3Ccircle cx=%22230%22 cy=%22370%22 r=%22130%22/%3E%3Cline x1=%22360%22 y1=%22370%22 x2=%22360%22 y2=%22760%22/%3E%3Cellipse cx=%22630%22 cy=%22500%22 rx=%22130%22 ry=%22240%22/%3E%3Cline x1=%22900%22 y1=%22240%22 x2=%22900%22 y2=%22330%22/%3E%3C/g%3E%3C/svg%3E") center/72% no-repeat;flex:none}
.header-logo::after{content:"Ninety";font:600 17px/1 Inter,system-ui,sans-serif;letter-spacing:-0.01em;color:var(--text)}

/* theme switcher (mounted by adblock.js) */
.ninety-theme{display:inline-flex;gap:6px;align-items:center;margin-left:auto;padding:4px;border:1px solid var(--line);border-radius:8px;background:var(--bg)}
.ninety-theme button{width:28px;height:28px;border:0;border-radius:6px;background:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}
.ninety-theme button span{width:14px;height:14px;border-radius:50%;border:1px solid var(--line);display:block}
.ninety-theme button[data-t="dark"] span{background:#0A0A0B}.ninety-theme button[data-t="light"] span{background:#FFFFFF}.ninety-theme button[data-t="daybreak"] span{background:#FBF4EA}
.ninety-theme button[aria-pressed="true"]{background:var(--surface-2);outline:2px solid var(--accent);outline-offset:-2px}
`;
