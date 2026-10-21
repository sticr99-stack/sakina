const PRAYERS = [
  { id: "fajr", name: "الفجر", label: "فجر", time: "05:43", icon: "i-moon", kind: "prayer" },
  { id: "sunrise", name: "الشروق", label: "شروق", time: "07:08", icon: "i-sun", kind: "sunrise" },
  { id: "dhuhr", name: "الظهر", label: "ظهر", time: "13:20", icon: "i-sun", kind: "prayer" },
  { id: "asr", name: "العصر", label: "عصر", time: "16:45", icon: "i-sun", kind: "prayer" },
  { id: "maghrib", name: "المغرب", label: "مغرب", time: "18:50", icon: "i-moon", kind: "prayer" },
  { id: "isha", name: "العشاء", label: "عشاء", time: "20:03", icon: "i-moon", kind: "prayer" },
];

const CITY_OFFSETS = {
  "مراكش": [0, 0, 0, 0, 0, 0],
  "الدار البيضاء": [-2, -1, -2, -3, -3, -3],
  "الرباط": [-1, -2, -1, -2, -3, -3],
  "المدينة المنورة": [-7, -6, -3, -2, -2, -1],
};

const METHOD_NAMES = { 21: "المغرب", 3: "رابطة العالم الإسلامي", 4: "أم القرى", 5: "الهيئة المصرية", 2: "ISNA" };
const DEFAULT_CITY = { name: "مراكش", country: "المغرب", lat: 31.6295, lon: -7.9811, timeZone: "Africa/Casablanca" };
const savedSettings = safeLoad("sakina-settings-v1", {});

