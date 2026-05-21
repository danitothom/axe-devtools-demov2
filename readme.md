# axe DevTools Demo

> A practical demonstration of [Deque's axe DevTools](https://www.deque.com/axe/devtools/) ecosystem — showing how to detect and fix accessibility issues across the full development lifecycle.

---

## What this demo covers

| Tool | Layer | Who uses it |
|------|-------|-------------|
| **axe DevTools Pro** (browser extension) | Runtime | QA, Designers |
| **axe Linter** (VS Code extension) | Code editor | Developers |
| **Cypress + @axe-devtools** | Automated tests | Developers, CI |
| **Playwright + @axe-core** | Automated tests | Developers, CI |
| **GitHub Actions** | CI/CD pipeline | Whole team |

The application is a React recipe dashboard with **intentional accessibility issues** that are detected, explained, and fixed live during the demo.

---

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **npm** (included with Node)
- **Chrome** with the [axe DevTools Pro extension](https://www.deque.com/axe/devtools/) (for browser demo)
- **VS Code** with the [axe Linter extension](https://marketplace.visualstudio.com/items?itemName=deque-systems.vscode-axe-linter) (for editor demo)

---

## Installation

```bash
# 1. Clone the repository
git clone git@github.com:danitothom/axe-devtools-demov2.git
cd axe-devtools-demov2

# 2. Install dependencies
npm install

# 3. Build the app
npm run build
```

> **Note:** Some packages are served from the Deque private registry (Agora). If you encounter registry errors, contact your Deque account manager for access credentials.

---

## Running the app

```bash
# Start the local server (port 3033)
npm run start-server
```

Open your browser at **http://localhost:3033**

The app has four main sections:

| Route | Page |
|-------|------|
| `/` | Recipe Dashboard |
| `/blog` | Food Blog |
| `/settings` | Settings (theme toggle) |
| `/request-blog` | Blog Request Form |

---

## Running the tests

### Cypress (interactive GUI)

```bash
npm run cypress:interactive
```

### Cypress (headless)

```bash
# Starts the server automatically, runs all specs, generates HTML report
npm run e2e:cypress:devtools
```

### Playwright

```bash
# Starts the server automatically, runs all specs
npm run e2e:playwright:devtools
```

### View accessibility reports

After a Cypress run, open the generated HTML report:

```bash
open results/executive-report.html
```

After a Playwright run:

```bash
npx playwright show-report
```

---

## Running a single Cypress spec

```bash
npx cypress run \
  --config-file=cypress.devtools.config.js \
  --spec "test/axe-devtools-apis/cypress/KeyboardSpec.js"
```

Available specs:

| Spec | What it tests |
|------|--------------|
| `Dashboard.js` | Navigation, page structure |
| `Blog.js` | Blog page accessibility |
| `FormSpec.js` | Form labels and validation |
| `KeyboardSpec.js` | Keyboard navigation, skip links |
| `ContrastSpec.js` | Colour contrast |

---

## Accessibility reports

Reports are written to the `results/` folder after each run.

```bash
# Generate HTML report from existing JSON results
npm run a11y:report

# Fetch results from axe DevTools Hub for a specific commit
export SERVER_URL=https://axe.deque.com
export API_KEY=your_api_key
export COMMIT_SHA=abc123
npm run a11y:fetch

# Fetch + generate in one step
npm run a11y:fetch-report
```

---

## CI/CD integration

### GitHub Actions

Two workflows run automatically:

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `playwright-tests.yml` | Every push | Runs Playwright accessibility tests, uploads reports as artifacts |
| `axe-linter.yml` | PRs to `main` | Static accessibility linting, comments issues directly on the PR |

### Axe Linter on pull requests

When a PR is opened against `main`, the `axe-linter-action` scans all changed JSX/TSX files and posts inline comments for any accessibility violations — blocking the merge until they are addressed.

To enable this in your fork, add `AXE_LINTER_API_KEY` to your repository secrets:  
**Settings → Secrets and variables → Actions → New repository secret**

---

## Demo guide

A full step-by-step guide for running the live demo (including which issues to show, how to fix them, and how to reset the demo state) is available in [`DEMO-GUIDE.md`](DEMO-GUIDE.md).

### Reset to initial demo state

To restore all intentional accessibility issues and clear test results before presenting:

```bash
./scripts/reset-demo.sh
```

---

## Project structure

```
axe-devtools-demov2/
├── src/
│   ├── components/         # React components (with intentional a11y issues)
│   │   ├── Blog.js         # Missing alt text, empty aria-label
│   │   ├── RecipeCard.js   # div as button, role="alert" misuse
│   │   └── ...
│   └── containers/
│       └── App.js          # Routing and app state
├── test/
│   ├── axe-devtools-apis/
│   │   └── cypress/        # Cypress specs using @axe-devtools/cypress
│   └── playwright/
│       └── axe-devtools-apis/  # Playwright specs using @axe-core/playwright
├── .github/
│   └── workflows/
│       ├── axe-linter.yml      # PR accessibility linting
│       └── playwright-tests.yml # Automated tests on push
├── scripts/
│   ├── reset-demo.sh           # Restore demo to initial broken state
│   ├── fetch-accessibility-result.js
│   └── generate-html-report.js
├── results/                # Generated accessibility reports (HTML + JSON)
├── axe-linter.yml          # axe Linter component library configuration
├── cypress.devtools.config.js
├── playwright.config.ts
└── DEMO-GUIDE.md           # Full demo walkthrough
```

---

## Intentional accessibility issues

These issues are **deliberately left in the code** for demo purposes:

| File | Issue | axe Rule |
|------|-------|----------|
| `src/components/Blog.js:56` | Hero `<img>` missing `alt` | `image-alt` |
| `src/components/Blog.js:61` | Arrow `<img>` missing `alt` | `image-alt` |
| `src/components/Blog.js:73` | Button with empty `aria-label=""` | `button-name` |
| `src/components/RecipeCard.js:19` | Recipe `<img>` missing `alt` | `image-alt` |
| `src/components/RecipeCard.js:39` | Static content with `role="alert"` | `aria-live-region-text` |
| `src/components/RecipeCard.js:41` | Interactive `<div>` without `role="button"` | `keyboard` |

Run `./scripts/reset-demo.sh` to restore these issues after fixing them during the demo.

---

## Tech stack

- **React 16** with React Router v6
- **Deque Cauldron** — accessible React component library
- **Webpack 5** — bundler and dev server
- **Cypress 13** + `@axe-devtools/cypress`
- **Playwright 1.55** + `@axe-core/playwright`
- **@axe-devtools/reporter** — HTML report generation
- **axe-core 4** — accessibility rules engine

---

## License

UNLICENSED — for demo and internal training purposes only.
