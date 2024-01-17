describe('Login/Logout', function() {

  describe('Login form', function() {
    beforeEach(function() {
      cy.visit('')
    })

    it('can be opened', function() {
      cy.findByText('Login').click({ force: true })
      cy.contains('The Movie Stead - Login')
      cy.contains('Don\'t have an account? Sign Up')
    })
  })

  describe('Login', function() {
    beforeEach(function() {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      cy.createUser({
        name: 'Initial User',
        email: 'init.user@gmail.com',
        password: 'password',
        role: 'user'
      })
      cy.visit('http://localhost:3001/#/login')
    })

    it('succeeds with correct credentials', function() {
      cy.get('#email').type('init.user@gmail.com')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Initial User')
      cy.contains('Trending movies')
      cy.contains('Watchlist')
      cy.contains('My Reviews')
    })

    it('fails with wrong credentials', function() {
      cy.get('#email').type('init.user@gmail.com')
      cy.get('#password').type('passwor')
      cy.get('#login-button').click()
      cy.contains('Invalid username or password')
      cy.get('html').should('not.contain', 'Initial User')
      cy.get('html').should('not.contain', 'Watchlist')

      cy.get('#email').clear()
      cy.get('#password').clear()

      cy.get('#email').type('inituser@gmail.com')
      cy.get('#password').type('password')
      cy.get('#login-button').click()
      cy.contains('Invalid username or password')
      cy.get('html').should('not.contain', 'Initial User')
      cy.get('html').should('not.contain', 'Watchlist')
    })

    describe('with a disabled account', function() {
      beforeEach(function() {
        cy.task('db:seedUsers')
      })

      it('fails with a notice to user', function() {
        cy.get('#email').type('disabled@gmail.com')
        cy.get('#password').type('password')
        cy.get('#login-button').click()
        cy.contains('Account disabled, contact admin/moderator')
        cy.get('html').should('not.contain', 'Initial User')
        cy.get('html').should('not.contain', 'Watchlist')
      })

    })

  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      cy.task('db:seedUsers')
    })

    it('user can log out', function() {
      cy.login({ email: 'regular@gmail.com', password: 'password' })
      cy.findByText('Logout').click({ force: true })
      cy.contains('The Movie Stead - Login')
      cy.contains('Don\'t have an account? Sign Up')
      cy.get('html').should('not.contain', 'Regular User')
      cy.get('html').should('not.contain', 'Watchlist')
    })

    it('user can access watchlist and my reviews tabs', function() {
      cy.login({ email: 'regular@gmail.com', password: 'password' })
      cy.contains('Regular User')
      cy.get('#watchlist').click({ force: true })
      cy.contains('Your watchlist is currently empty')
      cy.get('#my-reviews').click({ force: true })
      cy.contains('You have not reviewed any movies yet')
    })

    it('moderator can access Users tab', function() {
      cy.login({ email: 'moderator@gmail.com', password: 'password' })
      cy.contains('Moderator User')
      cy.get('#users').click({ force: true })
      cy.contains('User management')
    })

    it('admin can access Users tab', function() {
      cy.login({ email: 'admin@gmail.com', password: 'password' })
      cy.contains('Admin User')
      cy.get('#users').click({ force: true })
      cy.contains('User management')
    })
  })

})