const DHIKR_SETS = {
  morning: {
    label: "ذِكر الصباح",
    items: [
      { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ", meaning: "أصبحنا على فطرة الإسلام، والحمد لله على نعمه.", count: 1, source: "ذكر مأثور من أذكار الصباح." },
      { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", meaning: "تنزيه الله تعالى وحمده على فضله.", count: 33, source: "ورد تسبيح؛ راجع مصدرًا موثوقًا عند اعتماد نصوص الأذكار." },
      { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا", meaning: "تجديد التوكل على الله في بداية اليوم.", count: 1, source: "من أذكار الصباح والمساء." },
      { text: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا", meaning: "دعاء بالرضا والثبات على الإيمان.", count: 3, source: "من الأذكار المأثورة." },
      { text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", meaning: "استغفار وتجديد للتوبة.", count: 3, source: "استغفار عام." },
    ],
  },
  evening: {
    label: "ذِكر المساء",
    items: [
      { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ", meaning: "مساءٌ يبدأ بحمد الله واللجوء إليه.", count: 1, source: "ذكر مأثور من أذكار المساء." },
      { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", meaning: "تنزيه الله تعالى وحمده على فضله.", count: 33, source: "ورد تسبيح؛ راجع مصدرًا موثوقًا عند اعتماد نصوص الأذكار." },
      { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا", meaning: "تفويض الأمر إلى الله في المساء.", count: 1, source: "من أذكار الصباح والمساء." },
      { text: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا", meaning: "دعاء بالرضا والثبات على الإيمان.", count: 3, source: "من الأذكار المأثورة." },
      { text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", meaning: "استغفار وتجديد للتوبة.", count: 3, source: "استغفار عام." },
    ],
  },
  sleep: {
    label: "ذِكر النوم",
    items: [
      { text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", meaning: "دعاء يُقال عند الإيواء إلى الفراش.", count: 1, source: "من أذكار النوم المأثورة." },
      { text: "سُبْحَانَ اللَّهِ", meaning: "تنزيه الله تعالى عن كل نقص.", count: 33, source: "من التسبيح قبل النوم." },
      { text: "الْحَمْدُ لِلَّهِ", meaning: "الثناء على الله وشكره.", count: 33, source: "من الذكر قبل النوم." },
      { text: "اللَّهُ أَكْبَرُ", meaning: "تعظيم الله تعالى.", count: 34, source: "من الذكر قبل النوم." },
      { text: "آيَةُ الْكُرْسِيِّ", meaning: "قراءة آية الكرسي قبل النوم.", count: 1, source: "سورة البقرة، الآية ٢٥٥. يُضاف النص الكامل من مصدر موثوق." },
    ],
  },
};

const DAILY_GOALS = [
  { id: "fajr", title: "صلاة الفجر", detail: "سجّل إتمام الصلاة" },
  { id: "dhuhr", title: "صلاة الظهر", detail: "سجّل إتمام الصلاة" },
  { id: "asr", title: "صلاة العصر", detail: "سجّل إتمام الصلاة" },
  { id: "maghrib", title: "صلاة المغرب", detail: "سجّل إتمام الصلاة" },
  { id: "isha", title: "صلاة العشاء", detail: "سجّل إتمام الصلاة" },
  { id: "quran", title: "ورد من القرآن", detail: "صفحتان من هدف اليوم" },
  { id: "adhkar", title: "الأذكار اليومية", detail: "أكمل وردًا واحدًا" },
];

const DUAS = [
  { id: "dua-201", group: "quran", title: "دعاء الخير في الدنيا والآخرة", text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", source: "سورة البقرة، الآية ٢٠١" },
  { id: "dua-8", group: "quran", title: "دعاء الثبات والرحمة", text: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ", source: "سورة آل عمران، الآية ٨" },
  { id: "dua-23", group: "quran", title: "دعاء آدم عليه السلام", text: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", source: "سورة الأعراف، الآية ٢٣" },
];

function safeLoad(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function safeSave(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Local persistence may be unavailable in file preview. */ }
}

function todayKey(date) {
  if (!date) {
    const cityDate = getCityClock();
    return `${cityDate.year}-${String(cityDate.month).padStart(2, "0")}-${String(cityDate.day).padStart(2, "0")}`;
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const state = {
  city: savedSettings.city || DEFAULT_CITY,
  calculationMethod: Number(savedSettings.calculationMethod || 21),
  livePrayers: null,
  timeSource: "loading",
  timeZone: (savedSettings.city || DEFAULT_CITY).timeZone || "Africa/Casablanca",
  timesRequestId: 0,
  reminders: safeLoad("sakina-reminders-v1", false),
  reminderTimer: null,
  page: "home",
  dhikrSet: "morning",
  dhikrIndex: 0,
  dhikrDone: 0,
  counter: 0,
  reminders: true,
  compassHeading: null,
  progress: safeLoad("sakina-progress-v1", {}),
  tasbih: safeLoad("sakina-tasbih-v1", { phrase: "سُبْحَانَ اللَّهِ", count: 0, target: 33 }),
  savedDuas: safeLoad("sakina-saved-duas-v1", []),
  duaFilter: "all",
};

const el = (id) => document.getElementById(id);
const digits = new Intl.NumberFormat("ar-MA", { maximumFractionDigits: 0 });
let toastTimer;

function showToast(message) {
  const toast = el("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function formatTime(time, withMeridiem = false) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat("ar-MA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function minutesForTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function getCityPrayers() {
  if (state.livePrayers) return state.livePrayers;
  const offsets = CITY_OFFSETS[state.city.name] || CITY_OFFSETS["مراكش"];
  return PRAYERS.map((prayer, index) => {
    const minutes = minutesForTime(prayer.time) + offsets[index];
    const normalized = (minutes + 1440) % 1440;
    return { ...prayer, time: `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}` };
  });
}

function getCityClock() {
  const now = new Date();
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: state.timeZone,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]));
    return values;
  } catch {
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(), hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };
  }
}

function prayerDateForCity() {
  const clock = getCityClock();
  return `${String(clock.day).padStart(2, "0")}-${String(clock.month).padStart(2, "0")}-${clock.year}`;
}

function citySecondsOfDay() {
  const clock = getCityClock();
  return clock.hour * 3600 + clock.minute * 60 + clock.second;
}

function getPrayerState() {
  const prayers = getCityPrayers();
  const currentSeconds = citySecondsOfDay();
  const currentMinutes = Math.floor(currentSeconds / 60);
  const devotional = prayers.filter((p) => p.kind === "prayer");
  let next = devotional.find((p) => minutesForTime(p.time) > currentMinutes);
  let untilTomorrow = false;
  if (!next) {
    next = devotional[0];
    untilTomorrow = true;
  }
  const passed = devotional.filter((p) => minutesForTime(p.time) <= currentMinutes).length;
  const current = devotional.find((p) => p.id === next.id);
  return { prayers, next, passed, current, untilTomorrow };
}

function setDateLabels() {
  const now = new Date();
  const gregorian = new Intl.DateTimeFormat("ar-MA", { timeZone: state.timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now);
  el("todayLabel").textContent = gregorian;
  el("gregorianDate").textContent = gregorian;
  el("prayerDate").textContent = `اليوم في ${state.city.name}`;
  try {
    const hijriParts = new Intl.DateTimeFormat("ar-MA-u-ca-islamic", { timeZone: state.timeZone, day: "numeric", month: "long", year: "numeric" }).formatToParts(now);
    const parts = Object.fromEntries(hijriParts.map((part) => [part.type, part.value]));
    el("hijriDay").textContent = parts.day || "—";
    el("hijriMonth").textContent = parts.month || "التقويم الهجري";
    el("fullHijri").textContent = `${parts.day || "—"} ${parts.month || ""} ${parts.year || ""}`;
  } catch {
    el("hijriDay").textContent = "—";
    el("hijriMonth").textContent = "التاريخ الهجري";
    el("fullHijri").textContent = "التاريخ الهجري غير متاح في هذا المتصفح";
  }
}

function getTodayProgress() {
  const day = todayKey();
  if (!state.progress[day]) state.progress[day] = {};
  return state.progress[day];
}

function saveProgress() {
  safeSave("sakina-progress-v1", state.progress);
}

function setGoalComplete(goalId, complete) {
  getTodayProgress()[goalId] = complete;
  saveProgress();
  renderPrayerTimes();
  renderGoals();
}

function renderPrayerTimes() {
  const { prayers, next, passed, untilTomorrow } = getPrayerState();
  el("nextPrayerName").textContent = next.name;
  el("nextPrayerTime").textContent = formatTime(next.time);
  el("prayerMethodLabel").textContent = `${METHOD_NAMES[state.calculationMethod] || "طريقة الحساب"} · توقيت ${state.city.name}`;
  const today = getTodayProgress();
  const prayersDone = ["fajr", "dhuhr", "asr", "maghrib", "isha"].filter((id) => today[id]).length;
  el("dayPrayerCount").textContent = `${digits.format(prayersDone)} / ٥`;
  el("prayerTrack").innerHTML = prayers.map((prayer) => {
    const current = prayer.id === next.id && prayer.kind === "prayer";
    return `<div class="track-item ${current ? "current" : ""}"><span>${prayer.label}</span><b>${formatTime(prayer.time)}</b><i class="track-dot"></i></div>`;
  }).join("");
  el("fullPrayerList").innerHTML = prayers.map((prayer) => {
    const current = prayer.id === next.id && prayer.kind === "prayer";
    const isPast = minutesForTime(prayer.time) <= Math.floor(citySecondsOfDay() / 60);
    const checked = Boolean(today[prayer.id]);
    const subtitle = prayer.kind === "sunrise" ? "الشروق" : current ? (untilTomorrow ? "الصلاة القادمة غدًا" : "الصلاة القادمة") : isPast ? "انقضى وقتها · يمكنك تسجيلها" : "متبقي على الصلاة";
    const action = prayer.kind === "prayer" ? `<button class="prayer-check ${checked ? "checked" : ""}" data-prayer-check="${prayer.id}" aria-pressed="${checked}" aria-label="${checked ? "إلغاء تسجيل" : "تسجيل"} ${prayer.name}"><svg class="icon"><use href="#i-check" /></svg></button>` : "";
    return `<div class="full-prayer-row ${current ? "active" : ""}"><span class="prayer-row-icon"><svg class="icon"><use href="#${prayer.icon}" /></svg></span><span class="prayer-row-copy"><b>${prayer.name}</b><small>${subtitle}</small></span><time class="prayer-row-time">${formatTime(prayer.time)}</time>${action}</div>`;
  }).join("");
  document.querySelectorAll("[data-prayer-check]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.prayerCheck;
    setGoalComplete(id, !getTodayProgress()[id]);
  }));
  renderCountdown();
  schedulePrayerReminder();
}

function schedulePrayerReminder() {
  clearTimeout(state.reminderTimer);
  state.reminderTimer = null;
  if (!state.reminders || !["live", "cached"].includes(state.timeSource) || !("Notification" in window) || Notification.permission !== "granted") return;

  const prayers = getCityPrayers().filter((prayer) => prayer.kind === "prayer");
  const nowSeconds = citySecondsOfDay();
  const leadSeconds = 10 * 60;
  let upcoming = prayers.find((prayer) => minutesForTime(prayer.time) * 60 - nowSeconds > leadSeconds);
  let delaySeconds;
  if (upcoming) {
    delaySeconds = minutesForTime(upcoming.time) * 60 - nowSeconds - leadSeconds;
  } else {
    upcoming = prayers[0];
    delaySeconds = 86400 - nowSeconds + minutesForTime(upcoming.time) * 60 - leadSeconds;
  }

  state.reminderTimer = setTimeout(() => {
    if (Notification.permission === "granted") {
      new Notification(`اقترب وقت صلاة ${upcoming.name}`, {
        body: `تذكير من سَكينة · بعد عشر دقائق في ${state.city.name}`,
        icon: "./assets/icon.svg",
        tag: `sakina-${upcoming.id}`,
      });
    }
    schedulePrayerReminder();
  }, Math.max(1000, delaySeconds * 1000));
}

function renderReminderToggle() {
  const button = el("reminderToggle");
  const toggle = button.querySelector(".toggle");
  toggle.classList.toggle("on", state.reminders);
  toggle.setAttribute("aria-label", state.reminders ? "مفعّل" : "متوقف");
  button.setAttribute("aria-pressed", String(state.reminders));
}

function prayerCacheKey() {
  return `sakina-prayer-${state.city.lat.toFixed(3)}-${state.city.lon.toFixed(3)}-${state.calculationMethod}-${prayerDateForCity()}`;
}

function setTimesStatus(status, detail = "") {
  state.timeSource = status;
  const labels = {
    loading: "جارٍ تحديث مواقيت اليوم…",
    live: `مواقيت اليوم · ${METHOD_NAMES[state.calculationMethod] || "طريقة الحساب"}`,
    cached: "مواقيت محفوظة لهذا اليوم",
    fallback: "تعذر الاتصال · أوقات تقريبية",
  };
  const banner = el("timesStatus");
  banner.className = `demo-banner status-demo ${status}`;
  banner.innerHTML = `<span class="demo-dot"></span><span>${detail || labels[status]}</span><span class="status-action">${status === "loading" ? "" : "تحديث"}</span>`;
}

function normalizeApiTime(value) {
  const match = String(value || "").match(/(\d{1,2}:\d{2})/);
  return match ? match[1].padStart(5, "0") : "--:--";
}

function getPrayerTimesFromResponse(data) {
  return [
    { ...PRAYERS[0], time: normalizeApiTime(data.Fajr) },
    { ...PRAYERS[1], time: normalizeApiTime(data.Sunrise) },
    { ...PRAYERS[2], time: normalizeApiTime(data.Dhuhr) },
    { ...PRAYERS[3], time: normalizeApiTime(data.Asr) },
    { ...PRAYERS[4], time: normalizeApiTime(data.Maghrib) },
    { ...PRAYERS[5], time: normalizeApiTime(data.Isha) },
  ];
}

async function loadPrayerTimes() {
  const requestId = ++state.timesRequestId;
  state.livePrayers = null;
  setTimesStatus("loading");
  renderPrayerTimes();
  const key = prayerCacheKey();
  const cached = safeLoad(key, null);
  if (cached?.times?.length === 6) {
    state.livePrayers = cached.times;
    state.timeZone = cached.timeZone || state.city.timeZone;
    setTimesStatus("cached", `مواقيت محفوظة · ${METHOD_NAMES[state.calculationMethod] || "طريقة الحساب"}`);
    setDateLabels();
    renderPrayerTimes();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);
  try {
    const url = new URL(`https://api.aladhan.com/v1/timings/${prayerDateForCity()}`);
    url.searchParams.set("latitude", String(state.city.lat));
    url.searchParams.set("longitude", String(state.city.lon));
    url.searchParams.set("method", String(state.calculationMethod));
    url.searchParams.set("iso8601", "false");
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.code !== 200 || !payload.data?.timings) throw new Error("Invalid prayer time response");
    if (requestId !== state.timesRequestId) return;
    state.livePrayers = getPrayerTimesFromResponse(payload.data.timings);
    state.timeZone = payload.data.meta?.timezone || state.city.timeZone;
    safeSave(key, { times: state.livePrayers, timeZone: state.timeZone, fetchedAt: Date.now() });
    setTimesStatus("live");
    setDateLabels();
    renderPrayerTimes();
  } catch (error) {
    if (requestId !== state.timesRequestId) return;
    if (cached?.times?.length === 6) {
      state.livePrayers = cached.times;
      state.timeZone = cached.timeZone || state.city.timeZone;
      setTimesStatus("cached", `تعذر التحديث · نعرض مواقيت اليوم المحفوظة`);
    } else {
      state.livePrayers = null;
      setTimesStatus("fallback", `تعذر جلب المواقيت · ${METHOD_NAMES[state.calculationMethod] || "الطريقة المختارة"}`);
    }
    setDateLabels();
    renderPrayerTimes();
  } finally {
    clearTimeout(timeoutId);
  }
}

function renderCountdown() {
  const { next, untilTomorrow } = getPrayerState();
  const secondsOfNext = minutesForTime(next.time) * 60;
  const nowSeconds = citySecondsOfDay();
  let secondsLeft = secondsOfNext - nowSeconds;
  if (secondsLeft <= 0 || untilTomorrow) secondsLeft += 86400;
  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  el("countdown").textContent = [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  el("periodLabel").textContent = untilTomorrow ? "الصلاة القادمة غدًا" : "باقي على الصلاة";
}

function updateBearing() {
  const kaaba = { lat: 21.4225 * Math.PI / 180, lon: 39.8262 * Math.PI / 180 };
  const lat = state.city.lat * Math.PI / 180;
  const lon = state.city.lon * Math.PI / 180;
  const deltaLon = kaaba.lon - lon;
  const y = Math.sin(deltaLon) * Math.cos(kaaba.lat);
  const x = Math.cos(lat) * Math.sin(kaaba.lat) - Math.sin(lat) * Math.cos(kaaba.lat) * Math.cos(deltaLon);
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  const rounded = Math.round(bearing);
  el("bearingValue").textContent = `${digits.format(rounded)}°`;
  el("bearingFromNorth").textContent = `${digits.format(rounded)}°`;
  el("qiblaNeedle").style.transform = `translate(-50%, -50%) rotate(${bearing - (state.compassHeading || 0)}deg)`;
  el("qiblaCity").textContent = `${state.city.name}، ${state.city.country}`;
}

function showPage(page) {
  state.page = page;
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `view-${page}`));
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.nav === page));
  if (["home", "prayers", "adhkar", "quran", "qibla", "calendar"].includes(page)) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function openCityDialog() {
  document.querySelectorAll(".city-options button").forEach((button) => {
    button.classList.toggle("selected", button.dataset.city === state.city.name);
  });
  el("calcMethod").value = String(state.calculationMethod);
  el("cityDialog").showModal();
}

function updateDhikrDisplay() {
  const set = DHIKR_SETS[state.dhikrSet];
  const item = set.items[state.dhikrIndex];
  el("dhikrCategory").textContent = set.label;
  el("dhikrIndex").textContent = `${digits.format(state.dhikrIndex + 1)} من ${digits.format(set.items.length)}`;
  el("largeDhikr").textContent = item.text;
  el("dhikrMeaning").textContent = item.meaning;
  el("targetCount").textContent = digits.format(item.count);
  el("sessionLabel").textContent = `${digits.format(state.dhikrDone)} من ${digits.format(set.items.length)} أذكار`;
  const percent = Math.round(state.dhikrDone / set.items.length * 100);
  el("sessionPercent").textContent = `${digits.format(percent)}٪`;
  el("sessionRing").style.setProperty("--progress", `${percent}%`);
}

function renderTasbih() {
  el("tasbihPhrase").textContent = state.tasbih.phrase;
  el("tasbihCount").textContent = digits.format(state.tasbih.count);
  el("tasbihTarget").textContent = digits.format(state.tasbih.target);
  document.querySelectorAll("[data-tasbih]").forEach((button) => button.classList.toggle("selected", button.dataset.tasbih === state.tasbih.phrase));
}

function renderGoals() {
  const today = getTodayProgress();
  const completeCount = DAILY_GOALS.filter((goal) => today[goal.id]).length;
  const percent = Math.round(completeCount / DAILY_GOALS.length * 100);
  el("goalDoneCount").textContent = digits.format(completeCount);
  el("goalPercent").textContent = `${digits.format(percent)}٪`;
  el("goalProgressRing").style.setProperty("--progress", `${percent}%`);
  el("goalEncouragement").textContent = completeCount === 7 ? "ما شاء الله، أنجزت أعمال اليوم." : completeCount >= 4 ? "أحسنت، واصل بخطوة أخرى." : "ابدأ بخطوة واحدة اليوم.";
  el("goalChecklist").innerHTML = DAILY_GOALS.map((goal) => {
    const checked = Boolean(today[goal.id]);
    return `<button class="goal-check-row ${checked ? "complete" : ""}" data-goal-check="${goal.id}" aria-pressed="${checked}"><span class="goal-check-mark"><svg class="icon"><use href="#i-check" /></svg></span><span><b>${goal.title}</b><small>${goal.detail}</small></span><span class="goal-state">${checked ? "تمّ" : "تسجيل"}</span></button>`;
  }).join("");
  document.querySelectorAll("[data-goal-check]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.goalCheck;
    setGoalComplete(id, !getTodayProgress()[id]);
  }));
  renderWeek();
}

function renderWeek() {
  const cityDate = getCityClock();
  const today = new Date(cityDate.year, cityDate.month - 1, cityDate.day);
  const days = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = todayKey(date);
    const record = state.progress[key] || {};
    const complete = DAILY_GOALS.every((goal) => record[goal.id]);
    const partial = DAILY_GOALS.some((goal) => record[goal.id]);
    const weekday = new Intl.DateTimeFormat("ar-MA", { weekday: "short" }).format(date).replace("،", "");
    days.push(`<div class="week-day ${complete ? "complete" : partial ? "partial" : ""} ${offset === 0 ? "today" : ""}"><span>${weekday}</span><i>${complete ? "✓" : partial ? "•" : ""}</i></div>`);
  }
  el("weekDots").innerHTML = days.join("");
  const streak = state.progress[todayKey()] && DAILY_GOALS.every((goal) => state.progress[todayKey()][goal.id]);
  el("weeklyNote").textContent = streak ? "أتممت أهداف اليوم؛ أحسنت في الاستمرار." : "تُحفظ إنجازاتك محليًا على هذا الجهاز.";
}

function renderDuas() {
  const filtered = DUAS.filter((dua) => {
    if (state.duaFilter === "quran") return dua.group === "quran";
    if (state.duaFilter === "saved") return state.savedDuas.includes(dua.id);
    return true;
  });
  el("duaList").innerHTML = filtered.length ? filtered.map((dua) => {
    const saved = state.savedDuas.includes(dua.id);
    return `<article class="dua-card"><div class="dua-card-top"><span class="dua-category">من القرآن الكريم</span><button class="save-dua ${saved ? "saved" : ""}" data-save-dua="${dua.id}" aria-pressed="${saved}" aria-label="${saved ? "إزالة من" : "إضافة إلى"} المفضلة">${saved ? "♥" : "♡"}</button></div><h2>${dua.title}</h2><p class="dua-text">${dua.text}</p><div class="dua-card-foot"><span>${dua.source}</span><button class="copy-dua" data-copy-dua="${dua.id}">نسخ الدعاء</button></div></article>`;
  }).join("") : `<div class="empty-duas"><span>♡</span><b>لا توجد أدعية محفوظة بعد</b><small>احفظ دعاءً من قائمة «الكل» ليظهر هنا.</small></div>`;
  document.querySelectorAll("[data-save-dua]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.saveDua;
    state.savedDuas = state.savedDuas.includes(id) ? state.savedDuas.filter((saved) => saved !== id) : [...state.savedDuas, id];
    safeSave("sakina-saved-duas-v1", state.savedDuas);
    renderDuas();
    showToast(state.savedDuas.includes(id) ? "أُضيف الدعاء إلى المفضلة." : "أُزيل الدعاء من المفضلة.");
  }));
  document.querySelectorAll("[data-copy-dua]").forEach((button) => button.addEventListener("click", async () => {
    const dua = DUAS.find((item) => item.id === button.dataset.copyDua);
    try {
      await navigator.clipboard.writeText(`${dua.text} — ${dua.source}`);
      showToast("نُسخ الدعاء إلى الحافظة.");
    } catch {
      showToast("تعذّر النسخ في هذا المتصفح.");
    }
  }));
}

function setDhikrSet(setName) {
  state.dhikrSet = setName;
  state.dhikrIndex = 0;
  state.dhikrDone = 0;
  document.querySelectorAll("[data-dhikr-set]").forEach((button) => button.classList.toggle("selected", button.dataset.dhikrSet === setName));
  updateDhikrDisplay();
}

function nextDhikr() {
  const set = DHIKR_SETS[state.dhikrSet];
  state.dhikrIndex = (state.dhikrIndex + 1) % set.items.length;
  updateDhikrDisplay();
}

function updateCounter() {
  el("dhikrCount").textContent = digits.format(state.counter);
  el("dhikrBar").style.width = `${Math.min(100, state.counter / 33 * 100)}%`;
}

document.querySelectorAll("[data-nav]").forEach((button) => button.addEventListener("click", () => showPage(button.dataset.nav)));
document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", (event) => {
  event.preventDefault();
  showPage(button.dataset.go);
}));

el("cityButton").addEventListener("click", openCityDialog);
el("changeCity").addEventListener("click", openCityDialog);
el("qiblaChangeCity").addEventListener("click", openCityDialog);
document.querySelectorAll(".city-options button").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".city-options button").forEach((option) => option.classList.toggle("selected", option === button));
}));
el("settingsButton").addEventListener("click", openCityDialog);
el("saveSettings").addEventListener("click", () => {
  const selected = document.querySelector(".city-options button.selected");
  if (!selected) return;
  state.city = {
    name: selected.dataset.city,
    country: selected.dataset.country,
    lat: Number(selected.dataset.lat),
    lon: Number(selected.dataset.lon),
    timeZone: selected.dataset.timezone,
  };
  state.calculationMethod = Number(el("calcMethod").value);
  state.timeZone = state.city.timeZone;
  state.livePrayers = null;
  safeSave("sakina-settings-v1", { city: state.city, calculationMethod: state.calculationMethod });
  el("cityName").textContent = state.city.name;
  el("cityButton").querySelector("small").textContent = state.city.country;
  el("cityDialog").close();
  setDateLabels();
  updateBearing();
  loadPrayerTimes();
  showToast(`تم حفظ إعدادات ${state.city.name}.`);
});
el("timesStatus").addEventListener("click", loadPrayerTimes);

