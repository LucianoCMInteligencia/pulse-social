// Base de datos de métricas (puedes conectarla a tu backend o importar CSV)
const socialData = {
  all: {
    title: "Analítica Global de Redes",
    kpis: { reach: "148,500", reachTrend: "+18.4%", er: "4.8%", erTrend: "+0.6%", followers: "+1,240", followersTrend: "+12.1%", clicks: "3,890", clicksTrend: "-2.3%" },
    timelineLabels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    reachSeries: [31000, 35400, 39200, 42900],
    engagementSeries: [1420, 1680, 1950, 2120],
    formats: { labels: ["Reels / Video", "Carruseles", "Imagen Única", "Enlaces/Texto"], values: [48, 30, 14, 8] }
  },
  instagram: {
    title: "Analítica de Instagram",
    kpis: { reach: "84,200", reachTrend: "+24.0%", er: "5.9%", erTrend: "+1.1%", followers: "+790", followersTrend: "+15.4%", clicks: "1,420", clicksTrend: "+4.2%" },
    timelineLabels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    reachSeries: [17000, 19500, 22400, 25300],
    engagementSeries: [980, 1150, 1340, 1510],
    formats: { labels: ["Reels", "Carruseles", "Posts Estáticos", "Stories"], values: [55, 28, 10, 7] }
  },
  linkedin: {
    title: "Analítica de LinkedIn",
    kpis: { reach: "41,300", reachTrend: "+14.2%", er: "4.1%", erTrend: "+0.3%", followers: "+320", followersTrend: "+9.8%", clicks: "1,850", clicksTrend: "+6.5%" },
    timelineLabels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    reachSeries: [9200, 10100, 10800, 11200],
    engagementSeries: [310, 380, 420, 460],
    formats: { labels: ["Carrusel PDF", "Texto + Imagen", "Artículos", "Video Nativo"], values: [42, 33, 15, 10] }
  },
  x: {
    title: "Analítica de X (Twitter)",
    kpis: { reach: "23,000", reachTrend: "+5.1%", er: "2.4%", erTrend: "-0.4%", followers: "+130", followersTrend: "+3.2%", clicks: "620", clicksTrend: "-8.1%" },
    timelineLabels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    reachSeries: [4800, 5800, 6000, 6400],
    engagementSeries: [130, 150, 190, 150],
    formats: { labels: ["Hilos", "Tweets con Media", "Tweets Cortos", "Enlaces"], values: [40, 35, 18, 7] }
  }
};

const recentPosts = [
  { network: "instagram", title: "Reel: 5 errores al escalar campañas digitales", format: "Reel", reach: 34200, interactions: 2394, er: 7.0 },
  { network: "linkedin", title: "Caso de estudio: Cómo optimizamos el ROI en Q3", format: "Carrusel PDF", reach: 18500, interactions: 888, er: 4.8 },
  { network: "instagram", title: "Carrusel: Checklist de auditoría mensual", format: "Carrusel", reach: 21400, interactions: 1241, er: 5.8 },
  { network: "x", title: "Hilo: Herramientas gratuitas para analítica web", format: "Hilo", reach: 9800, interactions: 313, er: 3.2 },
  { network: "linkedin", title: "Reflexión sobre automatización e IA en marketing", format: "Texto + Imagen", reach: 12100, interactions: 411, er: 3.4 },
  { network: "x", title: "Lanzamiento de nuestra nueva guía descargable", format: "Enlace", reach: 4200, interactions: 63, er: 1.5 }
];

let currentNetwork = "all";
let perfChartInstance = null;
let formatChartInstance = null;
const defaultSocialLinks = {
  instagram: "https://www.instagram.com/servance1970/",
  linkedin: "https://www.linkedin.com/in/luciano-fco-amaya-gut-1538392b4",
  x: "https://x.com/fco_lucian13641"
};
const socialLinkConfig = {
  instagram: { label: "Instagram", icon: "📸" },
  linkedin: { label: "LinkedIn", icon: "💼" },
  x: { label: "X", icon: "🐦" }
};
let socialLinks = loadSocialLinks();

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderDashboard("all");
  setupEventListeners();
  renderSocialLinks();
});

