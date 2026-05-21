#!/usr/bin/env node
/*
Generate HTML accessibility reports from JSON results using @axe-devtools/reporter.

Usage:
  node scripts/generate-html-report.js [resultsPath]

If `resultsPath` is a file, its containing directory is used. Defaults to `results`.
*/

const fs = require('fs')
const path = require('path')

const Reporter = require('@axe-devtools/reporter').default

const arg = process.argv[2] || process.env.RESULTS_DIR || 'results'
let resultsDir = arg
if (fs.existsSync(arg) && fs.lstatSync(arg).isFile()) {
  resultsDir = path.dirname(arg)
}

if (!fs.existsSync(resultsDir)) {
  console.error(`Results directory not found: ${resultsDir}`)
  process.exit(1)
}

const branding = process.env.BRANDING || 'axeDevToolsCLI'

;(async () => {
  try {
    const reporter = new Reporter(branding, resultsDir)
    await reporter.buildHTML(resultsDir)
    console.log(`HTML reports generated in ${resultsDir}`)
  } catch (err) {
    console.error('Error generating HTML reports:', err && err.message ? err.message : err)
    process.exit(1)
  }
})()
