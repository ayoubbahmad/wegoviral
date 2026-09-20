import { useState, useRef, useEffect } from 'react';

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FONT_LINK = document.createElement('link');
FONT_LINK.rel = 'stylesheet';
FONT_LINK.href =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap';
document.head.appendChild(FONT_LINK);

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  [data-theme="dark"] {
    --bg:       #0d0f12;
    --surface:  #13161b;
    --surface2: #1a1e25;
    --surface3: #222730;
    --border:   #2a2f3a;
    --border2:  #363d4a;
    --text:     #e8eaf0;
    --text2:    #8d95a6;
    --text3:    #5a6275;
    --accent:   #3b82f6;
    --accent2:  #1d4ed8;
    --accentbg: rgba(59,130,246,0.12);
    --red:      #ef4444;
    --wave-bg:  #0b0e11;
    --play-bg:  #e8eaf0;
    --play-fg:  #0d0f12;
  }
  [data-theme="light"] {
    --bg:       #f1f3f7;
    --surface:  #ffffff;
    --surface2: #f4f5f8;
    --surface3: #e8eaef;
    --border:   #dde1ea;
    --border2:  #c4cad8;
    --text:     #0f1318;
    --text2:    #4b5467;
    --text3:    #909aad;
    --accent:   #2563eb;
    --accent2:  #1d4ed8;
    --accentbg: rgba(37,99,235,0.08);
    --red:      #dc2626;
    --wave-bg:  #e8ecf2;
    --play-bg:  #0f1318;
    --play-fg:  #ffffff;
  }

  body { background: var(--bg); color: var(--text); overflow: hidden; height: 100vh;
    font-family: 'IBM Plex Sans', sans-serif; }
  .app { display: flex; height: 100vh; overflow: hidden; }

  /* smooth theme transitions */
  body, .app, .sidebar-left, .sidebar-right, .main, .topbar, .audio-section,
  .player-controls, .transcript-row, .feature-card, .stat-card, .recent-item,
  .home-hero, .home-body, .btn, .ctrl-btn, .nav-icon, .theme-btn {
    transition: background-color .22s ease, border-color .22s ease, color .22s ease;
  }

  /* ── Left Sidebar ── */
  .sidebar-left {
    width: 56px; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; align-items: center; padding: 12px 0; gap: 4px;
    z-index: 10; flex-shrink: 0;
  }
  .nav-logo {
    width: 32px; height: 32px; border-radius: 9px; background: var(--accent);
    display: flex; align-items: center; justify-content: center; margin-bottom: 8px; flex-shrink: 0;
  }
  .nav-icon {
    width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center;
    justify-content: center; cursor: pointer; color: var(--text3);
  }
  .nav-icon:hover { background: var(--surface2); color: var(--text2); }
  .nav-icon.active { background: var(--accent); color: #fff; }
  .nav-icon svg { width: 18px; height: 18px; }
  .nav-divider { width: 24px; height: 1px; background: var(--border); margin: 4px 0; flex-shrink:0; }
  .nav-spacer { flex: 1; }
  .theme-btn {
    width: 40px; height: 40px; border-radius: 10px; border: none;
    background: var(--surface2); color: var(--text3); display: flex; align-items: center;
    justify-content: center; cursor: pointer;
  }
  .theme-btn:hover { background: var(--surface3); color: var(--text2); }
  .theme-btn svg { width: 17px; height: 17px; }

  /* ── Right Sidebar ── */
  .sidebar-right {
    width: 248px; background: var(--surface); border-left: 1px solid var(--border);
    display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;
  }
  .sidebar-right-header {
    padding: 13px 14px; border-bottom: 1px solid var(--border);
    font-size: 11px; font-weight: 600; color: var(--text3);
    text-transform: uppercase; letter-spacing: .08em; font-family: 'IBM Plex Mono', monospace;
  }
  .sidebar-right-body { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 16px; }
  .option-group { display: flex; flex-direction: column; gap: 8px; }
  .section-title { font-size: 11px; font-weight: 600; color: var(--text2); text-transform: uppercase;
    letter-spacing: .06em; font-family: 'IBM Plex Mono', monospace; margin-bottom: 2px; }
  .option-label { font-size: 12px; color: var(--text2); }
  .option-row { display: flex; align-items: center; justify-content: space-between; }
  .number-input {
    width: 68px; background: var(--surface2); border: 1px solid var(--border); border-radius: 5px;
    color: var(--text); font-size: 12px; padding: 4px 8px; text-align: right;
    font-family: 'IBM Plex Mono', monospace; outline: none;
  }
  .number-input:focus { border-color: var(--accent); }
  .toggle-row { display: flex; align-items: center; justify-content: space-between; }
  .toggle { width: 32px; height: 18px; border-radius: 9px; background: var(--surface3);
    border: 1px solid var(--border); cursor: pointer; position: relative; }
  .toggle.on { background: var(--accent); border-color: var(--accent); }
  .toggle::after { content: ''; position: absolute; width: 12px; height: 12px; border-radius: 50%;
    background: #fff; top: 2px; left: 2px; transition: left .15s; }
  .toggle.on::after { left: 16px; }
  .toggle-label { font-size: 12px; color: var(--text2); }
  .kbd { display: inline-block; background: var(--surface3); border: 1px solid var(--border2);
    border-radius: 3px; padding: 1px 5px; font-size: 10px; color: var(--text3);
    font-family: 'IBM Plex Mono', monospace; }
  .kbd-section { display: flex; flex-direction: column; gap: 5px; }
  .kbd-row { display: flex; justify-content: space-between; align-items: center; }
  .kbd-desc { font-size: 11px; color: var(--text3); }
  .kbd-keys { display: flex; gap: 3px; }
  .sep { height: 1px; background: var(--border); flex-shrink: 0; }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
  .topbar {
    height: 48px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 16px; gap: 12px; flex-shrink: 0;
  }
  .topbar-title { font-size: 13px; font-weight: 500; color: var(--text2);
    font-family: 'IBM Plex Mono', monospace; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis; max-width: 280px; }
  .topbar-badge { background: var(--surface3); border: 1px solid var(--border); border-radius: 4px;
    padding: 2px 8px; font-size: 11px; color: var(--text3); font-family: 'IBM Plex Mono', monospace; flex-shrink:0; }
  .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 6px;
    border: 1px solid var(--border); background: var(--surface2); color: var(--text2);
    font-size: 12px; cursor: pointer; font-family: inherit; white-space: nowrap; }
  .btn:hover { background: var(--surface3); color: var(--text); border-color: var(--border2); }
  .btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .btn.primary:hover { background: var(--accent2); }
  .btn svg { width: 14px; height: 14px; flex-shrink:0; }

  /* ── Audio section ── */
  .audio-section { background: var(--surface); border-bottom: 1px solid var(--border);
    flex-shrink: 0; display: flex; flex-direction: column; }
  .track-label-col { width: 80px; flex-shrink: 0; border-right: 1px solid var(--border);
    display: flex; align-items: center; justify-content: flex-end; padding: 0 10px; }
  .track-label-col span { font-size: 10px; color: var(--text3); font-family: 'IBM Plex Mono', monospace;
    text-transform: uppercase; letter-spacing: .06em; }
  .waveform-scroll { overflow-x: auto; overflow-y: hidden; flex: 1; }
  .waveform-scroll::-webkit-scrollbar { height: 5px; }
  .waveform-scroll::-webkit-scrollbar-track { background: var(--surface2); }
  .waveform-scroll::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
  .track-inner { position: relative; user-select: none; }
  .time-ruler { height: 24px; position: relative; border-bottom: 1px solid var(--border); }
  .time-ruler canvas { display: block; }
  .seek-overlay { position: absolute; inset: 0; cursor: crosshair; z-index: 1; }
  .block-pill { position: absolute; top: 5px; bottom: 5px; border-radius: 8px; cursor: pointer;
    border: 1.5px solid transparent; z-index: 2; overflow: hidden; }
  .block-pill:hover { filter: brightness(1.12); }
  .block-pill.active { border-color: rgba(255,255,255,0.5); box-shadow: 0 0 0 2px rgba(59,130,246,.3); }
  .block-pill-label { position: absolute; bottom: 3px; left: 6px; right: 6px; font-size: 9px;
    color: rgba(255,255,255,0.85); font-family: 'IBM Plex Mono', monospace;
    pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    text-shadow: 0 1px 3px rgba(0,0,0,0.6); }
  .resize-handle { position: absolute; top: 0; bottom: 0; width: 10px; cursor: ew-resize; z-index: 5;
    display: flex; align-items: center; justify-content: center; }
  .resize-handle.left { left: 0; }
  .resize-handle.right { right: 0; }
  .resize-handle::after { content: ''; width: 2px; height: 14px; border-radius: 1px;
    background: rgba(255,255,255,0.55); }
  .playhead { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--red);
    pointer-events: none; z-index: 10; box-shadow: 0 0 6px rgba(239,68,68,.6); }
  .playhead::before { content: ''; position: absolute; top: -1px; left: -5px; width: 0;
    border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid var(--red); }

  /* ── Player controls ── */
  .player-controls { height: 46px; display: flex; align-items: center;
    border-top: 1px solid var(--border); background: var(--surface); flex-shrink: 0; }
  .player-controls-indent { width: 80px; flex-shrink: 0; border-right: 1px solid var(--border); height: 100%; }
  .controls-inner { flex: 1; display: flex; align-items: center; gap: 10px; padding: 0 14px; }
  .controls-right { margin-left: auto; display: flex; align-items: center; gap: 10px; padding-right: 14px; flex-shrink: 0; }
  .ctrl-btn { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border);
    background: var(--surface2); color: var(--text2); display: flex; align-items: center;
    justify-content: center; cursor: pointer; flex-shrink: 0; }
  .ctrl-btn:hover { background: var(--surface3); color: var(--text); }
  .ctrl-btn.play { width: 34px; height: 34px; background: var(--play-bg); border-color: var(--play-bg); color: var(--play-fg); }
  .ctrl-btn.play:hover { opacity: .85; }
  .ctrl-btn svg { width: 13px; height: 13px; }
  .ctrl-btn.play svg { width: 14px; height: 14px; }
  .time-display { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text2);
    min-width: 100px; white-space: nowrap; }
  .time-display span { color: var(--text3); }
  .zoom-row { display: flex; align-items: center; gap: 6px; }
  .slider { -webkit-appearance: none; appearance: none; height: 3px; border-radius: 2px;
    background: var(--surface3); outline: none; cursor: pointer; }
  .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 11px; height: 11px;
    border-radius: 50%; background: var(--text2); cursor: pointer; }
  .volume-row { display: flex; align-items: center; gap: 6px; }
  .volume-row svg { width: 13px; height: 13px; color: var(--text3); }
  .add-cue-btn { font-size: 12px; color: var(--text2); background: transparent;
    border: 1px solid var(--border); cursor: pointer; font-family: inherit; padding: 4px 10px; border-radius: 4px; }
  .add-cue-btn:hover { background: var(--surface2); color: var(--text); border-color: var(--border2); }

  /* ── Transcripts ── */
  .transcripts-area { flex: 1; overflow-y: auto; padding: 10px 14px;
    display: flex; flex-direction: column; gap: 3px; }
  .transcripts-area::-webkit-scrollbar { width: 5px; }
  .transcripts-area::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
  .transcript-row { display: flex; gap: 10px; align-items: flex-start; padding: 7px 9px;
    border-radius: 7px; border: 1px solid transparent; cursor: pointer; }
  .transcript-row:hover { background: var(--surface2); border-color: var(--border); }
  .transcript-row.active { background: var(--accentbg); border-color: var(--accent); }
  .ts-time { display: flex; flex-direction: column; gap: 2px; min-width: 64px; flex-shrink: 0; }
  .ts-time input { background: transparent; border: 1px solid transparent; outline: none;
    color: var(--text3); font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    width: 64px; padding: 1px 3px; border-radius: 3px; }
  .ts-time input:hover:not(:focus) { border-color: var(--border); color: var(--text2); }
  .ts-time input:focus { background: var(--surface); border-color: var(--accent); color: var(--text); }
  .ts-body { flex: 1; min-width: 0; }
  .ts-text { font-size: 13.5px; line-height: 1.55; color: var(--text); background: transparent;
    border: none; outline: none; width: 100%; resize: none; font-family: inherit; min-height: 22px; }
  .ts-counter { font-size: 10px; color: var(--text3); font-family: 'IBM Plex Mono', monospace; margin-top: 3px; }
  .ts-actions { display: flex; gap: 3px; opacity: 0; flex-shrink: 0; }
  .transcript-row:hover .ts-actions { opacity: 1; }
  .ts-action-btn { width: 23px; height: 23px; border-radius: 5px; border: 1px solid var(--border);
    background: var(--surface3); color: var(--text3); display: flex; align-items: center;
    justify-content: center; cursor: pointer; }
  .ts-action-btn:hover { background: var(--surface2); color: var(--text2); border-color: var(--border2); }
  .ts-action-btn.danger:hover { background: rgba(239,68,68,.12); color: var(--red); border-color: var(--red); }
  .ts-action-btn svg { width: 11px; height: 11px; }

  /* ── Drop zone ── */
  .drop-zone { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 14px; border: 2px dashed var(--border2); border-radius: 12px; margin: 20px; cursor: pointer; color: var(--text3); }
  .drop-zone:hover, .drop-zone.drag-over { border-color: var(--accent); color: var(--accent); background: var(--accentbg); }
  .drop-zone svg { width: 40px; height: 40px; opacity: .5; }
  .drop-zone h2 { font-size: 16px; font-weight: 500; color: var(--text2); }
  .drop-zone p { font-size: 12px; }
  .empty-state { display: flex; align-items: center; justify-content: center; padding: 40px;
    color: var(--text3); font-size: 13px; }

  /* ── HOME PAGE ── */
  .home-page { flex: 1; overflow-y: auto; background: var(--bg); display: flex; flex-direction: column; }
  .home-hero { padding: 52px 48px 36px; border-bottom: 1px solid var(--border); background: var(--surface); }
  .home-hero-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accentbg);
    border: 1px solid var(--accent); border-radius: 20px; padding: 3px 10px;
    font-size: 11px; color: var(--accent); font-family: 'IBM Plex Mono', monospace; margin-bottom: 20px; }
  .home-hero h1 { font-size: 36px; font-weight: 600; color: var(--text); line-height: 1.18;
    letter-spacing: -.025em; margin-bottom: 14px; }
  .home-hero h1 em { font-style: normal; color: var(--accent); }
  .home-hero p { font-size: 15px; color: var(--text2); line-height: 1.65; max-width: 500px; margin-bottom: 28px; }
  .home-hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .hero-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px;
    font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; border: 1px solid var(--border); }
  .hero-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .hero-btn.primary:hover { background: var(--accent2); }
  .hero-btn.secondary { background: var(--surface2); color: var(--text2); }
  .hero-btn.secondary:hover { background: var(--surface3); color: var(--text); }
  .hero-btn svg { width: 15px; height: 15px; }
  .hero-wave { margin-top: 32px; border-radius: 10px; overflow: hidden;
    border: 1px solid var(--border); height: 68px; background: var(--wave-bg); position: relative; }
  .hero-wave canvas { display: block; }

  .home-body { padding: 32px 48px 48px; display: flex; flex-direction: column; gap: 36px; }
  .home-section-label { font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: .08em; color: var(--text3); font-family: 'IBM Plex Mono', monospace; margin-bottom: 14px; }

  .home-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; }
  .stat-value { font-size: 30px; font-weight: 600; color: var(--text); font-family: 'IBM Plex Mono', monospace; line-height: 1; }
  .stat-label { font-size: 12px; color: var(--text3); margin-top: 6px; }

  .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .feature-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
    padding: 16px 18px; display: flex; flex-direction: column; gap: 8px; }
  .feature-icon { width: 30px; height: 30px; border-radius: 7px; background: var(--accentbg);
    display: flex; align-items: center; justify-content: center; color: var(--accent); }
  .feature-icon svg { width: 15px; height: 15px; }
  .feature-title { font-size: 13px; font-weight: 600; color: var(--text); }
  .feature-desc { font-size: 12px; color: var(--text3); line-height: 1.5; }

  .recent-list { display: flex; flex-direction: column; gap: 6px; }
  .recent-item { background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    padding: 12px 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; }
  .recent-item:hover { border-color: var(--border2); background: var(--surface2); }
  .recent-icon { width: 34px; height: 34px; border-radius: 7px; background: var(--surface3);
    display: flex; align-items: center; justify-content: center; color: var(--text3); flex-shrink: 0; }
  .recent-icon svg { width: 15px; height: 15px; }
  .recent-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .recent-meta { font-size: 11px; color: var(--text3); margin-top: 2px; font-family: 'IBM Plex Mono', monospace; }
  .recent-arrow { margin-left: auto; color: var(--text3); display:flex; align-items:center; }
  .recent-arrow svg { width: 14px; height: 14px; }

  *::-webkit-scrollbar { width: 5px; height: 5px; }
  *::-webkit-scrollbar-track { background: transparent; }
  *::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
