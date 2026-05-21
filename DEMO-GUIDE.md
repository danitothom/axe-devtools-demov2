# Axe DevTools - Guia de Demo Pas a Pas

## Visió general

Aquesta demo mostra com detectar i corregir issues d'accessibilitat usant les eines de Deque:

| Eina | Quan s'usa | Qui ho detecta |
|------|-----------|----------------|
| **axe DevTools Pro** (extensió Chrome) | En temps real, navegant | QA / Dissenyadors |
| **axe-linter** (extensió VS Code) | En escriure codi | Developers |
| **Cypress + @axe-devtools** | Tests automàtics | CI/CD pipeline |
| **Playwright + @axe-core** | Tests automàtics | CI/CD pipeline |
| **GitHub Actions** | En cada PR | Equip sencer |

---

## Issues d'accessibilitat a la demo

Aquestes issues estan **intencionalment** al codi per al propòsit de la demo:

| # | Fitxer | Issue | Regla axe |
|---|--------|-------|-----------|
| 1 | `src/components/Blog.js:56` | `<img>` sense `alt` (hero) | `image-alt` |
| 2 | `src/components/Blog.js:61` | `<img>` sense `alt` (fletxa) | `image-alt` |
| 3 | `src/components/Blog.js:73` | `aria-label=""` buit | `button-name` |
| 4 | `src/components/RecipeCard.js:19` | `<img>` sense `alt` | `image-alt` |
| 5 | `src/components/RecipeCard.js:39` | `role="alert"` en contingut estàtic | `aria-live-region-text` |
| 6 | `src/components/RecipeCard.js:41` | `<div>` interactiu sense `role="button"` | `keyboard` |

---

## Prerequisits

Abans de la demo, verifica que tens:

- [ ] **Node 18+** instal·lat (`node --version`)
- [ ] **VS Code** amb l'extensió **axe Linter** instal·lada
- [ ] **Chrome** amb l'extensió **axe DevTools Pro** instal·lada i activada
- [ ] **Compte Deque DevTools Hub** configurat (per veure resultats centralitzats)
- [ ] **Dependències del projecte** instal·lades (`npm install`)
- [ ] **Aplicació built** (`npm run build`)

---

## PREPARACIÓ: Posar la demo en estat inicial

Executa el script de reset per assegurar que tens l'estat inicial amb els issues:

```bash
./scripts/reset-demo.sh
```

---

## MÒDUL 1: axe DevTools Pro — Extensió de navegador

**Objectiu:** Mostrar com qualsevol persona pot detectar issues d'accessibilitat navegant per l'app.

**Durada estimada:** 8-10 minuts

### Pas 1.1 — Iniciar l'aplicació

```bash
npm run start-server
```

Obre Chrome a **http://localhost:3033**

### Pas 1.2 — Analitzar el Dashboard

1. Obre el panel d'axe DevTools Pro (icona a la barra d'eines o F12 → tab "axe DevTools")
2. Fes clic a **"Analyze"**
3. **Mostra les issues detectades:**
   - `role="alert"` en contingut estàtic a les targetes de recepta
   - `<div>` interactiu sense suport de teclat (el botó "Cook Recipe")
4. Fes clic sobre cada issue per veure l'element destacat a la pàgina
5. Mostra el **"More info"** per veure la documentació de la regla

> **Punt de discussió:** L'extensió detecta els issues en temps real, sense haver d'escriure cap test.

### Pas 1.3 — Analitzar el Blog

1. Navega a **http://localhost:3033/blog**
2. Fes clic a **"Analyze"** de nou
3. **Mostra les issues detectades:**
   - Dues imatges sense text alternatiu (`image-alt`)
   - Botó amb `aria-label` buit (`button-name`)
4. Usa el mode **"Guided Tests"** per verificar navegació per teclat:
   - Prem `Tab` per navegar pels elements
   - Mostra que el botó "Request new blog post" NO és accessible per teclat (aria-label buit)

### Pas 1.4 — Test de contrast (Settings)

1. Navega a **http://localhost:3033/settings**
2. A axe DevTools, activa el **"Color Contrast Analyzer"**
3. Mostra com es pot verificar el contrast en mode clar i fosc

---

## MÒDUL 2: axe-linter — Extensió VS Code

**Objectiu:** Mostrar com els developers veuen les issues directament a l'editor mentre escriuen codi.

**Durada estimada:** 5-7 minuts

### Pas 2.1 — Obrir Blog.js

1. Obre VS Code amb el projecte (`code .` des del directori del projecte)
2. Obre [src/components/Blog.js](src/components/Blog.js)
3. **Mostra els subratllats vermells** a les línies:
   - Línia 56: `<img src={blogHero} />` → manquen `alt`
   - Línia 61: `<img src={arrowRight} />` → manquen `alt`
   - Línia 73: `<Button aria-label="">` → `aria-label` buit