let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  el("installButton").hidden = false;
});
el("installButton").addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  el("installButton").hidden = true;
});
window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  el("installButton").hidden = true;
  showToast("تم تثبيت سكينة على جهازك.");
});

el("dhikrIncrement").addEventListener("click", () => {
  const target = DHIKR_SETS[state.dhikrSet].items[state.dhikrIndex].count;
  state.counter = Math.min(target, state.counter + 1);
  updateCounter();
  if (state.counter === target) showToast("أحسنت، أتممت عدد هذا الذكر.");
});
el("resetDhikr").addEventListener("click", () => { state.counter = 0; updateCounter(); showToast("أُعيد عدّاد الذكر إلى الصفر."); });
document.querySelectorAll("[data-dhikr-set]").forEach((button) => button.addEventListener("click", () => setDhikrSet(button.dataset.dhikrSet)));
el("completeDhikr").addEventListener("click", () => {
  const item = DHIKR_SETS[state.dhikrSet].items[state.dhikrIndex];
  state.dhikrDone = Math.min(DHIKR_SETS[state.dhikrSet].items.length, state.dhikrDone + 1);
  state.counter = 0;
  updateCounter();
  updateDhikrDisplay();
  showToast("تقبّل الله منك.");
  if (state.dhikrDone < DHIKR_SETS[state.dhikrSet].items.length) nextDhikr();
});
el("nextDhikr").addEventListener("click", nextDhikr);
el("prevDhikr").addEventListener("click", () => {
  const count = DHIKR_SETS[state.dhikrSet].items.length;
  state.dhikrIndex = (state.dhikrIndex - 1 + count) % count;
  updateDhikrDisplay();
});
el("sourceButton").addEventListener("click", () => showToast(DHIKR_SETS[state.dhikrSet].items[state.dhikrIndex].source));

