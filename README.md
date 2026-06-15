# Hooked on Poetry

A minimal poetry reader built with React and TypeScript. Fetches poems from the [PoetryDB](https://poetrydb.org) public API.

**Live site:** https://tzohpilotl.github.io/hooked-on-poetry/

## Features

- **Random poem** — loads a random poem on startup, refresh on demand
- **Browse by author** — pick a letter from the A–Z grid to load matching authors, then select one from the dropdown and read one of their poems
- Letters with no authors shake and are marked exhausted so you don't click them twice

## Stack

- React 19 + TypeScript
- Vite 8 with the React Compiler enabled
- Plain CSS (no framework)
- Playwright for end-to-end tests

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run lint` | Run ESLint |
| `npm test` | Run Playwright end-to-end tests |

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via the workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml). No secrets or manual steps required.

To enable it on a new fork: go to **Settings → Pages** and set the source to **GitHub Actions**.