function setupEventListeners() {
  // Navegación por redes
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentNetwork = e.target.dataset.network;
      renderDashboard(currentNetwork);
    });
  });

  // Panel IA
  const aiPanel = document.getElementById("aiPanel");
  document.getElementById("toggleAiBtn").addEventListener("click", () => aiPanel.classList.add("open"));
  document.getElementById("closeAiBtn").addEventListener("click", () => aiPanel.classList.remove("open"));

  // Botón auditoría rápida desde tabla
  document.getElementById("analyzePostsAiBtn").addEventListener("click", () => {
    aiPanel.classList.add("open");
    handleAiQuery("Audita mis publicaciones recientes: identifica la mejor, la peor y explica por qué.");
  });

  // Chips de prompts rápidos
  document.querySelectorAll(".prompt-chip").forEach(chip => {
    chip.addEventListener("click", () => handleAiQuery(chip.dataset.prompt));
  });

  // Formulario chat IA
  document.getElementById("aiChatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("aiUserInput");
    if (!input.value.trim()) return;
    handleAiQuery(input.value.trim());
    input.value = "";
  });

  // Detectar cambio en API Key
  document.getElementById("geminiKey").addEventListener("input", (e) => {
    const badge = document.getElementById("aiModeBadge");
    badge.textContent = e.target.value.trim() ? "Modo: Gemini API Conectada" : "Modo: Análisis Local";
  });

  // Exportar CSV
  document.getElementById("exportCsvBtn").addEventListener("click", exportPostsToCSV);

  setupSocialLinks();
}

function renderDashboard(network) {
  const data = socialData[network];
  document.getElementById("dashboardTitle").textContent = data.title;

  // Actualizar KPIs
  document.getElementById("kpiReach").textContent = data.kpis.reach;
  updateTrend("trendReach", data.kpis.reachTrend);

  document.getElementById("kpiEngagement").textContent = data.kpis.er;
  updateTrend("trendEngagement", data.kpis.erTrend);

  document.getElementById("kpiFollowers").textContent = data.kpis.followers;
  updateTrend("trendFollowers", data.kpis.followersTrend);

  document.getElementById("kpiClicks").textContent = data.kpis.clicks;
  updateTrend("trendClicks", data.kpis.clicksTrend);

  renderCharts(data);
  renderPostsTable(network);
}

function updateTrend(elementId, value) {
  const el = document.getElementById(elementId);
  el.textContent = value;
  el.className = "kpi-trend " + (value.startsWith("+") ? "positive" : "negative");
}

