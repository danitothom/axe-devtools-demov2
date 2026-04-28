describe('Keyboard navigation', () => {
  it('ensures focusable controls and skip links', () => {
    cy.visit('http://localhost:3033/')
    // ensure there are focusable controls (links, buttons, inputs, or tabindex)
    cy.get('a,button,input,select,textarea,[tabindex]').its('length').should('be.gt', 0)
    cy.axeAnalyze({ runOnly: { type: 'rule', values: ['focus-order', 'skip-link'] } })
  })
})