`;

(() => {
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
})();

// ─── Utils ────────────────────────────────────────────────────────────────────
function formatTime(s) {
  if (isNaN(s) || s < 0) s = 0;
  const m = Math.floor(s / 60),
    sec = Math.floor(s % 60),
    ms = Math.floor((s % 1) * 10);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${ms}`;
}
function parseTime(str) {
  const m = str.match(/^(\d+):(\d+)(?:\.(\d+))?$/);
  if (!m) return NaN;
  return (
    parseInt(m[1]) * 60 +
    parseInt(m[2]) +
    (m[3] ? parseInt(m[3]) / Math.pow(10, m[3].length) : 0)
  );
}
let _uid = 1;
const uid = () => _uid++;

// ─── Icons ───────────────────────────────────────────────────────────────────
const IC = {
  home: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' />
      <polyline points='9 22 9 12 15 12 15 22' />
    </svg>
  ),
  file: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' />
      <polyline points='14 2 14 8 20 8' />
    </svg>
  ),
  history: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <path d='M3 3v5h5' />
      <path d='M3 8A9 9 0 1 0 6 4.5' />
      <polyline points='12 7 12 12 16 14' />
    </svg>
  ),
  settings: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' />
    </svg>
  ),
  upload: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <polyline points='16 16 12 12 8 16' />
      <line x1='12' y1='12' x2='12' y2='21' />
      <path d='M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3' />
    </svg>
  ),
  play: (
    <svg viewBox='0 0 24 24' fill='currentColor'>
      <polygon points='5 3 19 12 5 21 5 3' />
    </svg>
  ),
  pause: (
    <svg viewBox='0 0 24 24' fill='currentColor'>
      <rect x='6' y='4' width='4' height='16' />
      <rect x='14' y='4' width='4' height='16' />
    </svg>
  ),
  back5: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <path d='M2.5 12a9.5 9.5 0 1 0 1-4.3' />
      <path d='M2 3v5h5' />
      <text x='7.5' y='17' fontSize='7.5' fill='currentColor' stroke='none'>
        5
      </text>
    </svg>
  ),
  fwd5: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <path d='M21.5 12a9.5 9.5 0 1 1-1-4.3' />
      <path d='M22 3v5h-5' />
      <text x='9' y='17' fontSize='7.5' fill='currentColor' stroke='none'>
        5
      </text>
    </svg>
  ),
  volume: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
      <path d='M15.54 8.46a5 5 0 010 7.07' />
    </svg>
  ),
  split: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <line x1='12' y1='2' x2='12' y2='22' />
      <path d='M2 12h4M18 12h4' />
    </svg>
  ),
  merge: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <path d='M8 12h8' />
      <path d='M12 8l4 4-4 4' />
    </svg>
  ),
  trash: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <polyline points='3 6 5 6 21 6' />
      <path d='M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2' />
    </svg>
  ),
  add: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <line x1='12' y1='5' x2='12' y2='19' />
      <line x1='5' y1='12' x2='19' y2='12' />
    </svg>
  ),
  zoomin: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <circle cx='11' cy='11' r='8' />
      <line x1='21' y1='21' x2='16.65' y2='16.65' />
      <line x1='11' y1='8' x2='11' y2='14' />
      <line x1='8' y1='11' x2='14' y2='11' />
    </svg>
  ),
  zoomout: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <circle cx='11' cy='11' r='8' />
      <line x1='21' y1='21' x2='16.65' y2='16.65' />
      <line x1='8' y1='11' x2='14' y2='11' />
    </svg>
  ),
  sun: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <circle cx='12' cy='12' r='5' />
      <line x1='12' y1='1' x2='12' y2='3' />
      <line x1='12' y1='21' x2='12' y2='23' />
      <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
      <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
      <line x1='1' y1='12' x2='3' y2='12' />
      <line x1='21' y1='12' x2='23' y2='12' />
      <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
      <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
    </svg>
  ),
  moon: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
    </svg>
  ),
  arrow: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <line x1='5' y1='12' x2='19' y2='12' />
      <polyline points='12 5 19 12 12 19' />
    </svg>
  ),
  mic: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <path d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' />
      <path d='M19 10v2a7 7 0 0 1-14 0v-2' />
      <line x1='12' y1='19' x2='12' y2='23' />
      <line x1='8' y1='23' x2='16' y2='23' />
    </svg>
  ),
  wave: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <polyline points='2 12 5 12 7 4 9 20 11 12 13 12' />
      <polyline points='13 12 15 8 17 16 19 12 22 12' />
    </svg>
  ),
  keyboard: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <rect x='2' y='6' width='20' height='12' rx='2' />
      <path d='M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8' />
    </svg>
  ),
  export: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' />
      <polyline points='7 10 12 15 17 10' />
      <line x1='12' y1='15' x2='12' y2='3' />
    </svg>
  ),
  layers: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
      <polygon points='12 2 2 7 12 12 22 7 12 2' />
      <polyline points='2 17 12 22 22 17' />
      <polyline points='2 12 12 17 22 12' />
    </svg>
  ),
};

