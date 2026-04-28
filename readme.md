# axe-devtools-demov2

## Cypress accessibility demos

This project includes Cypress demos and axe-based tests. The Cypress runner uses the `@axe-devtools/cypress` plugin and writes per-run JSON and HTML reports into the `results/` folder.

Prerequisites
- Node 18+ and project dependencies installed:

```bash
npm install
```

Build & serve the demo site (local):

```bash
npm run build
npm run start-server
```

Run the full Cypress accessibility suite (headed Chromium):

```bash
npm run cypress:devtools
```

Run a single spec (example):

```bash
npx cypress run --config-file=cypress.devtools.config.js --spec "test/axe-devtools-apis/cypress/KeyboardSpec.js"
```

Recommended quick workflows

1) Full local run (build → serve → cypress):

```bash
npm install
npm run build
npm run start-server &
npm run cypress:devtools
```

2) Use the convenience npm scripts for fetching and generating reports (requires `API_KEY`, `SERVER_URL`, `COMMIT_SHA` env vars for fetch):

```bash
# fetch JSON from Axe DevTools server for a commit
npm run a11y:fetch

# generate HTML reports from JSON files under results/
npm run a11y:report

# combine (fetch then generate)
npm run a11y:fetch-report
```

Playwright + report

```bash
# run Playwright accessibility tests (project=axe-devtools-apis) and generate HTML reports
npm run a11y:playwright
```

Playwright in CI (headless)
----------------------------

Playwright runs headless by default, which is appropriate for CI. Useful tips:

- Ensure browsers are installed in the CI image (run once):

```bash
npx playwright install --with-deps
```

- Run the tests (headless) in CI with the existing npm script:

```bash
npm run playwright:devtools
```

- If your CI runner needs extra OS packages (Debian/Ubuntu) use `npx playwright install-deps` or install the packages recommended by Playwright.
- To capture traces, videos or screenshots for debugging, enable them in `playwright.config.ts` or pass CLI flags; those artifacts can be collected as CI build artifacts.

Example: enable trace/video in CI via env vars

You can control tracing and video retention via environment variables that `playwright.config.ts` reads:

```bash
# collect full trace and retain videos on failure
export PW_TRACE=on
export PW_VIDEO=retain-on-failure
export PW_SCREENSHOT=only-on-failure

# run tests (headless by default in CI)
npm run playwright:devtools
```

The repository `playwright.config.ts` uses these vars and defaults to `trace=on-first-retry`, `video=retain-on-failure` and `screenshot=only-on-failure`.

Interactive Cypress

- To debug or run tests interactively, use Cypress GUI:

```bash
npm run cypress:interactive
```

Where results land
- Per-run raw JSON and generated HTML reports are written into the repository `results/` folder (e.g. `results/results-*.json` and `results/@axe-devtools-cypress-*.html`).
- The repository already contains a `results/` directory created from local runs — CI will collect the same files when configured.

Viewing reports
- After a run, open `results/executive-report.html` (or any `@axe-devtools-cypress-*.html`) in a browser to inspect the consolidated report.

CI integration
- A pipeline step (`Publish accessibility reports`) is configured in `bitbucket-pipelines.yml` to publish `results/**` as build artifacts so HTML reports are downloadable from CI.
- If you want CI to fail when no accessibility HTML reports are generated, the pipeline enforces that by default.

Making the report check optional
- To skip the pipeline failure when no HTML report exists, set the env var `REQUIRE_A11Y_REPORTS=false` in the pipeline environment or per-branch variables. Example for local/testing runs:

```bash
# skip the requirement
export REQUIRE_A11Y_REPORTS=false
# then run pipeline (CI) or local script that emulates pipeline behavior
```

Recommendations and next steps
- Add focused specs (contrast, forms, keyboard focus, modal focus trapping) — several examples are already under `test/axe-devtools-apis/cypress/`.
- Consider storing `results/` artifacts centrally (S3 / project artifact store) for historical trend analysis.

Ejemplo: usar la API pública de Axe DevTools
-----------------------------------------

El siguiente script de ejemplo (`scripts/fetch-accessibility-result.js`) muestra cómo obtener el JSON de resultados que Axe DevTools expone para un commit (el mismo endpoint que usa `bitbucket/dev-hub.sh`).

Requisitos de entorno:

- `SERVER_URL` (p.ej. `https://axe.deque.com`)
- `API_KEY`
- `COMMIT_SHA`

Ejemplo de uso:

```bash
# exporta las variables de entorno necesarias
export SERVER_URL=https://axe.deque.com
export API_KEY=xxxxxxxx
export COMMIT_SHA=abcdef123456

# ejecutar el script (Node 18+)
node scripts/fetch-accessibility-result.js

# resultado escrito en results/accessibility-<COMMIT_SHA>.json
```

Esto es útil para integrar la obtención de resultados en pipelines, generar reportes locales a partir del JSON, o automatizar comprobaciones adicionales.

Generar HTML desde JSON descargado
---------------------------------

Después de descargar el JSON con `scripts/fetch-accessibility-result.js`, puedes convertirlo a HTML con el generador incluido:

```bash
# generar HTML para todos los resultados en results/
node scripts/generate-html-report.js results

# o pasar un archivo JSON concreto (usa su contenedor)
node scripts/generate-html-report.js results/accessibility-abcdef123.json
```

El script usa `@axe-devtools/reporter` y escribirá los artefactos HTML en el mismo directorio `results/`.

CI: configuración por rama (ejemplo)
---------------------------------

Si quieres que las ramas de feature no fallen por ausencia de reportes, puedes declarar variables por rama en `bitbucket-pipelines.yml` o usar las variables del repositorio en la UI de Bitbucket.

Ejemplo (añadir bajo la raíz `pipelines:` en `bitbucket-pipelines.yml`):

```yaml
pipelines:
	branches:
		"feature/*":
			- step:
					name: Build (feature branches)
					script:
						- export REQUIRE_A11Y_REPORTS=false
						- npm ci
						- npm run build
						- npm run e2e:cypress:watcher
```

Alternativa recomendada: definir `REQUIRE_A11Y_REPORTS=false` como variable en el UI de Bitbucket para el scope de `feature/*`, de forma que no tengas que editar YAML y la política quede centralizada.

En Bitbucket UI: Repository settings → Pipelines → Repository variables → add `REQUIRE_A11Y_REPORTS=false` y configurar su scope (branch pattern) si tu plan lo permite.
