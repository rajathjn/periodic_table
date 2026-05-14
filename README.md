# 🧪 The Periodic Table of Elements

An interactive, Windows 98-themed periodic table web app built with **React**, **TypeScript**, and **Vite**. Explore all 118 elements with detailed property cards, 3D Bohr atom models, spectral images, and more.

🔗 **Live Demo:** [periodictable.rajathjaiprakash.com](https://periodictable.rajathjaiprakash.com)

---

## ✨ Features

- **Interactive Periodic Table** — Click any element to view its full detail page
- **Category Filtering** — Click legend swatches to highlight element groups (alkali metals, noble gases, etc.)
- **3D Bohr Models** — Interactive Three.js atom visualizations with orbital animations and auto-rotation
- **Comprehensive Data** — Atomic mass, density, melting/boiling points, electron configuration, oxidation states, and more
- **Image Gallery** — Sample photographs, spectral emission images, and 2D Bohr diagrams for each element
- **Discover Feature** — A randomized "Discover an Element" card on the home page
- **Retro Aesthetic** — Full Windows 98 UI theme with beveled borders, system fonts, and flat colors
- **Responsive Design** — Works on desktop, tablet, and mobile screens
- **GitHub Pages Deployment** — Automated CI/CD via GitHub Actions

---

## 🛠️ Tech Stack

| Layer         | Technology                                                                                                                       |
|---------------|----------------------------------------------------------------------------------------------------------------------------------|
| Framework     | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)                                                   |
| Build Tool    | [Vite 8](https://vite.dev/)                                                                                                      |
| 3D Rendering  | [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei) |
| Routing       | [React Router v7](https://reactrouter.com/)                                                                                      |
| Styling       | Vanilla CSS with CSS custom properties (Windows 98 theme)                                                                        |
| Fonts         | [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans), [VT323](https://fonts.google.com/specimen/VT323), VCR OSD Mono |
| Hosting       | [GitHub Pages](https://pages.github.com/)                                                                                        |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v18 or later** (for native `fetch` support in scripts)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/rajathjn/periodic_table.git
cd periodic_table
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

This starts a local Vite dev server at `http://localhost:5173` with Hot Module Replacement (HMR). Changes to source files are reflected instantly in the browser.

### 4. Build for Production

```bash
npm run build
```

Outputs optimized static files to the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

Starts a local server to preview the production build.

---

## 📊 Data Pipeline

The element data is **pre-generated** and committed to the repo. You only need to run these scripts if you want to refresh the data from upstream sources.

### Step 1: Generate Base Data

```bash
node scripts/generate-data.cjs
```

Fetches the [Bowserinator Periodic Table JSON](https://github.com/Bowserinator/Periodic-Table-JSON) and transforms it into `src/data/elements.json` with normalized categories, group names, and oxidation states.

### Step 2: Download Assets

```bash
node scripts/download-all-assets.cjs
```

Downloads 3D GLB models, 2D Bohr images, spectral images, and sample photographs for all 118 elements into `public/assets/elements/`. Updates `elements.json` with `local_*` paths.

If some downloads fail due to rate limiting, retry with longer delays:

```bash
node scripts/download-all-assets.cjs --retry
```

### Step 3: Enrich Summaries (Optional)

```bash
node scripts/enrich-summaries.cjs
```

Fetches extended descriptions from Simple English Wikipedia and stores them as `summary_extended` in `elements.json`.

---

## 🚢 Deployment

The project deploys automatically to GitHub Pages via the [GitHub Actions workflow](.github/workflows/node.js.yml):

1. Push to `main` branch triggers the workflow
2. `npm install` → `npm run build` produces the `dist/` folder
3. The `dist/` folder is deployed to the `gh-pages` branch
4. GitHub Pages serves the site from `gh-pages`

To deploy manually:

```bash
npm run build
npm run deploy
```

---

## 📜 License & Credits

- **Element Data:** [Bowserinator](https://github.com/Bowserinator/Periodic-Table-JSON), [PubChem](https://pubchem.ncbi.nlm.nih.gov/periodic-table/), [NIST](https://www.nist.gov/pml/periodic-table-elements) (Public Domain)
- **Element Images:** [Wikimedia Commons](https://commons.wikimedia.org/), [images-of-elements.com](https://images-of-elements.com/) (CC BY 3.0/SA)
- **Descriptions:** Wikipedia / Simple Wikipedia (CC BY-SA 3.0)
- **Bohr Models:** Google Arts & Experiments Periodic Table
- **Fonts:** Pixelify Sans (SIL OFL), VT323 (SIL OFL), VCR OSD Mono (free)

Original content is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

See the [License page](https://periodictable.rajathjaiprakash.com/#/license) for full attribution details.