// ─── Pill colors ──────────────────────────────────────────────────────────────
const PILL_COLORS = [
  'rgba(59,130,246,0.48)',
  'rgba(99,102,241,0.44)',
  'rgba(20,184,166,0.42)',
  'rgba(139,92,246,0.42)',
];

// ─── BgWaveform ───────────────────────────────────────────────────────────────
function BgWaveform({ audioBuffer, totalWidth, height, theme }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(totalWidth));
    canvas.width = w * dpr;
    canvas.height = height * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, height);
    if (!audioBuffer) {
      ctx.strokeStyle = theme === 'light' ? '#c8d0de' : '#232d3d';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(w, height / 2);
      ctx.stroke();
      return;
    }
    const data = audioBuffer.getChannelData(0);
    const spx = data.length / w;
    const mid = height / 2;
    ctx.lineWidth = 1.2;
    for (let px = 0; px < w; px++) {
      const s = Math.floor(px * spx);
      let mn = 0,
        mx = 0;
      for (let i = s; i < s + Math.ceil(spx) && i < data.length; i++) {
        if (data[i] < mn) mn = data[i];
        if (data[i] > mx) mx = data[i];
      }
      ctx.strokeStyle = theme === 'light' ? '#6b7fa3' : '#3a5278';
      ctx.beginPath();
      ctx.moveTo(px + 0.5, mid + mn * mid * 0.85);
      ctx.lineTo(px + 0.5, mid + mx * mid * 0.85);
      ctx.stroke();
    }
  }, [audioBuffer, totalWidth, height, theme]);
  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