4. Passa el ratolí sobre cada error per veure la descripció de la regla
5. Fes clic a l'error al panell "Problems" per navegar directament a la línia

### Pas 2.2 — Obrir RecipeCard.js

1. Obre [src/components/RecipeCard.js](src/components/RecipeCard.js)
2. **Mostra les issues:**
   - Línia 19: `<img src={recipe.image} .../>` → manquen `alt`
   - Línia 39: `role="alert"` → ús inapropiat
   - Línia 41: `<div onClick>` sense `role="button"` → no accessible per teclat

### Pas 2.3 — Configuració axe-linter.yml

1. Obre [axe-linter.yml](axe-linter.yml) arrel del projecte
2. Explica com es configuren les biblioteques de components (`@deque/cauldron-react`, `@mui/material`)
3. Mostra el mapatge de `CardMedia` → `img` per a una detecció precisa

> **Punt de discussió:** axe-linter entén les biblioteques de components i aplica les regles corresponents, no és un simple linter d'HTML.

---

## MÒDUL 3: Tests automàtics amb Cypress

**Objectiu:** Mostrar com els tests d'accessibilitat s'integren al flux de CI/CD.

**Durada estimada:** 8-10 minuts

### Pas 3.1 — Executar tests (mode headless)

Assegura't que el servidor és actiu i executa:

```bash
npm run cypress:devtools
```

Mostra la sortida al terminal: nombre de violations per especificació.

### Pas 3.2 — Mode interactiu (Cypress GUI)

```bash
npm run cypress:interactive
```

1. Selecciona una especificació, per exemple `Dashboard.js`
2. Mostra l'execució en temps real al navegador Cypress
3. A la pestanya "Accessibility", amplia els resultats d'axe
4. Fes clic sobre una violation per veure el selector de l'element afectat

### Pas 3.3 — Veure el report HTML

Obre al navegador:

```bash
open results/executive-report.html
```

**Mostra:**
- Resum de violations per pàgina/especificació
- Detall de cada violation amb impacte (critical, serious, moderate, minor)
- Element HTML afectat i selector CSS
- Recomanació de correcció

### Pas 3.4 — Revisar el codi dels tests

Obre [test/axe-devtools-apis/cypress/Dashboard.js](test/axe-devtools-apis/cypress/Dashboard.js):

```javascript
cy.axeAnalyze()           // analitza tota la pàgina
cy.getAxeResults()        // obté els resultats JSON
cy.task('reportAsHTML', { resultsDir })  // genera report HTML
```

Obre [test/axe-devtools-apis/cypress/Blog.js](test/axe-devtools-apis/cypress/Blog.js) per veure l'anàlisi del blog.

---

## MÒDUL 4: Tests automàtics amb Playwright

**Objectiu:** Mostrar l'alternativa amb Playwright per a projectes que ja l'utilitzen.

**Durada estimada:** 5-7 minuts

### Pas 4.1 — Executar tests Playwright

```bash
npm run e2e:playwright:devtools
```

### Pas 4.2 — Veure el report HTML de Playwright

```bash
npx playwright show-report
```

Mostra:
- Tests superats vs fallits
- Screenshot en cas de fallada
- Trace viewer per depurar

### Pas 4.3 — Revisar el codi dels tests

Obre [test/playwright/axe-devtools-apis/dashboard.spec.ts](test/playwright/axe-devtools-apis/dashboard.spec.ts):

```typescript
import { checkA11y } from '@axe-core/playwright'
await checkA11y(page)   // mateixa API, diferent framework
```

> **Punt de discussió:** La integració d'axe és similar tant per Cypress com per Playwright. L'equip pot escollir el framework que ja coneix.

---

## MÒDUL 5: Integració amb GitHub

**Objectiu:** Mostrar com les issues d'accessibilitat es bloquegen automàticament als PRs.

**Durada estimada:** 5-8 minuts

### Pas 5.1 — Mostrar el workflow d'axe-linter

Obre [.github/workflows/axe-linter.yml](.github/workflows/axe-linter.yml):

