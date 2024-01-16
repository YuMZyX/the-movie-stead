describe('Movie/Movies', function() {

  describe('In the movies list, visitor', function() {
    beforeEach(function() {
      cy.visit('')
    })

    it('can see 20 movies', function() {
      cy.contains('Trending movies')
      cy.get('.MuiGrid-container').find('.MuiGrid-item').should('have.length', 20)
    })

    it('can access 20 pages of movies', function() {
      cy.get('.MuiPagination-root').find('[aria-label="Go to page 5"]').click()
      cy.url().should('include', '/trending/5')
      cy.get('.MuiPagination-root').find('[aria-label="Go to page 20"]').click()
      cy.url().should('include', '/trending/20')
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

    it('can search for a specific movie and see details', function() {
      cy.get('#search').type('Die Hard')
      cy.get('#release-year').type('1988')
      cy.get('#search-button').click()
      cy.contains('Die Hard')
      cy.get('html').should('not.contain', 'Die Hard 2')
      cy.get('html').should('not.contain', 'Live Free or Die Hard')
      cy.contains('Die Hard').click()
      cy.contains('John McTiernan')
      cy.contains('Bruce Willis')
      cy.contains('15.07.1988')
      cy.contains('The odds are against John McClane...')
    })

    it('can search without release year for multiple movies', function() {
      cy.get('#search').type('Die Hard')
      cy.get('#search-button').click()
      cy.contains('Die Hard')
      cy.contains('Die Hard 2')
      cy.contains('Live Free or Die Hard')
    })

    it('cannot search without specifying search query', function() {
      cy.get('#release-year').type('1988')
      cy.get('#search-button').click()
      cy.contains('Trending movies')
      cy.get('.MuiBox-root').find('.MuiOutlinedInput-notchedOutline')
        .should('have.css', 'border-color', 'rgb(211, 47, 47)')
    })

    it('cannot see movies watchlist and review menuitems', function() {
      cy.get('.MuiGrid-container').find('.MuiIconButton-root').first().click()
      cy.get('html').should('not.contain', 'Add to Watchlist')
      cy.get('html').should('not.contain', 'Create a review')
      cy.contains('Log in to review or favorite movies.')
    })
  })

  describe('In the movies list, user', function() {
    beforeEach(function() {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      cy.task('db:seedUsers')
      cy.login({ email: 'regular@gmail.com', password: 'password' })
    })

    it('can click a movie to see detailed info with iconbuttons', function() {
      cy.get('.MuiGrid-container').find('.MuiGrid-item').first().click()
      cy.contains('Overview')
      cy.contains('Stars')
      cy.get('.MuiGrid-container').find('.MuiGrid-item').should('have.length', 2)
      cy.get('.MuiGrid-container').find('[alt="IMDb logo"]').should('exist')
      cy.get('.MuiGrid-container').find('[aria-label="Add to Watchlist"]').should('exist')
      cy.get('.MuiGrid-container').find('[aria-label="Create a review"]').should('exist')
    })

    it('can see movies watchlist and review menuitems', function() {
      cy.get('.MuiGrid-container').find('.MuiIconButton-root').first().click()
      cy.get('html').should('contain', 'Add to Watchlist')
      cy.get('html').should('contain', 'Create a review')
      cy.get('html').should('not.contain', 'Log in to review or favorite movies.')
    })

  })

})