describe('Discover movies', function() {

  describe('Site user', function() {
    beforeEach(function() {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      cy.visit('')
    })

    it('can access discover section from NavBar', function() {
      cy.get('#movies').trigger('mouseover')
      cy.contains('Discover movies').click()
      cy.contains('Discover movies')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').should('have.length', 20)
    })

    it('can access discover section from advanced search link', function() {
      cy.contains('Advanced search >').click()
      cy.contains('Discover movies')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').should('have.length', 20)
    })

    it('can click a movie in discover section to see detailed info', function() {
      cy.contains('Advanced search >').click()
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').first().click()
      cy.contains('Overview')
      cy.contains('Stars')
      cy.get('.MuiGrid-container').find('.MuiGrid-item').should('have.length', 2)
      cy.get('.MuiGrid-container').find('[alt="IMDb logo"]').should('exist')
      cy.get('.MuiGrid-container').find('[aria-label="Add to Watchlist"]').should('not.exist')
      cy.get('.MuiGrid-container').find('[aria-label="Create a review"]').should('not.exist')
    })

    it('can see search results instead of discover movies after using filter', function() {
      cy.contains('Advanced search >').click()
      cy.contains('Discover movies')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').should('have.length', 20)
      cy.get('#runtime_min').type(200)
      cy.get('body').click({ force: true })
      cy.wait(500)
      cy.contains('Movies matched your search')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').should('have.length', 20)
    })

    it('can discover movies by specifying certain release day', function() {
      cy.contains('Advanced search >').click()
      cy.get('#release-date-min').type('07192023')
      cy.get('#release-date-max').type('07192023')
      cy.get('body').click({ force: true })
      cy.wait(500)
      cy.contains('Movies matched your search')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').first().click()
      cy.contains('19.07.2023')
      cy.go('back')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(1).click()
      cy.contains('19.07.2023')
      cy.go('back')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').last().click()
      cy.contains('19.07.2023')
    })

    it('can discover movies by specifying certain release timeframe', function() {
      cy.contains('Advanced search >').click()
      cy.get('#release-date-min').type('08012023')
      cy.get('#release-date-max').type('08312023')
      cy.get('body').click({ force: true })
      cy.wait(500)
      cy.contains('Movies matched your search')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').first().click()
      cy.contains('08.2023')
      cy.go('back')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(1).click()
      cy.contains('08.2023')
      cy.go('back')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').last().click()
      cy.contains('08.2023')
    })

    it('can discover movies by specifying genre', function() {
      cy.contains('Advanced search >').click()
      cy.get('#genres').click()
      cy.wait(200)
      cy.get('#Animation').click().focus().type('{esc}')
      cy.wait(500)
      cy.contains('Movies matched your search')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').first().click()
      cy.contains('Animation')
      cy.go('back')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(1).click()
      cy.contains('Animation')
      cy.go('back')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').last().click()
      cy.contains('Animation')
    })

    it('can discover movies by filtering page results with a string', function() {
      cy.contains('Advanced search >').click()
      cy.get('#release-date-min').type('07192023')
      cy.get('#release-date-max').type('07192023')
      cy.get('body').click({ force: true })
      cy.wait(700)
      cy.contains('Movies matched your search')
      cy.contains('Barbie')
      cy.contains('Oppenheimer')
      cy.contains('Cobweb')
      cy.get('#filter-results').type('o')
      cy.wait(300)
      cy.get('html').should('not.contain', 'Barbie')
      cy.contains('Oppenheimer')
      cy.contains('Cobweb')
      cy.get('#filter-results').clear()
      cy.get('#filter-results').type('b')
      cy.wait(300)
      cy.get('html').should('not.contain', 'Oppenheimer')
      cy.contains('Barbie')
      cy.contains('Cobweb')
    })

    it('can sort discovered movies alphabetically', function() {
      cy.contains('Advanced search >').click()
      cy.get('#release-date-min').type('07192023')
      cy.get('#release-date-max').type('07192023')
      cy.get('body').click({ force: true })
      cy.get('#sort-results').click().get('ul > li[data-value="original_title.asc"]').click()
      cy.wait(500)
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(0).should('contain', 'Barbie')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(1).should('contain', 'Cobweb')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(2).should('contain', 'Haunting of the Queen Mary')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(3).should('contain', 'The (Almost) Legends')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(4).should('contain', 'Oppenheimer')
      cy.get('#sort-results').click().get('ul > li[data-value="original_title.desc"]').click()
      cy.wait(500)
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(0).should('contain', 'Oppenheimer')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(1).should('contain', 'The (Almost) Legends')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(2).should('contain', 'Haunting of the Queen Mary')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(3).should('contain', 'Cobweb')
      cy.get('.MuiGrid-spacing-xs-4').find('.MuiGrid-item').eq(4).should('contain', 'Barbie')
    })

  })

})