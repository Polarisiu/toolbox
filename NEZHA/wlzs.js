(function () {
  "use strict";

  /* ================== 桌面端判断 ================== */
  const isDesktop = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (!isDesktop) {
    // 移动端 / 触屏设备：完全不运行
    return;
  }

  /* ================== 原逻辑 ================== */
  const CONFIG = {
    selectors: {
      tabSection: ".server-info > section",
      detailDiv: ".server-info > div:nth-child(4)",
      networkDiv: ".server-info > div:nth-child(5)",
      tabText: "p.whitespace-nowrap",
    },
    networkTabNames: ["网络", "Network"],
    clickDelay: 500,
  };

  const state = {
    clicked: false,
    visible: false,
  };

  function findNetworkButton() {
    const tabs = document.querySelectorAll(CONFIG.selectors.tabText);
    for (const tab of tabs) {
      const text = tab.textContent?.trim() || "";
      if (CONFIG.networkTabNames.includes(text)) {
        return tab.parentElement?.parentElement || null;
      }
    }
    return null;
  }

  function showBothModules() {
    const detail = document.querySelector(CONFIG.selectors.detailDiv);
    const network = document.querySelector(CONFIG.selectors.networkDiv);
    if (detail) detail.style.display = "block";
    if (network) network.style.display = "block";
  }

  function hideTabSwitcher() {
    const section = document.querySelector(CONFIG.selectors.tabSection);
    if (section) section.style.display = "none";
  }

  function clickNetworkTab() {
    if (state.clicked) return;
    const button = findNetworkButton();
    if (button) {
      button.click();
      state.clicked = true;
      setTimeout(showBothModules, CONFIG.clickDelay);
    }
  }

  function checkVisibility() {
    const detail = document.querySelector(CONFIG.selectors.detailDiv);
    const network = document.querySelector(CONFIG.selectors.networkDiv);
    const detailVisible =
      detail && getComputedStyle(detail).display !== "none";
    const networkVisible =
      network && getComputedStyle(network).display !== "none";
    return detailVisible || networkVisible;
  }

  function handleLayout() {
    const isVisible = checkVisibility();

    if (isVisible && !state.visible) {
      hideTabSwitcher();
      clickNetworkTab();
    } else if (!isVisible && state.visible) {
      state.clicked = false;
    }

    state.visible = isVisible;

    if (isVisible && state.clicked) {
      showBothModules();
    }
  }

  function init() {
    const root = document.querySelector("#root");
    if (!root) return;

    const observer = new MutationObserver(handleLayout);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    handleLayout();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
