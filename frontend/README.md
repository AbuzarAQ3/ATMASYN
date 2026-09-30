# ATMASYN

## Adaptive Atmospheric Forecast Synthesis

ATMASYN is a frontend-only prototype for a hybrid AI–NWP framework that performs context-aware multi-model forecast blending.

It demonstrates:

- Region, season, weather-regime, variable, and lead-time selection
- Deterministic adaptive model weights
- Forecast comparison with uncertainty spread
- React Leaflet regional map
- Recharts model and verification views
- Extreme-weather guidance
- Workflow stages, source registry, and validation caveats

This repository copy intentionally uses deterministic demo data. It does not claim live NWP connectivity, operational accuracy, or validated forecast improvement.

## Run locally

Requires Node.js 20+ and npm or pnpm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify and build

```bash
npm run typecheck
npm run build
npm run serve
```

The production-ready static files are generated in `dist/`.

## Deploy

ATMASYN is a static Vite site. Deploy the `dist/` directory to GitHub Pages, Netlify, Vercel, or any static hosting provider.

For a repository hosted at a GitHub Pages subpath, build with:

```bash
VITE_BASE_PATH=/your-repository-name/ npm run build
```

The included `.github/workflows/deploy.yml` automates this build and deployment when you push to the `main` branch. In the repository settings, set **Pages → Source** to **GitHub Actions**.

Configure the host to fall back to `index.html` for the client-side routes:

```text
/                  → index.html
/forecast          → index.html
/weights           → index.html
/verification      → index.html
/alerts            → index.html
/workflow          → index.html
/sources           → index.html
```

## Project layout

```text
ATMASYN-Frontend/
├── public/        # favicon and static files
├── src/
│   ├── components/  # app shell, controls, map, charts, UI primitives
│   ├── data/        # deterministic model and regional demo data
│   ├── lib/         # blending engine and scenario context
│   └── pages/       # dashboard routes
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Future integration boundary

The frontend currently calculates demo results locally. A future backend can replace the deterministic data layer with endpoints such as:

```text
GET /api/forecast/:region
GET /api/weights/:region
GET /api/verification/:region
GET /api/alerts/:region
```

Live GRIB/NetCDF ingestion, observation alignment, hindcast scoring, calibration, and official IMD validation remain future work.