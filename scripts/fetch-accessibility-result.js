#!/usr/bin/env node
/*
Fetch accessibility result JSON from Axe DevTools API for a given commit SHA.

Environment variables required:
- SERVER_URL (e.g. https://axe.deque.com)
- API_KEY
- COMMIT_SHA

Saves output to `results/accessibility-<COMMIT_SHA>.json`.
*/

const fs = require('fs')

const { SERVER_URL, API_KEY, COMMIT_SHA } = process.env

function die(msg) {
  console.error(msg)
  process.exit(1)
}

if (!SERVER_URL) die('SERVER_URL env var is required')
if (!API_KEY) die('API_KEY env var is required')
if (!COMMIT_SHA) die('COMMIT_SHA env var is required')

const url = `${SERVER_URL.replace(/\/+$/, '')}/api-pub/v1/axe-watcher/gh/${COMMIT_SHA}`

console.log(`Fetching accessibility results for commit ${COMMIT_SHA} from ${url}`)

(async () => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      die(`Request failed: ${res.status} ${res.statusText}`)
    }

    const json = await res.json()
    const outDir = 'results'
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
    const outPath = `${outDir}/accessibility-${COMMIT_SHA}.json`
    fs.writeFileSync(outPath, JSON.stringify(json, null, 2))
    console.log(`Saved results to ${outPath}`)
  } catch (err) {
    die(err.message || String(err))
  }
})()