document.querySelectorAll("[data-tasbih]").forEach((button) => button.addEventListener("click", () => {
  state.tasbih.phrase = button.dataset.tasbih;
  state.tasbih.count = 0;
  safeSave("sakina-tasbih-v1", state.tasbih);
  renderTasbih();
}));
el("tasbihCounter").addEventListener("click", () => {
  state.tasbih.count += 1;
  safeSave("sakina-tasbih-v1", state.tasbih);
  renderTasbih();
  if (state.tasbih.count === state.tasbih.target) showToast("أتممت هدف التسبيح، تقبّل الله منك.");
});
el("targetMinus").addEventListener("click", () => {
  state.tasbih.target = Math.max(1, state.tasbih.target - 1);
  safeSave("sakina-tasbih-v1", state.tasbih);
  renderTasbih();
});
el("targetPlus").addEventListener("click", () => {
  state.tasbih.target = Math.min(999, state.tasbih.target + 1);
  safeSave("sakina-tasbih-v1", state.tasbih);
  renderTasbih();
});
el("tasbihReset").addEventListener("click", () => {
  state.tasbih.count = 0;
  safeSave("sakina-tasbih-v1", state.tasbih);
  renderTasbih();
  showToast("أُعيد عدّاد السبحة.");
});
el("clearGoals").addEventListener("click", () => {
  delete state.progress[todayKey()];
  saveProgress();
  renderGoals();
  renderPrayerTimes();
  showToast("مُسحت إنجازات اليوم.");
});
document.querySelectorAll("[data-dua-filter]").forEach((button) => button.addEventListener("click", () => {
  state.duaFilter = button.dataset.duaFilter;
  document.querySelectorAll("[data-dua-filter]").forEach((tab) => tab.classList.toggle("selected", tab === button));
  renderDuas();
}));

