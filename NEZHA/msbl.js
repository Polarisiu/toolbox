(function () {
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = `
/* ================== 基础变量 ================== */
:root {
  --glass-light: rgba(255,255,255,0.28);
  --glass-dark: rgba(0,0,0,0.35);
  --glass-border-light: rgba(255,255,255,0.25);
  --glass-border-dark: rgba(255,255,255,0.08);
}

/* ================== 通用玻璃卡片 ================== */
.rounded-lg.bg-card\\/70,
.bg-card\\/70.p-4.rounded-\\[10px\\],
.server-inline-list .rounded-lg.border.text-card-foreground.shadow-lg.flex.items-center.bg-card\\/70 {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  background: var(--glass-light);
  border: 1px solid var(--glass-border-light);
  box-shadow: 0 6px 24px rgba(0,0,0,0.08),
              inset 0 0 10px rgba(255,255,255,0.15);
  color: #111;
  transition: background .3s ease, box-shadow .3s ease;
}

/* 支持 backdrop-filter 才启用 */
@supports (backdrop-filter: blur(1px)) {
  .rounded-lg.bg-card\\/70,
  .bg-card\\/70.p-4.rounded-\\[10px\\],
  .server-inline-list .rounded-lg.border.text-card-foreground.shadow-lg.flex.items-center.bg-card\\/70 {
    backdrop-filter: blur(16px) saturate(180%) contrast(110%);
    -webkit-backdrop-filter: blur(16px) saturate(180%) contrast(110%);
  }
}

/* ================== 深色模式 ================== */
.dark .rounded-lg.bg-card\\/70,
.dark .bg-card\\/70.p-4.rounded-\\[10px\\],
.dark .server-inline-list .rounded-lg.border.text-card-foreground.shadow-lg.flex.items-center.bg-card\\/70 {
  background: var(--glass-dark);
  border: 1px solid var(--glass-border-dark);
  box-shadow: 0 6px 24px rgba(0,0,0,0.35),
              inset 0 0 8px rgba(255,255,255,0.05);
  color: #eee;
}

/* ================== hover ================== */
.rounded-lg.bg-card\\/70:hover,
.bg-card\\/70.p-4.rounded-\\[10px\\]:hover,
.server-inline-list .rounded-lg.border.text-card-foreground.shadow-lg.flex.items-center.bg-card\\/70:hover {
  background: rgba(255,255,255,0.34);
  box-shadow: 0 12px 36px rgba(0,0,0,0.12),
              inset 0 0 12px rgba(255,255,255,0.18);
}

.dark .rounded-lg.bg-card\\/70:hover,
.dark .bg-card\\/70.p-4.rounded-\\[10px\\]:hover,
.dark .server-inline-list .rounded-lg.border.text-card-foreground.shadow-lg.flex.items-center.bg-card\\/70:hover {
  background: rgba(0,0,0,0.4);
}

/* ================== 移动端降级 ================== */
@media (max-width: 768px) {
  @supports (backdrop-filter: blur(1px)) {
    .rounded-lg.bg-card\\/70,
    .bg-card\\/70.p-4.rounded-\\[10px\\] {
      backdrop-filter: blur(10px) saturate(150%);
      -webkit-backdrop-filter: blur(10px) saturate(150%);
    }
  }
}

/* ================== 减少透明度偏好 ================== */
@media (prefers-reduced-transparency: reduce) {
  .rounded-lg.bg-card\\/70,
  .bg-card\\/70.p-4.rounded-\\[10px\\] {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: #f3f4f6;
  }
  .dark .rounded-lg.bg-card\\/70 {
    background: #1f2937;
  }
}
`;
  document.head.appendChild(style);
})();
