describe('Form accessibility', () => {
  it('validates forms on settings page', () => {
    cy.visit('http://localhost:3033/settings')
    cy.get('form').should('exist')
    // check common form issues
    cy.axeAnalyze({ runOnly: { type: 'rule', values: ['label', 'tabindex', 'aria-required'] } })
  })
})
