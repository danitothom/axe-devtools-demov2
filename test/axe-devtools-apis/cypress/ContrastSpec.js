describe('Contrast checks', () => {
  it('checks color contrast on homepage', () => {
    cy.visit('http://localhost:3033/')
    // target text elements for contrast
    cy.get('header, main, footer').then(() => {
      cy.axeAnalyze({ runOnly: { type: 'rule', values: ['color-contrast'] } })
    })
  })
})
