describe('Bug Tracker E2E Tests', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/')
  })

  it('should load the home page', () => {
    cy.contains('Bug Tracker').should('be.visible')
  })

  it('should navigate to new bug page', () => {
    cy.contains('Report Bug').click()
    cy.url().should('include', '/new-bug')
    cy.contains('Report New Bug').should('be.visible')
  })

  it('should create a new bug', () => {
    cy.contains('Report Bug').click()

    // Fill out the form
    cy.get('input[placeholder="Enter bug title"]').type('Test Bug from Cypress')
    cy.get('textarea[placeholder="Enter bug description"]').type('This is a test bug created by Cypress E2E test')
    cy.get('select').first().select('high') // priority
    cy.get('select').eq(1).select('open') // status
    cy.get('input[placeholder="Enter category"]').type('e2e-testing')

    // Submit the form
    cy.get('button[type="submit"]').click()

    // Should redirect to bug list or show success
    cy.url().should('include', '/bug-list')
  })

  it('should display bug list', () => {
    cy.contains('View Bugs').click()
    cy.url().should('include', '/bug-list')

    // Check if bug list is displayed
    cy.get('body').then($body => {
      if ($body.text().includes('No bugs reported yet')) {
        cy.contains('No bugs reported yet').should('be.visible')
      } else {
        // If bugs exist, check they are displayed
        cy.get('.bg-white.shadow-md').should('have.length.greaterThan', 0)
      }
    })
  })

  it('should handle form validation', () => {
    cy.contains('Report Bug').click()

    // Try to submit empty form
    cy.get('button[type="submit"]').click()

    // Should show validation error or prevent submission
    cy.url().should('include', '/new-bug') // Should stay on same page
  })

  it('should navigate between pages', () => {
    // Test navigation links
    cy.contains('Home').click()
    cy.url().should('not.include', '/new-bug')

    cy.contains('Report Bug').click()
    cy.url().should('include', '/new-bug')

    cy.contains('View Bugs').click()
    cy.url().should('include', '/bug-list')
  })
})