el("reminderToggle").addEventListener("click", async () => {
  if (state.reminders) {
    state.reminders = false;
  } else {
    if (!["live", "cached"].includes(state.timeSource)) {
      showToast("انتظر تحديث مواقيت اليوم قبل تفعيل التذكير.");
      return;
    }
    if (!("Notification" in window) || !window.isSecureContext) {
      showToast("الإشعارات تحتاج إلى متصفح يدعمها واتصال آمن HTTPS.");
      return;
    }
    let permission = Notification.permission;
    if (permission === "default") permission = await Notification.requestPermission();
    if (permission !== "granted") {
      showToast("لم يُسمح بإشعارات الصلاة من إعدادات المتصفح.");
      return;
    }
    state.reminders = true;
  }
  safeSave("sakina-reminders-v1", state.reminders);
  renderReminderToggle();
  schedulePrayerReminder();
  showToast(state.reminders ? "فُعّل التذكير أثناء فتح التطبيق." : "أُوقف تذكير الصلاة.");
});
el("quranContinue").addEventListener("click", () => showToast("قارئ القرآن في هذا النموذج توضيحي؛ اربطه بمصدر نص موثوق."));
el("allSurahs").addEventListener("click", () => showToast("قائمة السور تحتاج إلى ربط مصدر القرآن."));
document.querySelectorAll(".surah-row").forEach((button) => button.addEventListener("click", () => showToast("موضع القراءة التجريبي: سورة البقرة، الآية ٢١.")));

