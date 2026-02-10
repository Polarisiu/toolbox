# 哪吒监控 美化代码
---

## 🚀 使用方法

### 哪吒详情页直接展示网络波动卡片 (网络卡片在上)(/* 源自https://www.nodeseek.com/post-607309-1 */)
```bash
<script src="https://cdn.jsdelivr.net/gh/duya07/nezha-ui@main/netstatus-autoshow-2.js"></script>
```

### 隐藏概览条(/* 源自https://www.nodeseek.com/post-607309-1 */)
```bash
/* 隐藏迷你概览条 */
<script>
  window.MiniStatsConfig = {
    hideMiniStats: true,       // true: 开启隐藏迷你概览条
    hideParentSection: true    // true: 连同外框一起隐藏 (防止留下一条空白间距)
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/duya07/nezha-ui@main/nezha-mini-stats-hide.js"></script>
```

### 概览条增加半透明背景(/* 源自https://www.nodeseek.com/post-607309-1 */)
```bash
/* 迷你概览条半透明背景 */
<script src="https://cdn.jsdelivr.net/gh/duya07/nezha-ui@main/nezha-mini-stats-style.js"></script>
```

### 周期性流量进度条(/* 源自https://www.nodeseek.com/post-357843-1 */)
```bash
/* 周期性流量进度条 */
<script>
  window.TrafficScriptConfig = {
    showTrafficStats: true,    // 显示流量统计
    insertAfter: true,         // 如果开启总流量卡片, 放置在总流量卡片后面
    interval: 60000,           // 60秒刷新缓存, 单位毫秒
    toggleInterval: 4000,      // 4秒切换流量进度条右上角内容, 0秒不切换, 单位毫秒
    duration: 500,             // 缓进缓出切换时间, 单位毫秒
    enableLog: false           // 开启日志
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/ziwiwiz/nezha-ui@main/traffic-progress.js"></script>
```
