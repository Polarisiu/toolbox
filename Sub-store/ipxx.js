/**
 * @Sub-Store-Page
 * 输出：国旗|商家|IP类型|原生/广播
 * 例：🇺🇸|DMIT|数据中心|原生
 *
 * 参数（#后，可不填）：
 *   concurrency=3
 *   timeout=9000
 *   ttl=24
 *   mode=prefix     prefix=覆盖; suffix=追加到原名后
 *   mark_fail=0     1=失败也输出 🏳️|UNKNOWN|未知|未知
 *   key=xxx         ipapi.is key（可选；不填也可用）
 */

const CACHE_KEY = "landing_flag_vendor_type_native_ipapiis_v1";

function safeJson(s, fb) { try { return JSON.parse(s); } catch { return fb; } }
function now() { return Date.now(); }
function hrs(h) { return h * 3600 * 1000; }

function flagEmoji(cc) {
  const c = String(cc || "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return "🏳️";
  const A = 0x1F1E6;
  return String.fromCodePoint(A + (c.charCodeAt(0) - 65), A + (c.charCodeAt(1) - 65));
}

function vendorShortFromOrg(org) {
  // 只做“显示缩短”：取第一个词，再去掉符号，变成 DMIT 这种
  const s = String(org || "").trim();
  if (!s) return "UNKNOWN";
  const first = s.split(/\s+|,|\(|\)|\/|\\|\||:/)[0] || s;
  const cleaned = first.replace(/[^A-Za-z0-9\.\-_]/g, "");
  return cleaned ? cleaned.toUpperCase().slice(0, 12) : "UNKNOWN";
}

function ipTypeFromIpapiIs(d) {
  // 严格用接口字段：is_mobile / is_datacenter / asn.type
  if (d?.is_mobile) return "移动";
  if (d?.is_datacenter) return "数据中心";

  const t = String(d?.asn?.type || "").toLowerCase();
  const map = {
    isp: "运营商",
    business: "商业",
    education: "教育",
    government: "政府",
    banking: "金融",
    hosting: "数据中心",
  };
  return map[t] || "未知";
}

function nativeLabel(geoCC, rirCC) {
  if (!(geoCC && rirCC)) return "未知";
  return geoCC === rirCC ? "原生" : "广播";
}

async function mapLimit(arr, limit, fn) {
  const out = new Array(arr.length);
  let i = 0;
  const workers = new Array(Math.min(limit, arr.length)).fill(0).map(async () => {
    while (i < arr.length) {
      const idx = i++;
      out[idx] = await fn(arr[idx], idx);
    }
  });
  await Promise.all(workers);
  return out;
}

// 从 RIPEstat 返回里尽量提取 2 位国家码（结构可能变化，尽量兼容）
function extractCC(obj) {
  if (!obj || typeof obj !== "object") return "";
  const q = [{ v: obj, d: 0 }];
  const seen = new Set();
  while (q.length) {
    const { v, d } = q.shift();
    if (!v || typeof v !== "object") continue;
    if (seen.has(v)) continue;
    seen.add(v);
    if (d > 6) continue;

    for (const k of Object.keys(v)) {
      const val = v[k];
      const key = String(k).toLowerCase();
      if (typeof val === "string" && /^[A-Z]{2}$/i.test(val)) {
        if (key.includes("country") || key === "cc" || key.includes("location")) return val.toUpperCase();
      }
      if (val && typeof val === "object") q.push({ v: val, d: d + 1 });
    }
  }
  return "";
}

async function operator(proxies = []) {
  const $ = $substore;

  const concurrency = Math.max(1, parseInt($arguments.concurrency || "3", 10));
  const timeout = Math.max(1000, parseInt($arguments.timeout || "9000", 10));
  const ttl = Math.max(1, parseInt($arguments.ttl || "24", 10));
  const mode = String($arguments.mode || "prefix").toLowerCase();
  const markFail = String($arguments.mark_fail ?? "0") === "1";
  const key = String($arguments.key || "").trim();

  const ipapiIsUrl = key ? `https://api.ipapi.is/?key=${encodeURIComponent(key)}` : "https://api.ipapi.is/";
  const ripeRirCountry = (ip) =>
    `https://stat.ripe.net/data/rir-stats-country/data.json?resource=${encodeURIComponent(ip)}`;

  const cacheAll = safeJson($.read(CACHE_KEY) || "{}", {});
  const ttlMs = hrs(ttl);

  // internal（兼容 Clash / ClashMeta）
  let internal = [];
  try { internal = ProxyUtils.produce(proxies, "ClashMeta", "internal"); } catch {}
  if (!internal || internal.length !== proxies.length) {
    try { internal = ProxyUtils.produce(proxies, "Clash", "internal"); } catch {}
  }
  if (!internal || internal.length !== proxies.length) return proxies;

  // 启动 http-meta
  const start = await $.http.post({
    url: "http://127.0.0.1:9876/start",
    headers: { "content-type": "application/json" },
    timeout,
    body: JSON.stringify({ proxies: internal, timeout: 3000 + internal.length * 9000 }),
  });
  const sb = safeJson(start.body, null);
  if (!sb?.pid || !Array.isArray(sb?.ports) || sb.ports.length !== proxies.length) return proxies;

  await $.wait(1200);

  async function fetchIpapiIs(idx) {
    const proxyUrl = `http://127.0.0.1:${sb.ports[idx]}`;
    const r = await $.http.get({ url: ipapiIsUrl, timeout, proxy: proxyUrl });
    const d = safeJson(r.body, null);
    if (!d || d.error) throw new Error(d?.error || "ipapi.is failed");
    return d;
  }

  async function getRirCC(ip) {
    if (!ip) return "";
    const ck = `rir:${ip}`;
    const c = cacheAll[ck];
    if (c && (now() - c.ts) < ttlMs) return c.cc || "";

    const r = await $.http.get({ url: ripeRirCountry(ip), timeout });
    const j = safeJson(r.body, null);
    const cc = extractCC(j) || "";
    cacheAll[ck] = { ts: now(), cc };
    return cc;
  }

  const tags = await mapLimit(internal, concurrency, async (_, idx) => {
    try {
      const d = await fetchIpapiIs(idx);

      const ip = d.ip || "";
      const geoCC = String(d?.location?.country_code || "").toUpperCase();
      const flag = flagEmoji(geoCC);

      const vendor = vendorShortFromOrg(d?.asn?.org);
      const type = ipTypeFromIpapiIs(d);

      const rirCC = await getRirCC(ip);
      const nb = nativeLabel(geoCC, rirCC);

      return `${flag}|${vendor}|${type}|${nb}`;
    } catch {
      return markFail ? "🏳️|UNKNOWN|未知|未知" : null;
    }
  });

  for (let i = 0; i < proxies.length; i++) {
    const tag = tags[i];
    if (!tag) continue;
    proxies[i].name = (mode === "suffix")
      ? `${proxies[i].name} ${tag}`.slice(0, 95)
      : `${tag}`.slice(0, 95);
  }

  $.write(JSON.stringify(cacheAll), CACHE_KEY);

  try {
    await $.http.post({
      url: "http://127.0.0.1:9876/stop",
      headers: { "content-type": "application/json" },
      timeout,
      body: JSON.stringify({ pid: [sb.pid] }),
    });
  } catch {}

  return proxies;
}

