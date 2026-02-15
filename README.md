# BlackRoad API Analytics

Real-time analytics dashboard for all BlackRoad APIs.

## Live

- **Dashboard**: https://blackroad-analytics.amundsonalexa.workers.dev
- **Metrics API**: https://blackroad-analytics.amundsonalexa.workers.dev/api/metrics

## Features

- **Real-time Metrics** - Live request counts, latency, error rates
- **24-hour Charts** - Visual request trends
- **Service Health** - Per-service status and performance
- **Top Endpoints** - Most frequently called APIs
- **Error Breakdown** - Error codes by frequency
- **Regional Stats** - Performance by geography
- **Auto-refresh** - Updates every 30 seconds

## Metrics

| Metric | Description |
|--------|-------------|
| Total Requests | All-time request count |
| Today | Requests in last 24h |
| Avg Latency | Mean response time |
| Error Rate | Percentage of errors |
| Uptime | Service availability |

## API

### GET /api/metrics

Returns all analytics data:

```json
{
  "summary": {
    "totalRequests": 1248429,
    "requestsToday": 34650,
    "avgLatency": 51,
    "errorRate": "0.17",
    "uptime": 99.97
  },
  "services": [...],
  "timeseries": [...],
  "topEndpoints": [...],
  "errorBreakdown": [...],
  "regions": [...],
  "lastUpdated": "2026-02-15T05:00:00.000Z"
}
```

### GET /api/health

Health check endpoint.

## Development

```bash
npm install
npm run dev      # Local development
npm run deploy   # Deploy to Cloudflare
```

## License

Proprietary - BlackRoad OS, Inc.
