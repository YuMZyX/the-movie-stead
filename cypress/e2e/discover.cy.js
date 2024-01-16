describe('Discover movies', function() {

  describe('Site user', function() {
    beforeEach(function() {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      cy.visit('')
    })

    it('can access discover section from NavBar', function() {
      cy.get('#movies').trigger('mouseover')
      cy.get('#discover').click()
      cy.contains('Discover movies')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').should('have.length', 20)
    })

    it('can access discover section from advanced search link', function() {
      cy.contains('Advanced search >').click()
      cy.contains('Discover movies')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').should('have.length', 20)
    })

    it('can click a movie to see detailed info', function() {
      cy.get('.MuiGrid-container').find('.MuiGrid-item').first().click()
      cy.contains('Overview')
      cy.contains('Stars')
      cy.get('.MuiGrid-container').find('.MuiGrid-item').should('have.length', 2)
      cy.get('.MuiGrid-container').find('[alt="IMDb logo"]').should('exist')
      cy.get('.MuiGrid-container').find('[aria-label="Add to Watchlist"]').should('not.exist')
      cy.get('.MuiGrid-container').find('[aria-label="Create a review"]').should('not.exist')
    })

  })

})