```yaml
- uses: dequelabs/axe-linter-action@v1
  with:
    api_key: ${{ secrets.AXE_LINTER_API_KEY }}
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

Explica que s'executa en cada PR a `main`.

### Pas 5.2 — Mostrar el workflow de Playwright

Obre [.github/workflows/playwright-tests.yml](.github/workflows/playwright-tests.yml):

- Tests en cada push
- Puja artefactes (reports) a GitHub Actions
- Notificació si fallen tests d'accessibilitat

### Pas 5.3 — Demostrar un PR en directe (opcional)

Si vols fer una demo en viu:

1. Crea una branca nova amb un issue:
```bash
git checkout -b demo/a11y-issue
```

2. Afegeix una imatge sense alt a Blog.js (simula un canvi nou):
```jsx
<img src={blogHero} />  {/* intencionalment sense alt */}
```

3. Fes commit i push:
```bash
git add src/components/Blog.js
git commit -m "demo: add intentional a11y issue for PR demo"
git push origin demo/a11y-issue
```

4. Crea un PR a GitHub i mostra com axe-linter comenta automàticament les issues al PR.

> **Punt de discussió:** Ningú pot mergejar codi amb issues d'accessibilitat sense que l'equip sigui conscient.

---

## MÒDUL 6: Corregir les issues en directe

**Objectiu:** Mostrar com es corregeix cada issue i verificar-ho immediatament.

**Durada estimada:** 10-12 minuts

### Fix 1 — Imatges sense text alternatiu (Blog.js)

**Obre** [src/components/Blog.js](src/components/Blog.js)

**Problema (línia 56):**
```jsx
<img src={blogHero} />
```

**Solució:**
```jsx
<img src={blogHero} alt="Plats de cuina variats en un restaurant" />
```

**Problema (línia 61):**
```jsx
<img src={arrowRight} />
```

**Solució** (imatge decorativa):
```jsx
<img src={arrowRight} alt="" aria-hidden="true" />
```

> **Regla:** Si la imatge transmet informació → `alt` descriptiu. Si és decorativa → `alt=""`.

---

### Fix 2 — aria-label buit (Blog.js)

**Problema (línia 73):**
```jsx
<Button className="RequestNew" variant="Link" aria-label="">
  <span aria-hidden="true">Request new blog post</span>
</Button>
```

**Solució:**
```jsx
<Button className="RequestNew" variant="Link">
  Request new blog post
</Button>
```

> **Regla:** No cal `aria-label` si el text del botó és descriptiu. Mai deixar `aria-label=""`.

---

### Fix 3 — Imatge de recepta sense alt (RecipeCard.js)

**Obre** [src/components/RecipeCard.js](src/components/RecipeCard.js)

**Problema (línia 19):**
```jsx
<img src={recipe.image} className="Recipe__image" />
```

**Solució:**
```jsx
<img src={recipe.image} className="Recipe__image" alt={`Fotografia de ${recipe.name}`} />
```

---

### Fix 4 — role="alert" inapropiat (RecipeCard.js)

**Problema (línia 39):**
```jsx
<div className="Recipes__card-foot" role="alert">
```

**Solució:**
```jsx
<div className="Recipes__card-foot">
```

> **Regla:** `role="alert"` és per a missatges que apareixen dinàmicament (errors, confirmacions). No s'usa per a contingut estàtic.

---

### Fix 5 — Div interactiu sense accessibilitat (RecipeCard.js)

**Problema (línies 41-52):**
```jsx
<div
  className="Button--primary"
  onClick={() => setCurrentViewModal(recipe.name)}
>
  Cook {recipe.name}
</div>
```

**Solució:**
```jsx
<button
  className="Button--primary"
  onClick={() => setCurrentViewModal(recipe.name)}
>
  Cook {recipe.name}
</button>
```

> **Regla:** Usa sempre `<button>` per a elements clicables. Els `<div>` no reben focus per teclat per defecte.

---

### Pas 6.1 — Verificar les correccions

Després de cada fix, rebuild i re-analitza:

```bash
npm run build
```

Torna a l'extensió axe DevTools Pro al navegador → **"Analyze"** → comprova que les issues han desaparegut.

Per verificar amb tests automàtics:

```bash
npm run cypress:devtools
open results/executive-report.html
```

---

## Resum de l'impacte

Mostra els dos reports (abans i després):

| Mètrica | Abans | Després |
|---------|-------|---------|
| Violations crítiques | 3 | 0 |
| Violations serioses | 2 | 0 |
| Issues totals | 6 | 0 |
| Pàgines afectades | 2 | 0 |

---

## Preguntes freqüents durant la demo

**Q: Quina diferència hi ha entre axe DevTools Pro i axe-core (open source)?**
> axe-core és el motor open source. axe DevTools Pro afegeix: guies de test manual, integració amb DevTools Hub, reports consolidats, suport tècnic i regles addicionals.

**Q: Cal llicència per usar-ho al CI/CD?**
> Els tests automàtics amb `@axe-core/playwright` i `@axe-devtools/cypress` requereixen llicència de Deque. axe-linter al VS Code té una versió gratuïta i una de Pro amb més regles.

**Q: Cobreix el 100% dels problemes d'accessibilitat?**
> Les eines automàtiques detecten al voltant del 30-40% dels problemes. La resta requereix test manual (navegació per teclat, lectors de pantalla). axe DevTools Pro inclou guies per fer el test manual de forma sistemàtica.

**Q: Funciona amb qualsevol framework?**
> Sí. axe-core és framework-agnòstic i funciona amb React, Angular, Vue, HTML estàtic, etc.

---

## Script de reset

Per tornar a l'estat inicial de la demo:

```bash
./scripts/reset-demo.sh
```

Això restaura tots els fitxers font als seus issues originals i neteja tots els reports.