// ─── BlockPill ────────────────────────────────────────────────────────────────
function BlockPill({ t, idx, pixelsPerSec, isActive, onClick, onResize }) {
  const left = t.start * pixelsPerSec;
  const width = Math.max(8, (t.end - t.start) * pixelsPerSec);
  return (
    <div
      className={`block-pill${isActive ? ' active' : ''}`}
      style={{ left, width, background: PILL_COLORS[idx % PILL_COLORS.length] }}
      onClick={onClick}
    >
      <div className='block-pill-label'>{t.text}</div>
      <div
        className='resize-handle left'
        onMouseDown={(e) => {
          e.stopPropagation();
          onResize(t.id, 'start', e);
        }}
      />
      <div
        className='resize-handle right'
        onMouseDown={(e) => {
          e.stopPropagation();
          onResize(t.id, 'end', e);
        }}
      />
    </div>
  );
}

// ─── TrackArea ────────────────────────────────────────────────────────────────
const TRACK_H = 72;

function TrackArea({
  audioBuffer,
  currentTime,
  pixelsPerSec,
  containerWidth,
  totalDuration,
  transcripts,
  activeId,
  onSeek,
  onBlockClick,
  onBlockResize,
  scrollRef,
  theme,
}) {
  const totalWidth = Math.max(
    containerWidth,
    (totalDuration || 0) * pixelsPerSec || containerWidth,
  );
  const rulerRef = useRef(null);

  useEffect(() => {
    const canvas = rulerRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(totalWidth));
    canvas.width = w * dpr;
    canvas.height = 24 * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.fillStyle = theme === 'light' ? '#f0f2f6' : '#1a1e25';
    ctx.fillRect(0, 0, w, 24);
    const dur = totalDuration || w / pixelsPerSec;
    let iv = 1;
    if (pixelsPerSec < 10) iv = 60;
    else if (pixelsPerSec < 30) iv = 10;
    else if (pixelsPerSec < 80) iv = 5;
    else if (pixelsPerSec < 160) iv = 2;
    for (let t = 0; t <= dur + iv; t += iv) {
      const x = t * pixelsPerSec;
      if (x > w) break;
      ctx.strokeStyle = theme === 'light' ? '#dde1ea' : '#2a2f3a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 14);
      ctx.lineTo(x, 24);
      ctx.stroke();
      ctx.fillStyle = theme === 'light' ? '#909aad' : '#5a6275';
      ctx.font = "10px 'IBM Plex Mono',monospace";
      ctx.fillText(formatTime(t), x + 3, 13);
      if (iv >= 2)
        for (let s = 1; s < 4; s++) {
          const sx = (t + (iv * s) / 4) * pixelsPerSec;
          if (sx > w) break;
          ctx.strokeStyle = theme === 'light' ? '#e8eaef' : '#222730';
          ctx.beginPath();
          ctx.moveTo(sx, 19);
          ctx.lineTo(sx, 24);
          ctx.stroke();
        }
    }
  }, [pixelsPerSec, totalWidth, totalDuration, theme]);

  const trackBg = theme === 'light' ? '#e8ecf2' : '#0b0e11';
  return (
    <div className='waveform-scroll' ref={scrollRef}>
      <div style={{ width: totalWidth, position: 'relative' }}>
        <div
          className='time-ruler'
          style={{
            width: totalWidth,
            background: theme === 'light' ? '#f0f2f6' : '#1a1e25',
          }}
        >
          <canvas ref={rulerRef} style={{ width: totalWidth, height: 24 }} />
        </div>
        <div
          className='track-inner'
          style={{
            width: totalWidth,
            height: TRACK_H,
            background: trackBg,
            position: 'relative',
          }}
        >
          <BgWaveform
            audioBuffer={audioBuffer}
            totalWidth={totalWidth}
            height={TRACK_H}
            theme={theme}
          />
          <div
            className='seek-overlay'
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              onSeek((e.clientX - r.left) / pixelsPerSec);
            }}
          />
          {transcripts.map((t, i) => (
            <BlockPill
              key={t.id}
              t={t}
              idx={i}
              pixelsPerSec={pixelsPerSec}
              isActive={t.id === activeId}
              onClick={() => onBlockClick(t.id)}
              onResize={onBlockResize}
            />
          ))}
          <div
            className='playhead'
            style={{ left: currentTime * pixelsPerSec }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── TranscriptRow ────────────────────────────────────────────────────────────
function TranscriptRow({
  t,
  index,
  isActive,
  onFocus,
  onTextChange,
  onTimeChange,
  onSplit,
  onMerge,
  onDelete,
  onAddAfter,
  canMerge,
}) {
  const textRef = useRef(null);
  const wc = t.text.trim().split(/\s+/).filter(Boolean).length;
  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
    }
  }, [t.text]);
  return (
    <div
      className={`transcript-row${isActive ? ' active' : ''}`}
      data-id={t.id}
      onClick={() => onFocus(t.id)}
    >
      <div className='ts-time'>
        <input
          value={formatTime(t.start)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onTimeChange(t.id, 'start', e.target.value)}
          title='Start'
        />
        <input
          value={formatTime(t.end)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onTimeChange(t.id, 'end', e.target.value)}
          title='End'
        />
      </div>
      <div className='ts-body'>
        <textarea
          ref={textRef}
          className='ts-text'
          value={t.text}
          rows={1}
          onChange={(e) => onTextChange(t.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onFocus={() => onFocus(t.id)}
          placeholder='Transcript text…'
          style={{ overflowY: 'hidden' }}
        />
        <div className='ts-counter'>{wc}w</div>
      </div>
      <div className='ts-actions' onClick={(e) => e.stopPropagation()}>
        <div
          className='ts-action-btn'
          title='Split'
          onClick={() => {
            const pos =
              textRef.current?.selectionStart ?? Math.floor(t.text.length / 2);
            onSplit(t.id, pos);
          }}
        >
          {IC.split}
        </div>
        {canMerge && (
          <div
            className='ts-action-btn'
            title='Merge'
            onClick={() => onMerge(t.id)}
          >
            {IC.merge}
          </div>
        )}
        <div
          className='ts-action-btn'
          title='Add below'
          onClick={() => onAddAfter(t.id)}
        >
          {IC.add}
        </div>
        <div
          className='ts-action-btn danger'
          title='Delete'
          onClick={() => onDelete(t.id)}
        >
          {IC.trash}
        </div>
      </div>
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
function HomePage({ theme, onOpenEditor, fileInputRef }) {
  const waveRef = useRef(null);

  useEffect(() => {
    const canvas = waveRef.current;
    if (!canvas || !canvas.parentElement) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement.clientWidth;
    const h = 68;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const colors = [
      'rgba(59,130,246,0.55)',
      'rgba(99,102,241,0.5)',
      'rgba(20,184,166,0.48)',
      'rgba(139,92,246,0.48)',
      'rgba(59,130,246,0.5)',
      'rgba(99,102,241,0.45)',
      'rgba(20,184,166,0.45)',
    ];
    let bx = 0;
    const bw = Math.floor((w - 18) / 7);
    for (let b = 0; b < 7; b++) {
      const bw2 = b === 6 ? w - bx : bw;
      ctx.fillStyle = colors[b];
      ctx.beginPath();
      ctx.roundRect(bx, 5, bw2 - 4, h - 10, 6);
      ctx.fill();
      for (let px = bx + 8; px < bx + bw2 - 8; px += 2) {
        const amp = Math.random() * 0.65 + 0.1;
        const ht = amp * (h / 2 - 8);
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + 0.5, h / 2 - ht);
        ctx.lineTo(px + 0.5, h / 2 + ht);
        ctx.stroke();
      }
      bx += bw2;
    }
  }, [theme]);

  const features = [
    {
      icon: IC.wave,
      title: 'Visual Waveform',
      desc: 'See audio peaks and silences to identify word boundaries instantly.',
    },
    {
      icon: IC.layers,
      title: 'Block Editing',
      desc: 'Split, merge, resize and reorder blocks directly on the timeline.',
    },
    {
      icon: IC.keyboard,
      title: 'Keyboard First',
      desc: 'Full shortcut coverage — play, seek, undo, copy, paste and more.',
    },
    {
      icon: IC.export,
      title: 'Flexible Export',
      desc: 'Export to .srt subtitle files or plain .txt in one click.',
    },
    {
      icon: IC.mic,
      title: 'Any Audio Format',
      desc: 'Load MP3, WAV, M4A, OGG. Drag and drop into the editor.',
    },
    {
      icon: IC.history,
      title: 'Undo History',
      desc: '50-step undo/redo so you can edit fearlessly.',
    },
  ];

  const recent = [
    {
      name: 'Interview_JaneDoe_2026.mp3',
      dur: '24:18',
      blocks: 47,
      date: 'Today',
    },
    {
      name: 'Podcast_Ep12_Raw.wav',
      dur: '58:02',
      blocks: 134,
      date: 'Yesterday',
    },
    { name: 'Meeting_Q1Review.m4a', dur: '41:55', blocks: 89, date: 'Feb 20' },
  ];

  return (
    <div className='home-page'>
      {/* Hero */}
      <div className='home-hero'>
        <div className='home-hero-badge'>
          <svg width='8' height='8' viewBox='0 0 8 8'>
            <circle cx='4' cy='4' r='4' fill='currentColor' />
          </svg>
          v1.0 · Beta
        </div>
        <h1>
          Transcribe audio
          <br />
          with <em>precision</em>
        </h1>
        <p>
          A professional transcription workspace with waveform editing,
          block-level timestamps, and keyboard-first controls — built for speed
          and accuracy.
        </p>
        <div className='home-hero-actions'>
          <button className='hero-btn primary' onClick={onOpenEditor}>
            {IC.file} Open Editor
          </button>
          <button
            className='hero-btn secondary'
            onClick={() => fileInputRef.current?.click()}
          >
            {IC.upload} Load Audio File
          </button>
        </div>
        <div className='hero-wave'>
          <canvas ref={waveRef} />
        </div>
      </div>

      <div className='home-body'>
        {/* Stats */}
        <div>
          <div className='home-section-label'>At a glance</div>
          <div className='home-stats'>
            {[
              { v: '50×', l: 'Undo steps' },
              { v: '4', l: 'Export formats' },
              { v: '20×', l: 'Max zoom' },
            ].map((s) => (
              <div key={s.l} className='stat-card'>
                <div className='stat-value'>{s.v}</div>
                <div className='stat-label'>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <div className='home-section-label'>Features</div>
          <div className='features-grid'>
            {features.map((f) => (
              <div key={f.title} className='feature-card'>
                <div className='feature-icon'>{f.icon}</div>
                <div className='feature-title'>{f.title}</div>
                <div className='feature-desc'>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <div className='home-section-label'>Recent files</div>
          <div className='recent-list'>
            {recent.map((f) => (
              <div key={f.name} className='recent-item' onClick={onOpenEditor}>
                <div className='recent-icon'>{IC.file}</div>
                <div>
                  <div className='recent-name'>{f.name}</div>
                  <div className='recent-meta'>
                    {f.dur} · {f.blocks} blocks · {f.date}
                  </div>
                </div>
                <div className='recent-arrow'>{IC.arrow}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SidebarLeft ──────────────────────────────────────────────────────────────
function SidebarLeft({ page, setPage, theme, toggleTheme }) {
  return (
    <div className='sidebar-left'>
      <div className='nav-logo'>
        <svg width='16' height='16' viewBox='0 0 24 24' fill='white'>
          <path d='M9 18V5l12-2v13' />
          <circle cx='6' cy='18' r='3' />
          <circle cx='18' cy='16' r='3' />
        </svg>
      </div>
      <div className='nav-divider' />
      {[
        ['home', IC.home, 'Home'],
        ['editor', IC.file, 'Editor'],
        ['history', IC.history, 'History'],
      ].map(([p, icon, label]) => (
        <div
          key={p}
          className={`nav-icon${page === p ? ' active' : ''}`}
          onClick={() => setPage(p)}
          title={label}
        >
          {icon}
        </div>
      ))}
      <div className='nav-spacer' />
      <button
        className='theme-btn'
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? IC.sun : IC.moon}
      </button>
      <div className='nav-icon' title='Settings'>
        {IC.settings}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [page, setPage] = useState('home');
  const [audioFile, setAudioFile] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [audioCtx, setAudioCtx] = useState(null);
  const [sourceNode, setSourceNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [containerWidth, setCW] = useState(800);
  const [options, setOptions] = useState({
    maxWordsPerLine: 10,
    maxLinesPerBlock: 2,
    autoScroll: true,
    snapToSilence: true,
  });

  const scrollRef = useRef(null);
  const transcriptsRef = useRef(null);
  const playStartRef = useRef(null);
  const playOffsetRef = useRef(0);
  const rafRef = useRef(null);
  const gainRef = useRef(null);
  const fileInputRef = useRef(null);
  const historyRef = useRef([]);
  const futureRef = useRef([]);
  const clipboardRef = useRef(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Measure container
  useEffect(() => {
    if (!scrollRef.current) return;
    const obs = new ResizeObserver(([e]) => setCW(e.contentRect.width));
    obs.observe(scrollRef.current);
    return () => obs.disconnect();
  }, [scrollRef.current]);

  const pixelsPerSec = (duration > 0 ? containerWidth / duration : 100) * zoom;

  // ── History helpers ──
  const setTH = (updater) =>
    setTranscripts((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      historyRef.current = [...historyRef.current, prev].slice(-50);
      futureRef.current = [];
      return next;
    });
  const undo = () =>
    setTranscripts((prev) => {
      if (!historyRef.current.length) return prev;
      const past = historyRef.current[historyRef.current.length - 1];
      historyRef.current = historyRef.current.slice(0, -1);
      futureRef.current = [prev, ...futureRef.current].slice(0, 50);
      return past;
    });
  const redo = () =>
    setTranscripts((prev) => {
      if (!futureRef.current.length) return prev;
      const next = futureRef.current[0];
      futureRef.current = futureRef.current.slice(1);
      historyRef.current = [...historyRef.current, prev].slice(-50);
      return next;
    });

  // ── Audio ──
  async function loadAudio(file) {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const gain = ac.createGain();
    gain.gain.value = volume;
    gain.connect(ac.destination);
    gainRef.current = gain;
    const buffer = await ac.decodeAudioData(await file.arrayBuffer());
    setAudioCtx(ac);
    setAudioBuffer(buffer);
    setDuration(buffer.duration);
    setCurrentTime(0);
    playOffsetRef.current = 0;
    const seg = 4,
      blocks = [];
    for (let i = 0; i * seg < buffer.duration; i++)
      blocks.push({
        id: uid(),
        start: i * seg,
        end: Math.min((i + 1) * seg, buffer.duration),
        text: '',
      });
    setTranscripts(blocks);
    historyRef.current = [];
    futureRef.current = [];
  }
  function handleFileInput(file) {
    if (!file) return;
    setAudioFile(file);
    loadAudio(file);
    setPage('editor');
  }
  function stopSource() {
    if (sourceNode) {
      try {
        sourceNode.stop();
      } catch (_) {}
    }
    setSourceNode(null);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }
  function play(from) {
    if (!audioBuffer || !audioCtx) return;
    stopSource();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const src = audioCtx.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(gainRef.current);
    src.start(0, from);
    src.onended = () => setIsPlaying(false);
    setSourceNode(src);
    setIsPlaying(true);
    playStartRef.current = audioCtx.currentTime;
    playOffsetRef.current = from;
    const tick = () => {
      setCurrentTime(
        Math.min(
          playOffsetRef.current + (audioCtx.currentTime - playStartRef.current),
          duration,
        ),
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }
  function pause() {
    playOffsetRef.current = currentTime;
    stopSource();
    setIsPlaying(false);
  }
  function togglePlay() {
    if (isPlaying) pause();
    else play(currentTime);
  }
  function seek(t) {
    const c = Math.max(0, Math.min(t, duration));
    playOffsetRef.current = c;
    setCurrentTime(c);
    if (isPlaying) play(c);
    const b = transcripts.find((b) => b.start <= c && b.end > c);
    if (b) setActiveId(b.id);
  }
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  // ── Auto-scroll ──
  useEffect(() => {
    if (!isPlaying) return;
    const b = transcripts.find(
      (b) => b.start <= currentTime && b.end > currentTime,
    );
    if (b && b.id !== activeId) {
      setActiveId(b.id);
      if (options.autoScroll && transcriptsRef.current) {
        const el = transcriptsRef.current.querySelector(`[data-id="${b.id}"]`);
        if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [currentTime, isPlaying]);

  useEffect(() => {
    if (!scrollRef.current || !isPlaying) return;
    const x = currentTime * pixelsPerSec;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (x > scrollLeft + clientWidth * 0.8 || x < scrollLeft)
      scrollRef.current.scrollLeft = x - clientWidth * 0.2;
  }, [currentTime, isPlaying, pixelsPerSec]);

  // ── Focus block ──
  function focusBlock(id) {
    setActiveId(id);
    const b = transcripts.find((t) => t.id === id);
    if (!b) return;
    seek(b.start);
    if (scrollRef.current)
      scrollRef.current.scrollLeft = Math.max(
        0,
        b.start * pixelsPerSec - scrollRef.current.clientWidth * 0.3,
      );
    if (transcriptsRef.current) {
      const el = transcriptsRef.current.querySelector(`[data-id="${id}"]`);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  // ── CRUD ──
  const setTxt = (id, text) =>
    setTH((ts) => ts.map((t) => (t.id === id ? { ...t, text } : t)));
  const setTime = (id, field, str) => {
    const val = parseTime(str);
    if (isNaN(val)) return;
    setTH((ts) => {
      const i = ts.findIndex((t) => t.id === id);
      if (i < 0) return ts;
      const c = [...ts];
      const b = { ...c[i], [field]: val };
      if (field === 'start') b.start = Math.min(val, b.end - 0.1);
      if (field === 'end') b.end = Math.max(val, b.start + 0.1);
      if (field === 'start' && i > 0)
        b.start = Math.max(b.start, ts[i - 1].end + 0.05);
      if (field === 'end' && i < ts.length - 1)
        b.end = Math.min(b.end, ts[i + 1].start - 0.05);
      c[i] = b;
      return c;
    });
  };
  const splitT = (id, pos) =>
    setTH((ts) => {
      const i = ts.findIndex((t) => t.id === id);
      if (i < 0) return ts;
      const t = ts[i],
        mid = (t.start + t.end) / 2,
        c = [...ts];
      c.splice(
        i,
        1,
        { ...t, text: t.text.slice(0, pos).trimEnd(), end: mid },
        {
          id: uid(),
          start: mid,
          end: t.end,
          text: t.text.slice(pos).trimStart(),
        },
      );
      return c;
    });
  const mergeT = (id) =>
    setTH((ts) => {
      const i = ts.findIndex((t) => t.id === id);
      if (i < 0 || i >= ts.length - 1) return ts;
      const c = [...ts];
      c.splice(i, 2, {
        ...ts[i],
        text: (ts[i].text + ' ' + ts[i + 1].text).trim(),
        end: ts[i + 1].end,
      });
      return c;
    });
  const deleteT = (id) => setTH((ts) => ts.filter((t) => t.id !== id));
  const addAfterT = (id) =>
    setTH((ts) => {
      const i = ts.findIndex((t) => t.id === id);
      if (i < 0) return ts;
      const t = ts[i],
        end = i < ts.length - 1 ? ts[i + 1].start : t.end + 2;
      const c = [...ts];
      c.splice(i + 1, 0, { id: uid(), start: t.end, end, text: '' });
      return c;
    });

  // ── Block resize ──
  function handleBlockResize(id, side, e) {
    e.preventDefault();
    const sx = e.clientX,
      b = transcripts.find((t) => t.id === id);
    if (!b) return;
    const orig = side === 'start' ? b.start : b.end;
    const onMove = (me) => {
      const dt = (me.clientX - sx) / pixelsPerSec;
      setTH((ts) => {
        const i = ts.findIndex((t) => t.id === id);
        if (i < 0) return ts;
        const c = [...ts],
          bl = { ...c[i] };
        if (side === 'start')
          bl.start = Math.max(
            i > 0 ? ts[i - 1].end + 0.05 : 0,
            Math.min(orig + dt, bl.end - 0.1),
          );
        else
          bl.end = Math.min(
            i < ts.length - 1 ? ts[i + 1].start - 0.05 : duration,
            Math.max(orig + dt, bl.start + 0.1),
          );
        c[i] = bl;
        return c;
      });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  // ── Keyboard ──
  useEffect(() => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const mod = (e) => (isMac ? e.metaKey : e.ctrlKey);
    const handler = (e) => {
      const inInput =
        e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT';
      if (mod(e)) {
        if (e.key === 'z' && !inInput) {
          e.preventDefault();
          e.shiftKey ? redo() : undo();
          return;
        }
        if (e.key === 'y' && !inInput) {
          e.preventDefault();
          redo();
          return;
        }
        if (e.key === 'c' && !inInput && activeId) {
          const b = transcripts.find((t) => t.id === activeId);
          if (b) {
            clipboardRef.current = { ...b };
            e.preventDefault();
          }
          return;
        }
        if (e.key === 'x' && !inInput && activeId) {
          const b = transcripts.find((t) => t.id === activeId);
          if (b) {
            clipboardRef.current = { ...b };
            deleteT(activeId);
            setActiveId(null);
            e.preventDefault();
          }
          return;
        }
        if (e.key === 'v' && !inInput && clipboardRef.current) {
          e.preventDefault();
          const src = clipboardRef.current,
            dur2 = src.end - src.start;
          const ns = activeId
            ? (transcripts.find((t) => t.id === activeId)?.end ?? src.start) +
              0.05
            : src.start;
          const nb = { id: uid(), start: ns, end: ns + dur2, text: src.text };
          if (activeId) {
            setTH((ts) => {
              const i = ts.findIndex((t) => t.id === activeId);
              const c = [...ts];
              c.splice(i + 1, 0, nb);
              return c;
            });
          } else setTH((ts) => [...ts, nb]);
          setActiveId(nb.id);
          return;
        }
        if (e.key === 'd' && !inInput && activeId) {
          e.preventDefault();
          deleteT(activeId);
          setActiveId(null);
          return;
        }
        if (e.key === 'a' && !inInput) {
          e.preventDefault();
          if (transcripts.length > 0) focusBlock(transcripts[0].id);
          return;
        }
        if (e.key === 'Enter' && !inInput && activeId) {
          e.preventDefault();
          addAfterT(activeId);
          return;
        }
        if (e.key === 's' && inInput) {
          e.preventDefault();
          if (activeId) splitT(activeId, 0);
          return;
        }
      }
      if (inInput) return;
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seek(currentTime - (e.shiftKey ? 1 : 5));
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        seek(currentTime + (e.shiftKey ? 1 : 5));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeId) {
          const i = transcripts.findIndex((t) => t.id === activeId);
          if (i > 0) focusBlock(transcripts[i - 1].id);
        }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeId) {
          const i = transcripts.findIndex((t) => t.id === activeId);
          if (i < transcripts.length - 1) focusBlock(transcripts[i + 1].id);
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (activeId) {
          e.preventDefault();
          deleteT(activeId);
          setActiveId(null);
        }
      }
      if (e.key === 'm' || e.key === 'M') {
        if (activeId) mergeT(activeId);
      }
      if (e.key === 'a' || e.key === 'A') {
        if (activeId) addAfterT(activeId);
      }
      if (e.key === 'Escape') setActiveId(null);
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(20, z * 1.3));
      if (e.key === '-') setZoom((z) => Math.max(1, z / 1.3));
      if (e.key === '0') setZoom(1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPlaying, currentTime, activeId, transcripts, duration, pixelsPerSec]);

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('audio/')) handleFileInput(f);
  }

  const SHORTCUTS = [
    ['Play / Pause', ['Space']],
    ['Back 5s / 1s', ['←', '⇧←']],
    ['Fwd 5s / 1s', ['→', '⇧→']],
    ['Prev / Next block', ['↑', '↓']],
    ['Undo / Redo', ['⌘Z', '⌘⇧Z']],
    ['Copy / Paste', ['⌘C', '⌘V']],
    ['Cut / Delete', ['⌘X', '⌘D']],
    ['Split at cursor', ['⌘S']],
    ['Merge with next', ['M']],
    ['Add block below', ['A']],
    ['Zoom in / out', ['+', '-']],
    ['Reset zoom', ['0']],
    ['Deselect', ['Esc']],
  ];

  return (
    <div className='app'>
      <SidebarLeft
        page={page}
        setPage={setPage}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className='main'>
        {/* Topbar */}
        <div className='topbar'>
          <span className='topbar-title'>
            {page === 'editor' && audioFile
              ? audioFile.name
              : page === 'home'
                ? 'Welcome to Transcriber'
                : 'History'}
          </span>
          {page === 'editor' && duration > 0 && (
            <span className='topbar-badge'>{formatTime(duration)}</span>
          )}
          <div className='topbar-right'>
            {page === 'editor' && (
              <button
                className='btn'
                onClick={() => fileInputRef.current.click()}
              >
                {IC.upload} Load audio
              </button>
            )}
            {page === 'home' && (
              <button className='btn primary' onClick={() => setPage('editor')}>
                {IC.file} Open Editor
              </button>
            )}
            <input
              ref={fileInputRef}
              type='file'
              accept='audio/*'
              style={{ display: 'none' }}
              onChange={(e) => handleFileInput(e.target.files[0])}
            />
          </div>
        </div>

        {/* Pages */}
        {page === 'home' && (
          <HomePage
            theme={theme}
            onOpenEditor={() => setPage('editor')}
            fileInputRef={fileInputRef}
          />
        )}

        {page === 'history' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              color: 'var(--text3)',
            }}
          >
            <svg
              width='48'
              height='48'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={1.5}
              opacity={0.3}
            >
              <path d='M3 3v5h5' />
              <path d='M3 8A9 9 0 1 0 6 4.5' />
              <polyline points='12 7 12 12 16 14' />
            </svg>
            <span
              style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13 }}
            >
              History coming soon
            </span>
          </div>
        )}

        {page === 'editor' && (
          <>
            <div className='audio-section'>
              <div style={{ display: 'flex' }}>
                <div
                  className='track-label-col'
                  style={{ height: 24 + TRACK_H }}
                >
                  <span>Subtitles</span>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <TrackArea
                    audioBuffer={audioBuffer}
                    currentTime={currentTime}
                    pixelsPerSec={pixelsPerSec}
                    containerWidth={containerWidth}
                    totalDuration={duration}
                    transcripts={transcripts}
                    activeId={activeId}
                    onSeek={seek}
                    onBlockClick={focusBlock}
                    onBlockResize={handleBlockResize}
                    scrollRef={scrollRef}
                    theme={theme}
                  />
                </div>
              </div>
              <div className='player-controls'>
                <div className='player-controls-indent' />
                <div className='controls-inner'>
                  <div className='zoom-row'>
                    <div
                      className='ctrl-btn'
                      onClick={() => setZoom((z) => Math.max(1, z / 1.4))}
                    >
                      {IC.zoomout}
                    </div>
                    <input
                      type='range'
                      className='slider'
                      min={1}
                      max={20}
                      step={0.05}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      style={{ width: 70 }}
                    />
                    <div
                      className='ctrl-btn'
                      onClick={() => setZoom((z) => Math.min(20, z * 1.4))}
                    >
                      {IC.zoomin}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--text3)',
                        fontFamily: "'IBM Plex Mono',monospace",
                        minWidth: 30,
                      }}
                    >
                      {zoom.toFixed(1)}×
                    </span>
                  </div>
                  <div
                    className='ctrl-btn'
                    onClick={() => seek(currentTime - 5)}
                  >
                    {IC.back5}
                  </div>
                  <div className='ctrl-btn play' onClick={togglePlay}>
                    {isPlaying ? IC.pause : IC.play}
                  </div>
                  <div
                    className='ctrl-btn'
                    onClick={() => seek(currentTime + 5)}
                  >
                    {IC.fwd5}
                  </div>
                  <div className='time-display'>
                    {formatTime(currentTime)}
                    <span> / {formatTime(duration)}</span>
                  </div>
                </div>
                <div className='controls-right'>
                  <div className='volume-row'>
                    {IC.volume}
                    <input
                      type='range'
                      className='slider'
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      style={{ width: 60 }}
                    />
                  </div>
                  <button
                    className='add-cue-btn'
                    onClick={() => {
                      if (activeId) addAfterT(activeId);
                      else if (transcripts.length > 0)
                        addAfterT(transcripts[transcripts.length - 1].id);
                      else
                        setTH([
                          {
                            id: uid(),
                            start: 0,
                            end: Math.min(4, duration),
                            text: '',
                          },
                        ]);
                    }}
                  >
                    + Add cue
                  </button>
                </div>
              </div>
            </div>

            {!audioFile ? (
              <div
                className={`drop-zone${dragOver ? ' drag-over' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current.click()}
              >
                {IC.upload}
                <h2>Drop an audio file here</h2>
                <p>or click to browse · MP3, WAV, M4A, OGG supported</p>
              </div>
            ) : (
              <div className='transcripts-area' ref={transcriptsRef}>
                {transcripts.length === 0 && (
                  <div className='empty-state'>No transcript blocks.</div>
                )}
                {transcripts.map((t, i) => (
                  <TranscriptRow
                    key={t.id}
                    t={t}
                    index={i}
                    isActive={t.id === activeId}
                    onFocus={focusBlock}
                    onTextChange={setTxt}
                    onTimeChange={setTime}
                    onSplit={splitT}
                    onMerge={mergeT}
                    onDelete={deleteT}
                    onAddAfter={addAfterT}
                    canMerge={i < transcripts.length - 1}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Right sidebar */}
      {page === 'editor' && (
        <div className='sidebar-right'>
          <div className='sidebar-right-header'>Options</div>
          <div className='sidebar-right-body'>
            <div className='option-group'>
              <div className='section-title'>Block Settings</div>
              <div className='option-row'>
                <span className='option-label'>Max words / line</span>
                <input
                  type='number'
                  className='number-input'
                  min={1}
                  max={30}
                  value={options.maxWordsPerLine}
                  onChange={(e) =>
                    setOptions((o) => ({
                      ...o,
                      maxWordsPerLine: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className='option-row'>
                <span className='option-label'>Max lines / block</span>
                <input
                  type='number'
                  className='number-input'
                  min={1}
                  max={10}
                  value={options.maxLinesPerBlock}
                  onChange={(e) =>
                    setOptions((o) => ({
                      ...o,
                      maxLinesPerBlock: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className='sep' />
            <div className='option-group'>
              <div className='section-title'>Behavior</div>
              {[
                ['Auto-scroll', 'autoScroll'],
                ['Snap to silence', 'snapToSilence'],
              ].map(([l, k]) => (
                <div key={k} className='toggle-row'>
                  <span className='toggle-label'>{l}</span>
                  <div
                    className={`toggle${options[k] ? ' on' : ''}`}
                    onClick={() => setOptions((o) => ({ ...o, [k]: !o[k] }))}
                  />
                </div>
              ))}
            </div>
            <div className='sep' />
            <div className='option-group'>
              <div className='section-title'>Appearance</div>
              <div className='toggle-row'>
                <span className='toggle-label'>Dark mode</span>
                <div
                  className={`toggle${theme === 'dark' ? ' on' : ''}`}
                  onClick={toggleTheme}
                />
              </div>
            </div>
            <div className='sep' />
            <div className='option-group'>
              <div className='section-title'>Shortcuts</div>
              <div className='kbd-section'>
                {SHORTCUTS.map(([desc, keys]) => (
                  <div key={desc} className='kbd-row'>
                    <span className='kbd-desc'>{desc}</span>
                    <div className='kbd-keys'>
                      {keys.map((k) => (
                        <span key={k} className='kbd'>
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='sep' />
            <div className='option-group'>
              <div className='section-title'>Export</div>
              <button
                className='btn'
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  const srt = transcripts
                    .map((t, i) => {
                      const fmt = (s) => {
                        const m = Math.floor(s / 60),
                          sec = (s % 60).toFixed(3).replace('.', ',');
                        return `${String(m).padStart(2, '0')}:${sec.padStart(6, '0')}`;
                      };
                      return `${i + 1}\n${fmt(t.start)} --> ${fmt(t.end)}\n${t.text}\n`;
                    })
                    .join('\n');
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(
                    new Blob([srt], { type: 'text/plain' }),
                  );
                  a.download = 'transcript.srt';
                  a.click();
                }}
              >
                Export SRT
              </button>
              <button
                className='btn'
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: 6,
                }}
                onClick={() => {
                  const txt = transcripts.map((t) => t.text).join('\n\n');
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(
                    new Blob([txt], { type: 'text/plain' }),
                  );
                  a.download = 'transcript.txt';
                  a.click();
                }}
              >
                Export TXT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