function renderCharts(data) {
  const ctxPerf = document.getElementById("performanceChart").getContext("2d");
  const ctxFormat = document.getElementById("formatChart").getContext("2d");

  if (perfChartInstance) perfChartInstance.destroy();
  if (formatChartInstance) formatChartInstance.destroy();

  perfChartInstance = new Chart(ctxPerf, {
    type: "line",
    data: {
      labels: data.timelineLabels,
      datasets: [
        {
          label: "Alcance",
          data: data.reachSeries,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.35,
          fill: true,
          yAxisID: "y"
        },
        {
          label: "Interacciones",
          data: data.engagementSeries,
          borderColor: "#a855f7",
          backgroundColor: "rgba(168, 85, 247, 0.1)",
          tension: 0.35,
          fill: true,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#f8fafc" } } },
      scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } },
        y: { type: "linear", position: "left", ticks: { color: "#94a3b8" }, grid: { color: "#334155" } },
        y1: { type: "linear", position: "right", ticks: { color: "#a855f7" }, grid: { drawOnChartArea: false } }
      }
    }
  });

  formatChartInstance = new Chart(ctxFormat, {
    type: "doughnut",
    data: {
      labels: data.formats.labels,
      datasets: [{
        data: data.formats.values,
        backgroundColor: ["#6366f1", "#3b82f6", "#10b981", "#f59e0b"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom", labels: { color: "#f8fafc" } } }
    }
  });
}

function renderPostsTable(network) {
  const tbody = document.getElementById("postsTableBody");
  tbody.innerHTML = "";

  const filtered = network === "all"
    ? recentPosts
    : recentPosts.filter(p => p.network === network);

  filtered.forEach(post => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge badge-${post.network}">${escapeHtml(post.network.toUpperCase())}</span></td>
      <td>${escapeHtml(post.title)}</td>
      <td>${escapeHtml(post.format)}</td>
      <td>${post.reach.toLocaleString()}</td>
      <td>${post.interactions.toLocaleString()}</td>
      <td><strong>${post.er}%</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

function setupSocialLinks() {
  const dialog = document.getElementById("socialLinksDialog");
  document.getElementById("editSocialLinksBtn").addEventListener("click", () => {
    document.getElementById("instagramUrl").value = socialLinks.instagram || "";
    document.getElementById("linkedinUrl").value = socialLinks.linkedin || "";
    document.getElementById("xUrl").value = socialLinks.x || "";
    dialog.showModal();
  });

  document.getElementById("closeSocialLinksBtn").addEventListener("click", () => dialog.close());
  document.getElementById("resetSocialLinksBtn").addEventListener("click", () => {
    socialLinks = { ...defaultSocialLinks };
    saveSocialLinks();
    renderSocialLinks();
    document.getElementById("instagramUrl").value = socialLinks.instagram;
    document.getElementById("linkedinUrl").value = socialLinks.linkedin;
    document.getElementById("xUrl").value = socialLinks.x;
  });

  document.getElementById("socialLinksForm").addEventListener("submit", (event) => {
    event.preventDefault();
    socialLinks = {
      instagram: normalizeProfileUrl(document.getElementById("instagramUrl").value),
      linkedin: normalizeProfileUrl(document.getElementById("linkedinUrl").value),
      x: normalizeProfileUrl(document.getElementById("xUrl").value)
    };
    saveSocialLinks();
    renderSocialLinks();
    dialog.close();
  });
}

function normalizeProfileUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function loadSocialLinks() {
  try {
    const saved = localStorage.getItem("pulsesocial_social_links");
    return saved ? { ...defaultSocialLinks, ...JSON.parse(saved) } : { ...defaultSocialLinks };
  } catch {
    return { ...defaultSocialLinks };
  }
}

function saveSocialLinks() {
  try {
    localStorage.setItem("pulsesocial_social_links", JSON.stringify(socialLinks));
  } catch {
    // The dashboard still works when browser storage is unavailable.
  }
}

function renderSocialLinks() {
  const list = document.getElementById("socialLinksList");
  list.innerHTML = "";

  Object.entries(socialLinkConfig).forEach(([network, config]) => {
    const url = socialLinks[network];
    if (!url) return;
    const link = document.createElement("a");
    link.className = "social-link";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = `<span>${config.icon} ${escapeHtml(config.label)}</span><span class="social-link-status">↗ Ver perfil</span>`;
    list.appendChild(link);
  });

  if (!list.children.length) {
    list.innerHTML = '<span class="kpi-label">Sin perfiles configurados</span>';
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ==========================================
// MOTOR DE ASISTENTE IA (Gemini API + Local)
// ==========================================
async function handleAiQuery(userPrompt) {
  appendMessage("user", userPrompt);
  const loadingMsg = appendMessage("bot", "Analizando métricas en contexto...");

  const apiKey = document.getElementById("geminiKey").value.trim();
  const contextData = buildAnalyticsContext();

  try {
    let reply = "";
    if (apiKey) {
      reply = await callGeminiAPI(apiKey, userPrompt, contextData);
    } else {
      // Simulación de latencia breve para experiencia natural
      await new Promise(r => setTimeout(r, 450));
      reply = generateLocalInsight(userPrompt);
    }
    loadingMsg.textContent = reply;
  } catch (error) {
    loadingMsg.textContent = `⚠️ Error al conectar con la API: ${error.message}. Cambiando a análisis local:\n\n` + generateLocalInsight(userPrompt);
  }
}

function buildAnalyticsContext() {
  const activeStats = socialData[currentNetwork];
  const posts = currentNetwork === "all" ? recentPosts : recentPosts.filter(p => p.network === currentNetwork);
  return JSON.stringify({
    vistaActual: currentNetwork,
    metricas: activeStats,
    publicaciones: posts,
    perfilesPublicos: socialLinks
  });
}

async function callGeminiAPI(apiKey, prompt, contextJson) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const systemInstruction = `Eres un analista senior de Social Media dentro de la herramienta PulseSocial. 
  Analiza los siguientes datos JSON reales del dashboard del usuario y responde de forma concisa, accionable y directa en español (usa viñetas claras, sin rodeos).
  Datos actuales del usuario: ${contextJson}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemInstruction}\n\nPregunta del usuario: ${prompt}` }] }]
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.candidates[0].content.parts[0].text;
}

// Motor heurístico offline si no se ingresa API Key
function generateLocalInsight(prompt) {
  const q = prompt.toLowerCase();
  const data = socialData[currentNetwork];
  const posts = currentNetwork === "all" ? recentPosts : recentPosts.filter(p => p.network === currentNetwork);
  const sortedPosts = [...posts].sort((a, b) => b.er - a.er);
  const bestPost = sortedPosts[0];
  const worstPost = sortedPosts[sortedPosts.length - 1];

  if (q.includes("formato") || q.includes("publicar")) {
    return `🎯 Análisis de Formatos (${data.title}):\n• El formato líder es "${data.formats.labels[0]}" concentrando el ${data.formats.values[0]}% del rendimiento.\n• Tu publicación con mayor tracción fue "${bestPost.title}" (${bestPost.er}% ER).\n• Recomendación: Convierte tus publicaciones de enlace directo en carruseles o videos cortos con CTA en el primer comentario.`;
  }

  if (q.includes("audita") || q.includes("publicaciones") || q.includes("mejora") || q.includes("débiles")) {
    return `🛠️ Auditoría de Rendimiento:\n• Mejor contenido: "${bestPost.title}" en ${bestPost.network.toUpperCase()} con ${bestPost.er}% de Engagement.\n• Punto débil: "${worstPost.title}" cayó a ${worstPost.er}% ER. Los enlaces externos penalizan el alcance orgánico.\n• Acción inmediata: Reutiliza el tema de tu post ganador en un formato nativo en las próximas 48 horas.`;
  }

  return `📊 Resumen Ejecutivo (${data.title}):\n• Alcance acumulado: ${data.kpis.reach} (${data.kpis.reachTrend}) con una tasa de engagement de ${data.kpis.er}.\n• Crecimiento de comunidad: ${data.kpis.followers} seguidores nuevos.\n• Insight clave: El formato "${data.formats.labels[0]}" impulsa la mayor parte de tus interacciones. Prioriza este formato esta semana.`;
}

function appendMessage(sender, text) {
  const history = document.getElementById("aiChatHistory");
  const msg = document.createElement("div");
  msg.className = `ai-message ${sender}`;
  msg.textContent = text;
  history.appendChild(msg);
  history.scrollTop = history.scrollHeight;
  return msg;
}

function exportPostsToCSV() {
  const headers = ["Red,Publicacion,Formato,Alcance,Interacciones,ER_Porcentaje"];
  const filtered = currentNetwork === "all"
    ? recentPosts
    : recentPosts.filter(post => post.network === currentNetwork);
  const rows = filtered.map(p =>
    `"${p.network}","${p.title.replace(/"/g, '""')}","${p.format}",${p.reach},${p.interactions},${p.er}`
  );
  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `pulsesocial_reporte_${currentNetwork}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}