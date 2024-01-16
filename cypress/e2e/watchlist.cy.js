describe('Watchlist', function() {

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      cy.task('db:seedUsers')
      cy.login({ email: 'regular@gmail.com', password: 'password' })
    })

    it('user can add a movie to watchlist from movieslists menu', function() {
      cy.get('.MuiGrid-container').find('.MuiIconButton-root').first().click()
      cy.contains('Add to Watchlist').click()
      cy.wait(500)
      cy.get('#watchlist').click({ force: true })
      cy.contains('Your watchlist')
      cy.get('.MuiBox-root').find('.MuiFormControl-root').should('have.length', 2)
      cy.get('.MuiGrid-container').find('.MuiGrid-item').should('have.length', 1)
    })

    it('user can add a movie to watchlist from detailed movie view', function() {
      cy.get('.MuiGrid-container').find('.MuiGrid-item').first().click()
      cy.get('.MuiGrid-container').find('[aria-label="Add to Watchlist"]').click()
      cy.wait(500)
      cy.get('.MuiGrid-container').find('[aria-label="Add to Watchlist"]').should('not.exist')
      cy.get('.MuiGrid-container').find('[aria-label="Remove from Watchlist"]').should('exist')
      cy.get('#watchlist').click({ force: true })
      cy.contains('Your watchlist')
      cy.get('.MuiBox-root').find('.MuiFormControl-root').should('have.length', 2)
      cy.get('.MuiGrid-container').find('.MuiGrid-item').should('have.length', 1)
    })

    describe('and movie is added to watchlist', function() {
      beforeEach(function() {
        cy.get('.MuiGrid-container').find('.MuiIconButton-root').first().click()
        cy.contains('Add to Watchlist').click()
        cy.wait(500)
      })

      it('user can remove a movie from watchlist from movieslists menu', function() {
        cy.get('.MuiGrid-container').find('.MuiIconButton-root').first().click()
        cy.contains('Remove from Watchlist').click()
        cy.wait(500)
        cy.get('#watchlist').click({ force: true })
        cy.contains('Your watchlist is currently empty')
        cy.get('.MuiBox-root').find('.MuiFormControl-root').should('not.exist')
        cy.get('.MuiGrid-container').should('not.exist')
      })

      it('user can remove a movie from watchlist from detailed movie view', function() {
        cy.get('.MuiGrid-container').find('.MuiGrid-item').first().click()
        cy.get('.MuiGrid-container').find('[aria-label="Remove from Watchlist"]').click()
        cy.wait(500)
        cy.get('.MuiGrid-container').find('[aria-label="Add to Watchlist"]').should('exist')
        cy.get('.MuiGrid-container').find('[aria-label="Remove from Watchlist"]').should('not.exist')
        cy.get('#watchlist').click({ force: true })
        cy.contains('Your watchlist is currently empty')
        cy.get('.MuiBox-root').find('.MuiFormControl-root').should('not.exist')
        cy.get('.MuiGrid-container').should('not.exist')
      })

      it('user can access movie details from watchlist view', function() {
        cy.get('#watchlist').click({ force: true })
        cy.get('.MuiGrid-container').find('.MuiGrid-item').first().click()
        cy.contains('Overview')
        cy.contains('Stars')
        cy.get('.MuiGrid-container').find('.MuiGrid-item').should('have.length', 2)
        cy.get('.MuiGrid-container').find('[alt="IMDb logo"]').should('exist')
        cy.get('.MuiGrid-container').find('[aria-label="Remove from Watchlist"]').should('exist')
        cy.get('.MuiGrid-container').find('[aria-label="Add to Watchlist"]').should('not.exist')
        cy.get('.MuiGrid-container').find('[aria-label="Create a review"]').should('exist')
      })

    })

    describe('and movie is reviewed', function() {
      beforeEach(function() {
        cy.get('.MuiGrid-container').find('.MuiIconButton-root').first().click()
        cy.contains('Create a review').click()
        cy.get('input[value=5]').click({ force: true })
        cy.get('#create-review').click()
        cy.wait(500)
      })

      it('user can add or remove to watchlist from My Reviews view', function() {
        cy.get('#my-reviews').click({ force: true })
        cy.contains('Your reviews')
        cy.get('.MuiGrid-container').find('.MuiIconButton-root').first().click()
        cy.contains('Add to Watchlist').click()
        cy.wait(500)
        cy.get('#watchlist').click({ force: true })
        cy.contains('Your watchlist')
        cy.get('.MuiBox-root').find('.MuiFormControl-root').should('have.length', 2)
        cy.get('.MuiGrid-container').find('.MuiGrid-item').should('have.length', 1)
        cy.get('#my-reviews').click({ force: true })
        cy.contains('Your reviews')
        cy.get('.MuiGrid-container').find('.MuiIconButton-root').first().click()
        cy.contains('Remove from Watchlist').click()
        cy.wait(500)
        cy.get('#watchlist').click({ force: true })
        cy.contains('Your watchlist is currently empty')
        cy.get('.MuiBox-root').find('.MuiFormControl-root').should('not.exist')
        cy.get('.MuiGrid-container').should('not.exist')
      })

    })

  })

})