#!/usr/bin/env bash
# reset-demo.sh
# Reseteja la demo axe DevTools a l'estat inicial (amb issues d'accessibilitat intencionals)

set -euo pipefail

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       Axe DevTools Demo — Reset a estat inicial      ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# ── 1. Atura el servidor de demo si està corrent ────────────────────────────
echo -e "${YELLOW}[1/5] Aturant servidor (port 3033)...${NC}"
if lsof -ti:3033 > /dev/null 2>&1; then
  lsof -ti:3033 | xargs kill -9 2>/dev/null
  echo -e "      Servidor aturat."
else
  echo -e "      Cap servidor corrent al port 3033."
fi

# ── 2. Restaura fitxers font als issues intencionals ────────────────────────
echo ""
echo -e "${YELLOW}[2/5] Restaurant fitxers font (issues d'accessibilitat)...${NC}"

FILES_TO_RESTORE=(
  "src/components/Blog.js"
  "src/components/RecipeCard.js"
  "src/components/Settings.js"
  "src/components/Dashboard.js"
  "src/containers/App.js"
)

for f in "${FILES_TO_RESTORE[@]}"; do
  if git diff --quiet HEAD -- "$f" 2>/dev/null; then
    echo -e "      ${f} — sense canvis"
  else
    git restore "$f"
    echo -e "      ${GREEN}Restaurat:${NC} ${f}"
  fi
done

# ── 3. Neteja resultats de tests ────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/5] Netejant resultats de tests i reports...${NC}"

# Cypress results
if ls results/*.json 2>/dev/null | head -1 > /dev/null 2>&1; then
  rm -f results/*.json
  echo -e "      Eliminats: results/*.json"
fi
if ls results/*.html 2>/dev/null | head -1 > /dev/null 2>&1; then
  rm -f results/*.html
  echo -e "      Eliminats: results/*.html"
fi

# Playwright report
if [ -d "playwright-report" ]; then
  rm -rf playwright-report/
  echo -e "      Eliminat: playwright-report/"
fi

# Playwright test-results
if [ -d "test-results" ]; then
  rm -rf test-results/
  echo -e "      Eliminat: test-results/"
fi

# Cypress screenshots/videos
if [ -d "cypress/screenshots" ]; then
  rm -rf cypress/screenshots/
  echo -e "      Eliminat: cypress/screenshots/"
fi
if [ -d "cypress/videos" ]; then
  rm -rf cypress/videos/
  echo -e "      Eliminat: cypress/videos/"
fi

# ── 4. Reconstrueix l'aplicació ─────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[4/5] Reconstruint l'aplicació...${NC}"
npm run build

# ── 5. Verificació ───────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[5/5] Verificant issues d'accessibilitat al codi...${NC}"
echo ""

check_issue() {
  local file="$1"
  local pattern="$2"
  local description="$3"
  if grep -q "$pattern" "$file" 2>/dev/null; then
    echo -e "      ${GREEN}✓${NC} ${description}"
  else
    echo -e "      ${RED}✗${NC} ${description} — NO trobat (potser s'ha modificat)"
  fi
}

check_issue "src/components/Blog.js"       'img src={blogHero}'         "Blog.js: <img> hero sense alt"
check_issue "src/components/Blog.js"       'img src={arrowRight}'       "Blog.js: <img> fletxa sense alt"
check_issue "src/components/Blog.js"       'aria-label=""'              "Blog.js: aria-label buit al botó"
check_issue "src/components/RecipeCard.js" 'Recipe__image"'             "RecipeCard.js: <img> recepta sense alt"
check_issue "src/components/RecipeCard.js" 'role="alert"'               "RecipeCard.js: role=alert inapropiat"
check_issue "src/components/RecipeCard.js" 'Button--primary'            "RecipeCard.js: <div> com a botó"

echo ""
echo -e "${CYAN}══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Demo resetejada correctament!${NC}"
echo ""
echo -e "  Per iniciar la demo:"
echo -e "  ${CYAN}npm run start-server${NC}   → http://localhost:3033"
echo ""
echo -e "  Consulta la guia pas a pas:"
echo -e "  ${CYAN}DEMO-GUIDE.md${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════════${NC}"
echo ""
