# ⚡ PulseSocial — Analítica de Redes Sociales con Asistente IA

**PulseSocial** es un panel ligero, rápido y sin dependencias pesadas (Vanilla HTML, CSS y JS) inspirado en Hootsuite para monitorizar métricas clave de redes sociales, auditar publicaciones y obtener recomendaciones accionables mediante Inteligencia Artificial.

## 🚀 Características Principales

- **Dashboard Multired:** Filtra métricas globales o por canal individual (**Instagram, LinkedIn y X**).
- **KPIs en Tiempo Real:** Visualización de Alcance, Tasa de Engagement (ER%), Nuevos Seguidores y Clics con indicadores de tendencia.
- **Gráficos Interactivos:** Evolución temporal de alcance vs. interacciones y distribución por formato de contenido (impulsado por Chart.js).
- **Copiloto Analítico IA (Modo Dual):**
  - **Modo Conectado (Gemini API):** Pega tu API Key de Google AI Studio en la barra lateral para que el asistente analice el JSON en vivo de tu dashboard y responda cualquier consulta estratégica.
  - **Modo Local (Sin API Key):** Incluye un motor analítico integrado que calcula métricas, detecta publicaciones ganadoras/perdedoras y sugiere mejoras sin necesidad de conexión externa.
- **Exportación a CSV:** Descarga instantánea de los datos de rendimiento filtrados listos para Excel o Google Sheets.
- **Perfiles públicos conectados:** Gestiona desde el botón "✎" los enlaces de Instagram, LinkedIn y X. Los enlaces se guardan localmente en el navegador y el asistente puede incluirlos en su contexto. Esta integración no consulta métricas privadas de las plataformas sin sus APIs oficiales.

## 📂 Estructura del Proyecto

```text
pulsesocial/
├── index.html   # Estructura del dashboard, tabla de posts y panel lateral IA
├── styles.css   # Estilos modernos en modo oscuro y diseño responsivo
├── app.js       # Lógica de datos, gráficos, exportación CSV y motor IA
└── README.md    # Documentación del proyecto
```
