describe('Stars', function() {

  describe('In the stars list, site user', function() {
    beforeEach(function() {
      cy.visit('http://localhost:5173/#/stars/trending/1')
    })

    it('can see 20 persons', function() {
      cy.contains('Trending stars')
      cy.get('.MuiGrid-container').find('.MuiGrid-item').should('have.length', 20)
    })

    it('can access 20 pages of stars', function() {
      cy.get('.MuiPagination-root').find('[aria-label="Go to page 5"]').click()
      cy.url().should('include', '/stars/trending/5')
      cy.get('.MuiPagination-root').find('[aria-label="Go to page 20"]').click()
      cy.url().should('include', '/stars/trending/20')
    })

    it('can click a star to see detailed info', function() {
      cy.get('.MuiGrid-container').find('.MuiGrid-item').first().click()
      cy.contains('Priority')
      cy.contains('Known for')
      cy.get('.MuiGrid-container').find('[alt="IMDb logo"]').should('exist')
    })

    it('can search for a specific person and see details', function() {
      cy.get('#star-search').type('Jasper Pääkkönen')
      cy.contains('1 Stars matched your search')
      cy.get('.MuiGrid-container').find('.MuiGrid-item').should('have.length', 1)
      cy.contains('Jasper Pääkkönen').click()
      cy.contains('15.07.1980')
      cy.contains('Helsinki, Finland')
      cy.contains('BlacKkKlansman')
      cy.contains('Felix Kendrickson')
    })

    it('can search for multiple persons', function() {
      cy.get('#star-search').type('Leonardo Di')
      cy.contains('Stars matched your search')
      cy.contains('Leonardo DiCaprio')
      cy.contains('Leonardo Di Costanzo')
    })
  })

})