// BlackRoad API Analytics Dashboard
// Real-time metrics for all BlackRoad APIs

interface Env {
  ENVIRONMENT: string;
}

// Simulated metrics data (in production, this would come from KV/D1/Analytics Engine)
const generateMetrics = () => {
  const now = Date.now();
  const services = ['graphql', 'webhooks', 'email', 'status', 'portal'];

  return {
    summary: {
      totalRequests: 1247893 + Math.floor(Math.random() * 1000),
      requestsToday: 34521 + Math.floor(Math.random() * 500),
      avgLatency: 42 + Math.floor(Math.random() * 20),
      errorRate: (0.12 + Math.random() * 0.1).toFixed(2),
      uptime: 99.97,
    },
    services: services.map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      requests: Math.floor(Math.random() * 10000) + 5000,
      latency: Math.floor(Math.random() * 50) + 20,
      errors: Math.floor(Math.random() * 50),
      status: Math.random() > 0.1 ? 'healthy' : 'degraded',
    })),
    timeseries: Array.from({ length: 24 }, (_, i) => ({
      hour: (new Date(now - (23 - i) * 3600000)).getHours(),
      requests: Math.floor(Math.random() * 2000) + 500,
      errors: Math.floor(Math.random() * 20),
      latency: Math.floor(Math.random() * 30) + 30,
    })),
    topEndpoints: [
      { path: '/graphql', method: 'POST', requests: 12453, avgLatency: 45 },
      { path: '/api/webhooks', method: 'GET', requests: 8234, avgLatency: 23 },
      { path: '/api/status', method: 'GET', requests: 6721, avgLatency: 12 },
      { path: '/api/send', method: 'POST', requests: 4532, avgLatency: 89 },
      { path: '/api/services', method: 'GET', requests: 3421, avgLatency: 18 },
    ],
    errorBreakdown: [
      { code: 400, count: 234, percentage: 45 },
      { code: 401, count: 156, percentage: 30 },
      { code: 500, count: 89, percentage: 17 },
      { code: 429, count: 41, percentage: 8 },
    ],
    regions: [
      { name: 'North America', requests: 45000, latency: 35 },
      { name: 'Europe', requests: 32000, latency: 48 },
      { name: 'Asia Pacific', requests: 18000, latency: 72 },
      { name: 'South America', requests: 5000, latency: 95 },
    ],
    lastUpdated: new Date().toISOString(),
  };
};

const dashboardHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BlackRoad API Analytics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #000;
      color: #fff;
      min-height: 100vh;
    }
    .header {
      background: linear-gradient(135deg, #111 0%, #000 100%);
      border-bottom: 1px solid #333;
      padding: 21px 34px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 21px;
      font-weight: bold;
      background: linear-gradient(135deg, #F5A623 0%, #FF1D6C 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .live-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #10B981;
      font-size: 13px;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .container { max-width: 1400px; margin: 0 auto; padding: 34px; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 21px;
      margin-bottom: 34px;
    }
    .summary-card {
      background: linear-gradient(135deg, #111 0%, #0a0a0a 100%);
      border: 1px solid #333;
      border-radius: 13px;
      padding: 21px;
      text-align: center;
    }
    .summary-value {
      font-size: 34px;
      font-weight: bold;
      background: linear-gradient(135deg, #FF1D6C 0%, #F5A623 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .summary-label {
      color: #888;
      font-size: 13px;
      margin-top: 8px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 21px;
      margin-bottom: 34px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 21px;
    }
    .card {
      background: #111;
      border: 1px solid #333;
      border-radius: 13px;
      padding: 21px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 21px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-title span { color: #FF1D6C; }
    .chart-container {
      height: 200px;
      display: flex;
      align-items: flex-end;
      gap: 4px;
      padding-top: 21px;
    }
    .chart-bar {
      flex: 1;
      background: linear-gradient(180deg, #FF1D6C 0%, #9C27B0 100%);
      border-radius: 4px 4px 0 0;
      min-height: 4px;
      position: relative;
    }
    .chart-bar:hover {
      background: linear-gradient(180deg, #F5A623 0%, #FF1D6C 100%);
    }
    .chart-bar:hover::after {
      content: attr(data-value);
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      white-space: nowrap;
    }
    .service-row {
      display: flex;
      align-items: center;
      padding: 13px 0;
      border-bottom: 1px solid #222;
    }
    .service-row:last-child { border-bottom: none; }
    .service-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 13px;
    }
    .service-status.healthy { background: #10B981; }
    .service-status.degraded { background: #F5A623; }
    .service-name { flex: 1; font-weight: 500; }
    .service-metric {
      text-align: right;
      min-width: 80px;
    }
    .service-metric-value { font-weight: 600; }
    .service-metric-label { font-size: 11px; color: #666; }
    .endpoint-row {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #222;
      font-size: 13px;
    }
    .endpoint-row:last-child { border-bottom: none; }
    .endpoint-method {
      background: #2979FF;
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      margin-right: 8px;
    }
    .endpoint-method.POST { background: #10B981; }
    .endpoint-path { flex: 1; color: #ccc; font-family: monospace; }
    .endpoint-requests { color: #888; }
    .error-row {
      display: flex;
      align-items: center;
      padding: 8px 0;
      gap: 13px;
    }
    .error-code {
      font-family: monospace;
      font-weight: 600;
      color: #FF1D6C;
    }
    .error-bar {
      flex: 1;
      height: 8px;
      background: #222;
      border-radius: 4px;
      overflow: hidden;
    }
    .error-fill {
      height: 100%;
      background: linear-gradient(90deg, #FF1D6C 0%, #9C27B0 100%);
      border-radius: 4px;
    }
    .region-row {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #222;
    }
    .region-row:last-child { border-bottom: none; }
    .region-name { flex: 1; }
    .region-stat {
      text-align: right;
      min-width: 60px;
      color: #888;
      font-size: 13px;
    }
    .footer {
      border-top: 1px solid #333;
      padding: 21px 34px;
      text-align: center;
      color: #666;
      font-size: 13px;
    }
    .footer a { color: #FF1D6C; text-decoration: none; }
    @media (max-width: 1024px) {
      .summary-grid { grid-template-columns: repeat(3, 1fr); }
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .summary-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="logo">BlackRoad Analytics</div>
    <div class="live-badge">
      <div class="live-dot"></div>
      Live
    </div>
  </header>

  <div class="container">
    <div class="summary-grid" id="summary"></div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title"><span>//</span> Requests (24h)</div>
        <div class="chart-container" id="requests-chart"></div>
      </div>
      <div class="card">
        <div class="card-title"><span>//</span> Services</div>
        <div id="services-list"></div>
      </div>
    </div>

    <div class="grid-3">
      <div class="card">
        <div class="card-title"><span>//</span> Top Endpoints</div>
        <div id="endpoints-list"></div>
      </div>
      <div class="card">
        <div class="card-title"><span>//</span> Error Breakdown</div>
        <div id="errors-list"></div>
      </div>
      <div class="card">
        <div class="card-title"><span>//</span> Regions</div>
        <div id="regions-list"></div>
      </div>
    </div>
  </div>

  <footer class="footer">
    <p>Powered by <a href="https://blackroad.io">BlackRoad OS</a> &bull; <a href="https://blackroad-status.amundsonalexa.workers.dev">Status</a> &bull; <a href="https://blackroad-dev-portal.amundsonalexa.workers.dev">Developer Portal</a></p>
  </footer>

  <script>
    async function loadMetrics() {
      const resp = await fetch('/api/metrics');
      const data = await resp.json();

      // Summary cards
      document.getElementById('summary').innerHTML = \`
        <div class="summary-card">
          <div class="summary-value">\${(data.summary.totalRequests / 1000000).toFixed(2)}M</div>
          <div class="summary-label">Total Requests</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">\${(data.summary.requestsToday / 1000).toFixed(1)}K</div>
          <div class="summary-label">Today</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">\${data.summary.avgLatency}ms</div>
          <div class="summary-label">Avg Latency</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">\${data.summary.errorRate}%</div>
          <div class="summary-label">Error Rate</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">\${data.summary.uptime}%</div>
          <div class="summary-label">Uptime</div>
        </div>
      \`;

      // Chart
      const maxReq = Math.max(...data.timeseries.map(t => t.requests));
      document.getElementById('requests-chart').innerHTML = data.timeseries.map(t =>
        \`<div class="chart-bar" style="height: \${(t.requests / maxReq) * 100}%" data-value="\${t.requests} req"></div>\`
      ).join('');

      // Services
      document.getElementById('services-list').innerHTML = data.services.map(s => \`
        <div class="service-row">
          <div class="service-status \${s.status}"></div>
          <div class="service-name">\${s.name}</div>
          <div class="service-metric">
            <div class="service-metric-value">\${(s.requests / 1000).toFixed(1)}K</div>
            <div class="service-metric-label">requests</div>
          </div>
          <div class="service-metric">
            <div class="service-metric-value">\${s.latency}ms</div>
            <div class="service-metric-label">latency</div>
          </div>
        </div>
      \`).join('');

      // Endpoints
      document.getElementById('endpoints-list').innerHTML = data.topEndpoints.map(e => \`
        <div class="endpoint-row">
          <span class="endpoint-method \${e.method}">\${e.method}</span>
          <span class="endpoint-path">\${e.path}</span>
          <span class="endpoint-requests">\${(e.requests / 1000).toFixed(1)}K</span>
        </div>
      \`).join('');

      // Errors
      document.getElementById('errors-list').innerHTML = data.errorBreakdown.map(e => \`
        <div class="error-row">
          <span class="error-code">\${e.code}</span>
          <div class="error-bar">
            <div class="error-fill" style="width: \${e.percentage}%"></div>
          </div>
          <span style="color: #888; font-size: 12px;">\${e.count}</span>
        </div>
      \`).join('');

      // Regions
      document.getElementById('regions-list').innerHTML = data.regions.map(r => \`
        <div class="region-row">
          <span class="region-name">\${r.name}</span>
          <span class="region-stat">\${(r.requests / 1000).toFixed(0)}K</span>
          <span class="region-stat">\${r.latency}ms</span>
        </div>
      \`).join('');
    }

    loadMetrics();
    setInterval(loadMetrics, 30000); // Refresh every 30s
  </script>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API endpoints
    if (url.pathname === '/api/metrics') {
      return Response.json(generateMetrics());
    }

    if (url.pathname === '/api/health') {
      return Response.json({ status: 'healthy', version: '1.0.0' });
    }

    // Dashboard
    return new Response(dashboardHTML, {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};