el("calibrateButton").addEventListener("click", async () => {
  const hint = el("compassHint");
  if (typeof DeviceOrientationEvent === "undefined") {
    showToast("مستشعر البوصلة غير متاح في هذا المتصفح.");
    return;
  }
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") {
        showToast("لم يتم منح إذن مستشعر الاتجاه.");
        return;
      }
    } catch {
      showToast("تعذر تفعيل مستشعر الاتجاه.");
      return;
    }
  }
  window.addEventListener("deviceorientation", (event) => {
    const heading = typeof event.webkitCompassHeading === "number" ? event.webkitCompassHeading : (typeof event.alpha === "number" ? 360 - event.alpha : null);
    if (heading === null) return;
    state.compassHeading = heading;
    updateBearing();
  }, { once: false });
  hint.textContent = "حرّك الهاتف حتى يتجه السهم نحو القبلة. تجنّب المعادن القريبة.";
  showToast("تم تفعيل قراءة مستشعر الاتجاه.");
});

setDateLabels();
renderPrayerTimes();
updateBearing();
loadPrayerTimes();
updateDhikrDisplay();
updateCounter();
renderTasbih();
renderGoals();
renderDuas();
renderReminderToggle();
let displayedPrayerDate = prayerDateForCity();
setInterval(() => {
  renderCountdown();
  const currentPrayerDate = prayerDateForCity();
  if (currentPrayerDate !== displayedPrayerDate) {
    displayedPrayerDate = currentPrayerDate;
    loadPrayerTimes();
    setDateLabels();
  }
  const before = el("nextPrayerName").textContent;
  const after = getPrayerState().next.name;
  if (before !== after) renderPrayerTimes();
}, 1000);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
