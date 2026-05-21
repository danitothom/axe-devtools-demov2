const resultsDir = './results/'

describe('Accessibility Demo', () => {
  afterEach(() => {
    cy.getAxeResults().then((results) => {
      cy.task('log', `axe found ${results.findings.violations.length} violations`)

      cy.writeFile(
        `${resultsDir}results-accessibilitydemo-${new Date().valueOf()}.json`,
        results
      )
    })
  })

  after(() => {
    cy.task('reportAsHTML', { resultsDir })
  })

  it('home page should have no obvious accessibility violations', () => {
    cy.visit('http://localhost:3033/')
    cy.get('main').should('exist')
    cy.axeAnalyze()
  })

  it('settings page form should be accessible', () => {
    cy.visit('http://localhost:3033/settings')
    cy.get('form').should('exist')
    cy.axeAnalyze()
  })

  it('recipe card demo passes axe check', () => {
    cy.visit('http://localhost:3033')
    cy.get('.Recipes__card').first().should('exist')
    cy.axeAnalyze()
  })
})
