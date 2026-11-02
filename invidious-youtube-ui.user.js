// ==UserScript==
// @name         Invidious → YouTube UI (inv.nadeko.net)
// @namespace    https://inv.nadeko.net/
// @version      1.1.0
// @description  Giao diện giống youtube.com cho Invidious: header cố định, thanh tìm kiếm bo tròn, sidebar, lưới video, trang xem 2 cột.
// @author       you
// @match        https://inv.nadeko.net/*
// @match        https://*.nadeko.net/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /* ===================== CSS ===================== */
  const CSS = `
  :root{
    --yt-bg:#fff; --yt-bg2:#f2f2f2; --yt-bg3:#e5e5e5; --yt-text:#0f0f0f; --yt-text2:#606060;
    --yt-border:#d3d3d3; --yt-search-bg:#fff; --yt-search-btn:#f8f8f8; --yt-red:#ff0033;
    --yt-link:#065fd4; --yt-accent:#ff0033; --yt-sub-bg:#0f0f0f; --yt-sub-fg:#fff; --yt-focus:#1c62b9;
    --yt-header-h:56px; --yt-guide-w:240px; --yt-mini-w:72px;
  }
  body.dark-theme, html.yt-dark body{
    --yt-bg:#0f0f0f; --yt-bg2:#272727; --yt-bg3:#3f3f3f; --yt-text:#f1f1f1; --yt-text2:#aaa;
    --yt-border:#303030; --yt-search-bg:#121212; --yt-search-btn:#222;
    --yt-link:#3ea6ff; --yt-sub-bg:#f1f1f1; --yt-sub-fg:#0f0f0f;
  }
  @media (prefers-color-scheme: dark){
    body:not(.light-theme){
      --yt-bg:#0f0f0f; --yt-bg2:#272727; --yt-bg3:#3f3f3f; --yt-text:#f1f1f1; --yt-text2:#aaa;
      --yt-border:#303030; --yt-search-bg:#121212; --yt-search-btn:#222;
      --yt-link:#3ea6ff; --yt-sub-bg:#f1f1f1; --yt-sub-fg:#0f0f0f;
    }
  }
  /* ---------- Catppuccin ---------- */
  html[data-ctp="latte"], html[data-ctp="latte"] body{
    --yt-bg:#eff1f5; --yt-bg2:#ccd0da; --yt-bg3:#bcc0cc; --yt-text:#4c4f69; --yt-text2:#6c6f85;
    --yt-border:#bcc0cc; --yt-search-bg:#e6e9ef; --yt-search-btn:#ccd0da;
    --yt-link:#1e66f5; --yt-accent:#8839ef; --yt-sub-bg:#8839ef; --yt-sub-fg:#dce0e8; --yt-focus:#7287fd;
  }
  html[data-ctp="frappe"], html[data-ctp="frappe"] body{
    --yt-bg:#303446; --yt-bg2:#414559; --yt-bg3:#51576d; --yt-text:#c6d0f5; --yt-text2:#a5adce;
    --yt-border:#51576d; --yt-search-bg:#292c3c; --yt-search-btn:#414559;
    --yt-link:#8caaee; --yt-accent:#ca9ee6; --yt-sub-bg:#ca9ee6; --yt-sub-fg:#232634; --yt-focus:#babbf1;
  }
  html[data-ctp="macchiato"], html[data-ctp="macchiato"] body{
    --yt-bg:#24273a; --yt-bg2:#363a4f; --yt-bg3:#494d64; --yt-text:#cad3f5; --yt-text2:#a5adcb;
    --yt-border:#494d64; --yt-search-bg:#1e2030; --yt-search-btn:#363a4f;
    --yt-link:#8aadf4; --yt-accent:#c6a0f6; --yt-sub-bg:#c6a0f6; --yt-sub-fg:#181926; --yt-focus:#b7bdf8;
  }
  html[data-ctp="mocha"], html[data-ctp="mocha"] body{
    --yt-bg:#1e1e2e; --yt-bg2:#313244; --yt-bg3:#45475a; --yt-text:#cdd6f4; --yt-text2:#a6adc8;
    --yt-border:#45475a; --yt-search-bg:#181825; --yt-search-btn:#313244;
    --yt-link:#89b4fa; --yt-accent:#cba6f7; --yt-sub-bg:#cba6f7; --yt-sub-fg:#11111b; --yt-focus:#b4befe;
  }
  html[data-ctp] #yt-logo svg path:first-child{ fill:var(--yt-accent); }
  html[data-ctp] #yt-logo svg path:last-child{ fill:var(--yt-sub-fg); }
  html[data-ctp] ::selection{ background:var(--yt-accent); color:var(--yt-sub-fg); }

  /* Trình phát theo màu chủ đề (mặc định đỏ như YouTube) */
  .video-js .vjs-play-progress, .video-js .vjs-volume-level{ background-color:var(--yt-accent)!important; }
  .video-js .vjs-play-progress:before, .video-js .vjs-volume-level:before{ color:var(--yt-accent)!important; }
  .video-js .vjs-load-progress div{ background:rgba(255,255,255,.35)!important; }
  .video-js .vjs-control-bar{ background:linear-gradient(transparent, rgba(0,0,0,.65))!important; }
  .video-js .vjs-big-play-button{ background:var(--yt-accent)!important; border:0!important; border-radius:14px!important; }
  .video-js .vjs-menu-content{ background:rgba(28,28,28,.9)!important; border-radius:8px; }

  /* ---------- Nút chọn theme ---------- */
  #yt-theme-wrap{ position:relative; }
  #yt-theme-menu{
    position:absolute; top:44px; right:0; min-width:270px; padding:8px 0; border-radius:12px; z-index:3000;
    background:var(--yt-bg2); box-shadow:0 4px 32px rgba(0,0,0,.35); display:none;
  }
  #yt-theme-menu.open{ display:block; }
  #yt-theme-menu .yt-tm-title{ padding:8px 16px; font-size:13px; color:var(--yt-text2); }
  #yt-theme-menu button{
    display:flex; align-items:center; gap:12px; width:100%; padding:8px 16px; border:0; background:transparent;
    color:var(--yt-text); font-size:14px; cursor:pointer; text-align:left; white-space:nowrap;
  }
  #yt-theme-menu button:hover{ background:var(--yt-bg3); }
  #yt-theme-menu .yt-tm-dots{ display:inline-flex; }
  #yt-theme-menu .yt-tm-dots i{ width:14px; height:14px; border-radius:50%; margin-left:-4px; border:2px solid var(--yt-bg2); }
  #yt-theme-menu .yt-tm-check{ margin-left:auto; visibility:hidden; color:var(--yt-accent); }
  #yt-theme-menu button.active .yt-tm-check{ visibility:visible; }

  html, body{ background:var(--yt-bg)!important; color:var(--yt-text)!important; }
  /* Không đụng vào trình phát video.js: các icon của nó (nút tròn thanh tua, play, âm lượng…) dùng font "VideoJS" */
  body, body *:not(i):not([class*="icon"]):not([class*="ion-"]):not(.video-js):not(.video-js *){
    font-family:"Roboto","Arial",sans-serif!important;
  }
  .video-js .vjs-control-bar, .video-js .vjs-menu, .video-js .vjs-time-tooltip, .video-js .vjs-text-track-display{
    font-family:"Roboto","Arial",sans-serif;
  }
  body{ margin:0; padding-top:var(--yt-header-h)!important; }
  a{ color:inherit; text-decoration:none!important; }
  a:hover{ color:inherit; }

  /* Bỏ khung hẹp mặc định của Invidious */
  body > .pure-g > .pure-u-md-2-24{ display:none!important; }
  #contents{ width:100%!important; max-width:none!important; padding:0!important; box-sizing:border-box; }
  .navbar{ display:none!important; }

  /* ---------- Header ---------- */
  #yt-header{
    position:fixed; top:0; left:0; right:0; height:var(--yt-header-h); z-index:2000;
    display:flex; align-items:center; justify-content:space-between; padding:0 16px;
    background:var(--yt-bg); box-sizing:border-box;
  }
  #yt-header .yt-start{ display:flex; align-items:center; gap:8px; min-width:200px; }
  #yt-header .yt-center{ flex:0 1 728px; display:flex; align-items:center; margin:0 40px; }
  #yt-header .yt-end{ display:flex; align-items:center; justify-content:flex-end; gap:6px; min-width:200px; }
  .yt-icon-btn{
    width:40px; height:40px; border-radius:50%; border:0; background:transparent; color:var(--yt-text);
    display:inline-flex; align-items:center; justify-content:center; cursor:pointer; padding:0;
  }
  .yt-icon-btn:hover{ background:var(--yt-bg2); }
  .yt-icon-btn svg{ width:24px; height:24px; fill:currentColor; }
  #yt-logo{ display:flex; align-items:center; gap:4px; padding:18px 14px 18px 16px; color:var(--yt-text)!important; }
  #yt-logo svg{ height:20px; }
  #yt-logo span{ font-size:18px; font-weight:700; letter-spacing:-.8px; }

  #yt-search{ display:flex; flex:1; height:40px; margin:0; }
  #yt-search input{
    flex:1; min-width:0; height:40px; box-sizing:border-box; padding:0 4px 0 16px; font-size:16px;
    border:1px solid var(--yt-border); border-right:0; border-radius:40px 0 0 40px;
    background:var(--yt-search-bg); color:var(--yt-text); outline:none; box-shadow:none;
  }
  #yt-search input:focus{ border-color:var(--yt-focus); box-shadow:inset 0 1px 2px rgba(0,0,0,.3); }
  #yt-search button{
    width:64px; height:40px; border:1px solid var(--yt-border); border-radius:0 40px 40px 0;
    background:var(--yt-search-btn); color:var(--yt-text); cursor:pointer;
    display:flex; align-items:center; justify-content:center;
  }
  #yt-search button:hover{ background:var(--yt-bg3); }
  #yt-search button svg{ width:24px; height:24px; fill:currentColor; }

  /* user-field gốc được chuyển vào header */
  #yt-header .user-field{ display:flex!important; align-items:center; gap:4px; width:auto!important; flex-wrap:nowrap; }
  #yt-header .user-field > div{ display:inline-flex; width:auto!important; }
  #yt-header .user-field a, #yt-header .user-field .pure-menu-heading{
    color:var(--yt-text)!important; padding:8px 10px!important; border-radius:18px; font-size:14px!important;
    text-transform:none!important; display:inline-flex; align-items:center; gap:4px;
  }
  #yt-header .user-field a:hover{ background:var(--yt-bg2); }
  #yt-header .user-field a[href^="/login"]{
    border:1px solid var(--yt-border); color:var(--yt-link)!important; font-weight:500;
  }

  /* ---------- Sidebar ---------- */
  #yt-guide{
    position:fixed; top:var(--yt-header-h); left:0; bottom:0; width:var(--yt-guide-w); z-index:1500;
    overflow-y:auto; padding:12px; box-sizing:border-box; background:var(--yt-bg);
    scrollbar-width:thin;
  }
  #yt-guide a{
    display:flex; align-items:center; gap:24px; height:40px; padding:0 12px; border-radius:10px;
    font-size:14px; color:var(--yt-text)!important; white-space:nowrap;
  }
  #yt-guide a:hover{ background:var(--yt-bg2); }
  #yt-guide a.active{ background:var(--yt-bg2); font-weight:500; }
  #yt-guide svg{ width:24px; height:24px; fill:currentColor; flex:none; }
  #yt-guide hr{ border:0; border-top:1px solid var(--yt-border); margin:12px 0; }
  #yt-guide .yt-guide-title{ padding:6px 12px 4px; font-size:16px; font-weight:500; }

  html.yt-mini #yt-guide{ width:var(--yt-mini-w); padding:4px; }
  html.yt-mini #yt-guide a{ flex-direction:column; justify-content:center; gap:6px; height:74px; padding:0; font-size:10px; }
  html.yt-mini #yt-guide hr, html.yt-mini #yt-guide .yt-guide-title, html.yt-mini #yt-guide .yt-hide-mini{ display:none; }

  #contents{ padding-left:var(--yt-guide-w)!important; }
  html.yt-mini #contents{ padding-left:var(--yt-mini-w)!important; }
  /* Trang xem video: sidebar ẩn, mở dạng overlay */
  html.yt-watch #yt-guide{ transform:translateX(-100%); transition:transform .2s; box-shadow:none; }
  html.yt-watch.yt-guide-open #yt-guide{ transform:none; box-shadow:0 0 24px rgba(0,0,0,.4); width:var(--yt-guide-w); padding:12px; }
  html.yt-watch.yt-guide-open #yt-guide a{ flex-direction:row; height:40px; padding:0 12px; font-size:14px; gap:24px; justify-content:flex-start; }
  html.yt-watch #contents{ padding-left:0!important; }

  @media (max-width:1312px){
    html:not(.yt-watch):not(.yt-full) #yt-guide{ width:var(--yt-mini-w); padding:4px; }
    html:not(.yt-watch):not(.yt-full) #yt-guide a{ flex-direction:column; justify-content:center; gap:6px; height:74px; padding:0; font-size:10px; }
    html:not(.yt-watch):not(.yt-full) #yt-guide hr,
    html:not(.yt-watch):not(.yt-full) #yt-guide .yt-guide-title,
    html:not(.yt-watch):not(.yt-full) #yt-guide .yt-hide-mini{ display:none; }
    html:not(.yt-watch):not(.yt-full) #contents{ padding-left:var(--yt-mini-w)!important; }
  }
  @media (max-width:792px){
    #yt-guide{ display:none; }
    #contents{ padding-left:0!important; }
    #yt-header .yt-center{ margin:0 8px; }
    #yt-header .yt-start, #yt-header .yt-end{ min-width:0; }
    #yt-logo span{ display:none; }
    #yt-header .user-field a:not([href^="/login"]){ display:none!important; }
  }

  /* ---------- Thanh chip (Popular / Trending / …) ---------- */
  .feed-menu{
    display:flex!important; gap:12px; flex-wrap:nowrap; overflow-x:auto; padding:12px 0!important;
    justify-content:flex-start!important; scrollbar-width:none; position:sticky; top:var(--yt-header-h);
    background:var(--yt-bg); z-index:100;
  }
  .feed-menu-item, .feed-menu a{
    background:var(--yt-bg2)!important; color:var(--yt-text)!important; border-radius:8px!important;
    padding:0 12px!important; height:32px; line-height:32px!important; font-size:14px!important;
    font-weight:500!important; text-transform:none!important; white-space:nowrap; margin:0!important;
  }
  .feed-menu-item:hover{ background:var(--yt-bg3)!important; }
  .feed-menu-item.pure-menu-selected, .feed-menu-item[aria-current], .feed-menu .selected{
    background:var(--yt-text)!important; color:var(--yt-bg)!important;
  }

  /* ---------- Lưới video ---------- */
  #contents > .h-box, #contents > div > .h-box{ padding-left:24px; padding-right:24px; }
  .yt-grid{
    display:grid!important; grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
    gap:40px 16px; padding:16px 24px 24px!important; letter-spacing:normal!important; word-spacing:normal!important;
  }
  .yt-grid > .yt-cell{ width:auto!important; display:block!important; }
  .yt-grid > .yt-cell > .h-box{ padding:0!important; }
  .yt-grid > :not(.yt-cell){ grid-column:1/-1; }

  .yt-card .thumbnail{ position:relative; border-radius:12px; overflow:hidden; aspect-ratio:16/9; background:var(--yt-bg2); }
  .yt-card img.thumbnail{ width:100%; height:100%; object-fit:cover; border-radius:12px; display:block; transition:border-radius .2s; }
  .yt-card:hover img.thumbnail{ border-radius:0; }
  .yt-card .bottom-right-overlay{ position:absolute; right:8px; bottom:8px; }
  .yt-card .length, .yt-card .bottom-right-overlay p{
    margin:0!important; background:rgba(0,0,0,.8)!important; color:#fff!important; font-size:12px!important;
    font-weight:500; padding:1px 4px!important; border-radius:4px!important; opacity:1!important;
  }
  .yt-card .top-left-overlay, .yt-card .top-right-overlay{ position:absolute; top:6px; }
  .yt-card .top-left-overlay{ left:6px; } .yt-card .top-right-overlay{ right:6px; }
  .yt-card .watched-indicator{ position:absolute; bottom:0; left:0; height:4px; background:var(--yt-accent)!important; }

  .yt-meta{ display:flex; gap:12px; margin-top:12px; }
  .yt-avatar{
    flex:none; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:16px; font-weight:500; text-transform:uppercase; user-select:none;
  }
  .yt-text{ flex:1; min-width:0; }
  .yt-title{
    margin:0 0 4px!important; font-size:16px!important; line-height:22px!important; font-weight:500!important;
    color:var(--yt-text)!important; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  }
  .yt-card .video-card-row{ display:block!important; margin:0!important; }
  .yt-card .flexible{ display:flex!important; flex-wrap:wrap; }
  .yt-card .flex-left, .yt-card .flex-right{ width:auto!important; flex:none!important; display:inline-flex; align-items:center; }
  .yt-card .yt-text .yt-title{ color:var(--yt-text)!important; font-size:16px!important; line-height:22px!important; margin:0 0 4px!important; }
  .yt-card .channel-name, .yt-card .video-data, .yt-card .yt-text p:not(.yt-title){
    margin:0!important; font-size:14px!important; line-height:20px!important; color:var(--yt-text2)!important;
  }
  .yt-card .channel-name:hover{ color:var(--yt-text)!important; }
  .yt-card .yt-stats{ display:block; }
  .yt-card .yt-stats > *{ display:inline!important; width:auto!important; font-weight:400!important; }
  .yt-card .yt-stats > * + *::before{ content:"•"; margin:0 4px; }
  .yt-card .yt-stats b, .yt-card .video-data b, .yt-card .channel-name b{ font-weight:400!important; }
  .yt-card .channel-name{ font-weight:400!important; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .yt-card .flex-left{ min-width:0; max-width:100%; }
  /* các nút nhỏ (mở YouTube, nghe audio…) → nổi trên góc ảnh khi rê chuột */
  .yt-card{ position:relative; }
  .yt-card .icon-buttons{
    position:absolute!important; top:8px; right:8px; z-index:2; display:none!important; gap:2px;
    background:rgba(0,0,0,.75); border-radius:8px; padding:4px 6px; margin:0!important;
  }
  .yt-card:hover .icon-buttons{ display:inline-flex!important; }
  .yt-card .icon-buttons a{ color:#fff!important; padding:2px 4px; font-size:14px; }
  .yt-card .icon-buttons a:hover{ color:var(--yt-accent)!important; }

  /* ---------- Trang xem video ---------- */
  .yt-watch-layout{
    width:100%!important; display:flex; gap:24px; padding:24px 24px 0; max-width:1754px; margin:0 auto; box-sizing:border-box;
  }
  .yt-primary{ flex:1; min-width:0; }
  .yt-secondary{ width:402px; flex:none; }
  .yt-primary > .h-box, .yt-secondary > .h-box, .yt-primary .h-box{ padding-left:0!important; padding-right:0!important; }
  /* Invidious tạo chiều cao bằng padding-bottom + height:0 → thay bằng aspect-ratio */
  #player-container{
    position:relative!important; padding:0!important; margin:0!important; height:auto!important;
    width:100%!important; aspect-ratio:16/9; max-height:calc(100vh - 160px); min-height:200px;
    border-radius:12px; overflow:hidden; background:#000;
  }
  #player-container > #player, #player-container > .video-js, #player-container > video, #player-container > iframe{
    position:absolute!important; top:0!important; left:0!important; width:100%!important; height:100%!important;
    padding:0!important; margin:0!important;
  }
  #player-container .video-js, #player-container video{ border-radius:12px; }
  /* chế độ toàn màn hình của video.js không bị khung bo góc giới hạn */
  #player-container .video-js.vjs-fullscreen, #player-container .vjs-fullscreen video{ border-radius:0; }
  .yt-primary h1{ font-size:20px!important; line-height:28px!important; font-weight:600!important; margin:12px 0 8px!important; }
  .yt-primary h1 a{ font-size:16px; color:var(--yt-text2)!important; }

  .yt-owner-row{ display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin:8px 0 12px; }
  .yt-owner-row .channel-profile{ display:flex; align-items:center; gap:12px; }
  .yt-owner-row .channel-profile img{ width:40px!important; height:40px!important; border-radius:50%; }
  #channel-name{ font-size:16px!important; font-weight:600!important; color:var(--yt-text)!important; }
  #subscribe-widget{ display:inline-flex; }
  #subscribe-widget button, #subscribe, #unsubscribe, .yt-owner-row .pure-button{
    background:var(--yt-sub-bg)!important; color:var(--yt-sub-fg)!important; border:0!important; border-radius:18px!important;
    height:36px!important; padding:0 16px!important; margin:0!important; font-size:14px!important; font-weight:500!important;
    line-height:1!important; cursor:pointer; display:inline-flex!important; align-items:center; justify-content:center;
    box-sizing:border-box; vertical-align:middle; box-shadow:none!important;
  }
  #subscribe-widget button *, #subscribe *, #unsubscribe *{ margin:0!important; padding:0!important; line-height:1!important; font-weight:500!important; color:inherit!important; }
  #subscribe-widget form{ margin:0; display:inline-flex; }
  #subscribe:hover, #subscribe-widget button:hover{ opacity:.9; }
  #unsubscribe{ background:var(--yt-bg2)!important; color:var(--yt-text)!important; }

  .yt-chips{ display:flex; flex-wrap:wrap; gap:8px; }
  .yt-chips > *{
    background:var(--yt-bg2); border-radius:18px; padding:0 14px; height:36px; display:inline-flex; align-items:center;
    font-size:14px; font-weight:500; margin:0!important; color:var(--yt-text)!important;
  }
  .yt-chips a:hover, .yt-chips > *:hover{ background:var(--yt-bg3); }
  .yt-chips > * a{ color:var(--yt-text)!important; background:none!important; padding:0!important; height:auto; }
  .yt-chips #watch-on-youtube{ gap:4px; }
  .yt-chips #likes i, .yt-chips #dislikes i{ margin-right:6px; }
  .yt-chips select{ background:transparent; color:inherit; border:0; }

  .yt-desc{
    background:var(--yt-bg2); border-radius:12px; padding:12px; margin:12px 0 24px; font-size:14px; line-height:20px;
  }
  .yt-desc #published-date, .yt-desc .yt-desc-head{ font-weight:600; margin:0 0 6px!important; }
  .yt-desc a{ color:var(--yt-link)!important; }
  #description-box, #descriptionWrapper{ margin:0!important; }
  .yt-primary hr{ display:none; }
  #comments{ margin-top:8px; }
  #comments .channel-profile img, #comments img.channel-profile{ border-radius:50%; }
  #comments .h-box, #comments .pure-g{ padding-left:0!important; }
  #comments a[href^="/channel"] b, #comments b{ font-size:13px; }
  #comments p{ font-size:14px; line-height:20px; }

  /* Video liên quan */
  .yt-secondary .yt-rel{ display:flex!important; gap:8px; margin:0 0 8px!important; width:100%!important; padding:0!important; }
  .yt-rel-thumb{ position:relative; flex:none; width:168px; display:block; }
  .yt-rel-thumb .thumbnail, .yt-rel-thumb > img{
    position:relative; width:168px!important; height:auto!important; aspect-ratio:16/9; border-radius:8px; overflow:hidden;
    background:var(--yt-bg2); display:block; margin:0!important;
  }
  .yt-rel-thumb img{ width:100%!important; height:100%!important; object-fit:cover; display:block; border-radius:8px; }
  .yt-rel-thumb .bottom-right-overlay{ position:absolute; right:4px; bottom:4px; margin:0; }
  .yt-rel-thumb .length, .yt-rel-thumb .bottom-right-overlay p{
    position:static; margin:0!important; background:rgba(0,0,0,.8)!important; color:#fff!important;
    font-size:12px!important; font-weight:500; line-height:16px!important; padding:1px 4px!important; border-radius:4px!important;
  }
  .yt-rel-thumb > .length, .yt-rel-thumb .thumbnail > .length{ position:absolute!important; right:4px; bottom:4px; z-index:1; }
  .yt-rel-info{ flex:1; min-width:0; font-size:12px; line-height:18px; color:var(--yt-text2); }
  .yt-rel-info .yt-rel-title, .yt-rel-info .yt-rel-title p{
    display:block; width:auto!important; margin:0 0 4px!important; padding:0!important;
    font-size:14px!important; line-height:20px!important; font-weight:500!important; color:var(--yt-text)!important;
  }
  .yt-rel-info .yt-rel-title p{ display:-webkit-box!important; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .yt-rel-info h5, .yt-rel-info p:not(.yt-rel-title p){ margin:0!important; font-size:12px!important; line-height:18px!important; font-weight:400!important; }
  .yt-rel-info h5{ display:block!important; }
  .yt-rel-info h5 > *{ width:auto!important; display:block!important; text-align:left!important; }
  .yt-rel-info b, .yt-rel-info a:not(.yt-rel-title){ font-weight:400!important; color:var(--yt-text2)!important; }
  .yt-rel-info a:not(.yt-rel-title):hover{ color:var(--yt-text)!important; }
  .yt-secondary .pure-control-group{ margin:0 0 12px; font-size:14px; }
  .yt-secondary hr{ display:none; }
  .yt-secondary .pure-control-group, .yt-secondary label{ font-size:14px; }

  @media (max-width:1016px){
    .yt-watch-layout{ flex-direction:column; padding:0; }
    .yt-primary{ padding:0 12px; }
    .yt-secondary{ width:auto; padding:0 12px; }
    #player-container, #player-container .video-js{ border-radius:0; margin:0 -12px!important; }
  }

  /* ---------- Chung ---------- */
  footer{ padding:24px; color:var(--yt-text2); font-size:12px; opacity:.8; }
  footer a{ color:var(--yt-text2)!important; }
  .pure-button-primary, .pure-button{ border-radius:18px!important; }
  input[type="search"], input[type="text"], select{ border-radius:8px; }
  .page-nav-container, .page-navigation{ padding:0 24px 24px; }
  .page-nav-container a, .pure-button.pure-button-secondary{
    background:var(--yt-bg2)!important; color:var(--yt-text)!important; border-radius:18px!important; border:0!important; padding:8px 16px!important;
  }
  ::-webkit-scrollbar{ width:8px; height:8px; }
  ::-webkit-scrollbar-thumb{ background:var(--yt-bg3); border-radius:8px; }
  ::-webkit-scrollbar-track{ background:transparent; }
  `;

  function injectCSS() {
    if (document.getElementById('yt-ui-style')) return;
    const s = document.createElement('style');
    s.id = 'yt-ui-style';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  injectCSS();

  /* ===================== Theme Catppuccin ===================== */
  const THEMES = [
    ['', 'YouTube (mặc định)', ['#0f0f0f', '#f1f1f1', '#ff0033']],
    ['latte', 'Catppuccin Latte', ['#eff1f5', '#4c4f69', '#8839ef']],
    ['frappe', 'Catppuccin Frappé', ['#303446', '#c6d0f5', '#ca9ee6']],
    ['macchiato', 'Catppuccin Macchiato', ['#24273a', '#cad3f5', '#c6a0f6']],
    ['mocha', 'Catppuccin Mocha', ['#1e1e2e', '#cdd6f4', '#cba6f7']],
  ];
  const getTheme = () => { try { return localStorage.getItem('yt-ctp') || ''; } catch (e) { return ''; } };
  function applyTheme(t) {
    const root = document.documentElement;
    if (t) root.setAttribute('data-ctp', t); else root.removeAttribute('data-ctp');
    try { localStorage.setItem('yt-ctp', t); } catch (e) {}
    document.querySelectorAll('#yt-theme-menu button').forEach((b) => b.classList.toggle('active', b.dataset.t === t));
  }
  if (getTheme()) document.documentElement.setAttribute('data-ctp', getTheme());

  /* ===================== Icon ===================== */
  const ICON = {
    menu: '<svg viewBox="0 0 24 24"><path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><path d="m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z"/></svg>',
    trending: '<svg viewBox="0 0 24 24"><path d="M19 3.87v9.77C19 17.7 15.86 21 12 21s-7-3.3-7-7.37c0-3.13 1.69-5.43 3-6.67v.45C8 9.6 9.42 11 11 11c1.56 0 2.65-.95 2.65-2.68C13.65 6.25 12.4 4.5 12 3c1.26.2 4.65 1.8 7 .87z"/></svg>',
    subs: '<svg viewBox="0 0 24 24"><path d="M10 18v-6l5 3-5 3zm7-15H7v1h10V3zm3 3H4v1h16V6zm2 3H2v12h20V9zM3 10h18v10H3V10z"/></svg>',
    history: '<svg viewBox="0 0 24 24"><path d="M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM22 12c0 5.51-4.49 10-10 10S2 17.51 2 12h1c0 4.96 4.04 9 9 9s9-4.04 9-9-4.04-9-9-9C8.81 3 5.92 4.64 4.28 7.38c-.11.18-.22.37-.31.56L3.94 8H8v1H1.96V3h1v4.74c.04-.09.07-.17.11-.25.11-.22.23-.42.35-.63C5.22 3.86 8.51 2 12 2c5.51 0 10 4.49 10 10z"/></svg>',
    playlist: '<svg viewBox="0 0 24 24"><path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3v-8l7 4-7 4z"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><path d="M12 9.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-1c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM13.22 3l.55 2.2.13.51.5.18c.61.23 1.19.56 1.72.98l.4.32.5-.14 2.17-.62 1.22 2.11-1.63 1.59-.37.36.08.51c.05.32.08.64.08.98s-.03.66-.08.98l-.08.51.37.36 1.63 1.59-1.22 2.11-2.17-.62-.5-.14-.4.32c-.53.43-1.11.76-1.72.98l-.5.18-.13.51-.55 2.24h-2.44l-.55-2.2-.13-.51-.5-.18c-.6-.23-1.18-.56-1.72-.99l-.4-.32-.5.14-2.17.62-1.21-2.12 1.63-1.59.37-.36-.08-.51c-.05-.32-.08-.65-.08-.98s.03-.66.08-.98l.08-.51-.37-.36L3.6 8.56l1.22-2.11 2.17.62.5.14.4-.32c.53-.44 1.11-.77 1.72-.99l.5-.18.13-.51.54-2.21h2.44M14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14s-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2z"/></svg>',
    palette: '<svg viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10a2.5 2.5 0 0 0 1.85-4.18.5.5 0 0 1 .37-.82H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm4 13h-1.78c-1.38 0-2.5 1.12-2.5 2.5 0 .64.25 1.22.64 1.66.15.17.14.29.14.34 0 .28-.22.5-.5.5-4.96 0-9-4.04-9-9s4.04-9 9-9 9 3.59 9 8c0 2.76-2.24 5-5 5zM6.5 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm3-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm3 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>',
    logo: '<svg viewBox="0 0 29 20"><path fill="#FF0033" d="M14.48 20s9.06 0 11.3-.6a3.6 3.6 0 0 0 2.56-2.56c.6-2.25.6-6.84.6-6.84s0-4.6-.6-6.84A3.6 3.6 0 0 0 25.78.6C23.54 0 14.48 0 14.48 0S5.43 0 3.18.6A3.6 3.6 0 0 0 .62 3.16C.03 5.4.03 10 .03 10s0 4.59.6 6.84a3.6 3.6 0 0 0 2.55 2.56c2.25.6 11.3.6 11.3.6Z"/><path fill="#fff" d="m19.1 10-7.53-4.33v8.66L19.1 10Z"/></svg>'
  };

  /* ===================== Tiện ích ===================== */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, attrs = {}, html = '') => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (html) e.innerHTML = html;
    return e;
  };
  const AVATAR_COLORS = ['#e53935','#d81b60','#8e24aa','#5e35b1','#3949ab','#1e88e5','#039be5','#00897b','#43a047','#7cb342','#f4511e','#6d4c41','#546e7a'];
  function colorFor(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
  }
  // "566033 views" → "566K views" / "566 N views" theo ngôn ngữ trang
  const compactFmt = (() => {
    try { return new Intl.NumberFormat(document.documentElement.lang || navigator.language, { notation: 'compact', maximumFractionDigits: 1 }); }
    catch (e) { return null; }
  })();
  function compactViews(node) {
    if (!compactFmt || node.dataset.ytCompact) return;
    node.dataset.ytCompact = '1';
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let t;
    while ((t = walker.nextNode())) {
      const before = t.nodeValue;
      const after = before.replace(/(^|\s)(\d{1,3}(?:[.,   ]\d{3})+|\d{4,})(?=\s|$)/, (m, pre, num) => {
        const n = parseInt(num.replace(/[^\d]/g, ''), 10);
        return isNaN(n) ? m : pre + compactFmt.format(n);
      });
      if (after !== before) { t.nodeValue = after; break; }
    }
  }
  const isWatch = () => location.pathname === '/watch' || location.pathname.startsWith('/embed');

  /* ===================== Header ===================== */
  function buildHeader() {
    if ($('#yt-header')) return;
    const q = new URLSearchParams(location.search).get('q') || '';
    const header = el('div', { id: 'yt-header' });
    header.innerHTML = `
      <div class="yt-start">
        <button class="yt-icon-btn" id="yt-menu-btn" title="Menu">${ICON.menu}</button>
        <a id="yt-logo" href="/" title="Trang chủ">${ICON.logo}<span>YouTube</span></a>
      </div>
      <div class="yt-center">
        <form id="yt-search" action="/search" method="get" role="search">
          <input type="search" name="q" placeholder="Tìm kiếm" autocomplete="off" />
          <button type="submit" title="Tìm kiếm">${ICON.search}</button>
        </form>
      </div>
      <div class="yt-end"></div>`;
    header.querySelector('input').value = q;

    // chuyển phần đăng nhập / tùy chọn của Invidious sang header
    const end = header.querySelector('.yt-end');
    const wrap = el('div', { id: 'yt-theme-wrap' });
    wrap.innerHTML = `<button class="yt-icon-btn" id="yt-theme-btn" title="Giao diện">${ICON.palette}</button><div id="yt-theme-menu"><div class="yt-tm-title">Giao diện</div></div>`;
    const menu = wrap.querySelector('#yt-theme-menu');
    THEMES.forEach(([id, name, dots]) => {
      const b = el('button', { 'data-t': id, type: 'button' },
        `<span class="yt-tm-dots">${dots.map((c) => `<i style="background:${c}"></i>`).join('')}</span><span>${name}</span><span class="yt-tm-check">✓</span>`);
      if (id === getTheme()) b.classList.add('active');
      b.addEventListener('click', () => { applyTheme(id); menu.classList.remove('open'); });
      menu.appendChild(b);
    });
    wrap.querySelector('#yt-theme-btn').addEventListener('click', (e) => { e.stopPropagation(); menu.classList.toggle('open'); });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) menu.classList.remove('open'); });
    end.appendChild(wrap);

    const userField = $('.navbar .user-field');
    if (userField) end.appendChild(userField);

    document.body.prepend(header);

    header.querySelector('#yt-menu-btn').addEventListener('click', () => {
      const root = document.documentElement;
      if (isWatch() || window.innerWidth <= 1312) {
        root.classList.toggle(isWatch() ? 'yt-guide-open' : 'yt-full');
      } else {
        root.classList.toggle('yt-mini');
        try { localStorage.setItem('yt-mini', root.classList.contains('yt-mini') ? '1' : '0'); } catch (e) {}
      }
    });

    // phím "/" để focus ô tìm kiếm như YouTube
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault();
        header.querySelector('input').focus();
      }
    });
  }

  /* ===================== Sidebar ===================== */
  function buildGuide() {
    if ($('#yt-guide')) return;
    const items = [
      ['/feed/popular', 'Trang chủ', ICON.home],
      ['/feed/trending', 'Thịnh hành', ICON.trending],
      ['/feed/subscriptions', 'Kênh đăng ký', ICON.subs],
      null,
      ['/feed/history', 'Video đã xem', ICON.history],
      ['/feed/playlists', 'Danh sách phát', ICON.playlist],
      null,
      ['/preferences', 'Cài đặt', ICON.settings],
    ];
    const guide = el('nav', { id: 'yt-guide' });
    for (const it of items) {
      if (!it) { guide.appendChild(el('hr')); continue; }
      const [href, label, icon] = it;
      const a = el('a', { href, title: label }, `${icon}<span>${label}</span>`);
      const path = location.pathname;
      if (path === href || (href === '/feed/popular' && path === '/')) a.classList.add('active');
      guide.appendChild(a);
    }
    document.body.appendChild(guide);

    // click ra ngoài để đóng overlay
    document.addEventListener('click', (e) => {
      const root = document.documentElement;
      if (!root.classList.contains('yt-guide-open') && !root.classList.contains('yt-full')) return;
      if (e.target.closest('#yt-guide, #yt-menu-btn')) return;
      root.classList.remove('yt-guide-open', 'yt-full');
    });
  }

  /* ===================== Thẻ video (lưới) ===================== */
  function processCards(root = document) {
    // Mỗi video trong Invidious: .pure-u-* > .h-box chứa .thumbnail, không nằm trong trang watch-sidebar
    $$('.thumbnail', root).forEach((thumb) => {
      const box = thumb.closest('.h-box');
      if (!box || box.classList.contains('yt-card') || box.closest('.yt-secondary, #player-container, #yt-header')) return;
      const cell = box.parentElement;
      if (!cell || !/pure-u-/.test(cell.className)) return;
      const grid = cell.parentElement;
      if (!grid) return;

      box.classList.add('yt-card');
      cell.classList.add('yt-cell');
      grid.classList.add('yt-grid');

      // tiêu đề: thẻ <p> đầu tiên trong link chứa thumbnail
      const thumbLink = thumb.closest('a');
      let titleEl = thumbLink ? $$('p', thumbLink).find((p) => !p.closest('.thumbnail')) : null;
      if (!titleEl) titleEl = $$('a > p', box).find((p) => !p.closest('.thumbnail'));

      const rows = $$('.video-card-row', box).filter((r) => !r.closest('.thumbnail'));
      const channelEl = $('.channel-name', box);
      const channelName = (channelEl ? channelEl.textContent : (titleEl ? titleEl.textContent : '?')).trim();

      const meta = el('div', { class: 'yt-meta' });
      const channelLink = channelEl ? channelEl.closest('a') : null;
      const avatar = el(channelLink ? 'a' : 'div', { class: 'yt-avatar' });
      if (channelLink) avatar.setAttribute('href', channelLink.getAttribute('href'));
      avatar.textContent = (channelName.replace(/^[^\p{L}\p{N}]+/u, '')[0] || '?');
      avatar.style.background = colorFor(channelName);

      const text = el('div', { class: 'yt-text' });
      if (titleEl) {
        const titleA = el('a', { href: thumbLink ? thumbLink.getAttribute('href') : '#' });
        titleEl.classList.add('yt-title');
        titleA.appendChild(titleEl);
        text.appendChild(titleA);
      }
      // gộp các dòng thông tin: dòng kênh giữ nguyên, các dòng video-data gộp vào 1 hàng "lượt xem • thời gian"
      const stats = el('div', { class: 'yt-stats' });
      rows.forEach((r) => {
        if (r.querySelector('.channel-name')) text.appendChild(r);
        else {
          const datas = $$('.video-data', r);
          if (datas.length) {
            // YouTube hiển thị lượt xem trước, thời gian sau
            const views = datas.filter((d) => /view|lượt|xem/i.test(d.textContent));
            const others = datas.filter((d) => !views.includes(d));
            views.forEach(compactViews);
            [...views, ...others].forEach((d) => stats.appendChild(d));
            r.remove();
          } else text.appendChild(r);
        }
      });
      if (stats.childElementCount) text.appendChild(stats);
      // các phần tử thừa khác (vd. nút xoá khỏi playlist) giữ lại cuối
      meta.appendChild(avatar);
      meta.appendChild(text);
      box.appendChild(meta);
    });
  }

  /* ===================== Trang xem video ===================== */
  function processWatch() {
    if (!isWatch() || $('.yt-watch-layout')) return;
    const player = $('#player-container');
    if (!player) return;
    const contents = $('#contents') || document.body;

    const anchor = $('#comments') || $('#description-box') || $('#descriptionWrapper') || $('#published-date');
    const mainGrid = anchor ? anchor.closest('.pure-g') : null;
    const cols = mainGrid ? Array.from(mainGrid.children).filter((c) => /pure-u-/.test(c.className)) : [];

    const layout = el('div', { class: 'yt-watch-layout' });
    const primary = el('div', { class: 'yt-primary' });
    const secondary = el('div', { class: 'yt-secondary' });
    layout.append(primary, secondary);
    // đặt layout ở cấp con trực tiếp của #contents để thoát khỏi các khung bọc hẹp
    let top = player;
    while (top.parentElement && top.parentElement !== contents && top.parentElement !== document.body) top = top.parentElement;
    top.parentNode.insertBefore(layout, top);
    primary.appendChild(player);

    // khối tiêu đề (h-box chứa h1) đứng ngay sau player
    const h1 = $$('h1', contents).find((h) => !h.closest('.yt-watch-layout'));
    const titleBox = h1 ? (h1.closest('.h-box') || h1) : null;
    if (titleBox) primary.appendChild(titleBox);

    // xác định 3 cột: info (trái), main (giữa: kênh, mô tả, bình luận), related (phải)
    let infoCol = null, mainCol = null, relCol = null;
    if (cols.length) {
      mainCol = cols.find((c) => c.contains(anchor)) || null;
      const others = cols.filter((c) => c !== mainCol);
      relCol = others.find((c) => $$('a[href^="/watch"] .thumbnail, a[href^="/watch"] img', c).length > 1) || others[others.length - 1] || null;
      infoCol = others.find((c) => c !== relCol) || null;
    }

    // hàng kênh: avatar + tên + nút đăng ký + chip thông tin
    const ownerRow = el('div', { class: 'yt-owner-row' });
    const left = el('div', { style: 'display:flex;align-items:center;gap:16px;flex-wrap:wrap' });
    const profile = mainCol ? $('.channel-profile', mainCol) : $('.channel-profile');
    if (profile) left.appendChild(profile.closest('a') || profile);
    const sub = $('#subscribe-widget') || $('#subscribe');
    if (sub) left.appendChild(sub.closest('#subscribe-widget') || sub);
    ownerRow.appendChild(left);

    const chips = el('div', { class: 'yt-chips' });
    ['#likes', '#dislikes'].forEach((s) => { const n = $(s); if (n) chips.appendChild(n); });
    const ytLink = $('#watch-on-youtube') || $('a[href*="youtube.com/watch"]', infoCol || document);
    if (ytLink) chips.appendChild(ytLink);
    const dl = infoCol ? $('form[action^="/download"], #download_widget', infoCol) : null;
    ownerRow.appendChild(chips);
    primary.appendChild(ownerRow);

    // hộp mô tả kiểu YouTube: lượt xem + ngày + mô tả
    const desc = el('div', { class: 'yt-desc' });
    const head = el('div', { class: 'yt-desc-head' });
    const views = $('#views'); const pub = $('#published-date');
    if (views) { views.style.display = 'inline'; head.appendChild(views); }
    if (pub) { pub.style.display = 'inline'; if (views) head.appendChild(document.createTextNode('  ')); head.appendChild(pub); }
    if (head.childNodes.length) desc.appendChild(head);
    const descBox = $('#description-box') || $('#descriptionWrapper');
    if (descBox) desc.appendChild(descBox);
    // phần info còn lại (genre, license, family-friendly, tải xuống…) để trong hộp mô tả
    if (infoCol) {
      const extra = el('details', { style: 'margin-top:8px' }, '<summary style="cursor:pointer;font-weight:600">Thông tin khác</summary>');
      Array.from((infoCol.querySelector('.h-box') || infoCol).children).forEach((c) => extra.appendChild(c));
      if (dl) extra.appendChild(dl);
      if (extra.children.length > 1) desc.appendChild(extra);
      infoCol.remove();
    }
    if (desc.childNodes.length) primary.appendChild(desc);

    // phần còn lại của cột giữa (bình luận…)
    if (mainCol) {
      Array.from((mainCol.querySelector(':scope > .h-box') || mainCol).children).forEach((c) => primary.appendChild(c));
      mainCol.remove();
    }

    // cột video liên quan
    if (relCol) {
      Array.from((relCol.querySelector(':scope > .h-box') || relCol).children).forEach((c) => secondary.appendChild(c));
      relCol.remove();
    }
    if (mainGrid && !mainGrid.children.length) mainGrid.remove();
    processRelated();
  }

  /* Video liên quan: dựng lại mỗi mục thành [ảnh 168px] [tiêu đề / kênh / lượt xem],
     không phụ thuộc việc Invidious có bọc từng mục trong <div> hay không. */
  const isThumbLink = (n) => n.nodeType === 1 && (
    (n.matches('a') && /\/watch\?/.test(n.getAttribute('href') || '') && n.querySelector('img')) ||
    !!Array.from(n.querySelectorAll('a')).find((a) => /\/watch\?/.test(a.getAttribute('href') || '') && a.querySelector('img'))
  );
  const countThumbLinks = (n) => Array.from(n.querySelectorAll('a')).filter((a) => /\/watch\?/.test(a.getAttribute('href') || '') && a.querySelector('img')).length;

  function processRelated() {
    const sec = $('.yt-secondary');
    if (!sec) return;
    $$('img', sec).forEach((img) => {
      const a = img.closest('a');
      if (!a || a.closest('.yt-rel') || !/\/watch\?/.test(a.getAttribute('href') || '')) return;

      // tìm khung bọc riêng của mục này (nếu có)
      let start = a;
      while (start.parentElement && start.parentElement !== sec &&
             !start.parentElement.classList.contains('h-box') &&
             countThumbLinks(start.parentElement) === 1) start = start.parentElement;

      // các node thuộc về mục này
      let nodes;
      if (start !== a) nodes = Array.from(start.childNodes);
      else {
        nodes = [a];
        let n = a.nextSibling;
        while (n && !(n.nodeType === 1 && (n.tagName === 'HR' || isThumbLink(n)))) { nodes.push(n); n = n.nextSibling; }
      }

      const item = el('div', { class: 'yt-rel' });
      start.parentNode.insertBefore(item, start);

      const href = a.getAttribute('href');
      const thumbLink = el('a', { class: 'yt-rel-thumb', href });
      let thumb = img.closest('div.thumbnail');
      if (!thumb || !a.contains(thumb)) thumb = img;
      thumbLink.appendChild(thumb);
      // thời lượng có thể nằm ngoài khung thumbnail
      $$('.length, .bottom-right-overlay', a).forEach((x) => { if (!thumbLink.contains(x)) thumbLink.appendChild(x); });

      const info = el('div', { class: 'yt-rel-info' });
      a.classList.add('yt-rel-title');
      nodes.forEach((n) => info.appendChild(n));

      item.append(thumbLink, info);
      if (start !== a) start.remove();
    });
  }

  /* ===================== Khởi chạy ===================== */
  function init() {
    injectCSS();
    const root = document.documentElement;
    if (isWatch()) root.classList.add('yt-watch');
    try { if (localStorage.getItem('yt-mini') === '1') root.classList.add('yt-mini'); } catch (e) {}
    if (document.body.classList.contains('dark-theme')) root.classList.add('yt-dark');

    buildHeader();
    buildGuide();
    processWatch();
    processCards();

    // nội dung được tải động (bình luận, video liên quan, phân trang…)
    let pending = false;
    new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        processCards();
        processRelated();
      });
    }).observe(document.body, { childList: true, subtree: true });

    if (location.pathname === '/') document.title = document.title.replace(/Invidious/i, 'YouTube');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
