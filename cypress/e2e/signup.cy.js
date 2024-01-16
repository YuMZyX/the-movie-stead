describe('Sign Up', function() {

  describe('Sign Up form', function() {
    beforeEach(function() {
      cy.visit('')
    })

    it('can be opened', function() {
      cy.findByText('Sign Up').click({ force: true })
      cy.contains('The Movie Stead - Sign up')
      cy.contains('Already have an account? Sign in')
    })
  })

  describe('Sign Up', function() {
    beforeEach(function() {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      cy.createUser({
        name: 'Initial User',
        email: 'init.user@gmail.com',
        password: 'password',
        role: 'user'
      })
      cy.visit('http://localhost:5173/#/signup')
    })

    it('succeeds with valid information', function() {
      cy.get('#name').type('Test User')
      cy.get('#email').type('test.user@gmail.com')
      cy.get('#password').type('password')
      cy.get('#passwordCheck').type('password')
      cy.get('#signup-button').click()

      cy.contains('Test User')
      cy.contains('Trending movies')
      cy.contains('Watchlist')
      cy.contains('My Reviews')
    })

    it('fails if any required field is empty', function() {
      cy.get('#email').type('test.user@gmail.com')
      cy.get('#password').type('password')
      cy.get('#passwordCheck').type('password')
      cy.get('#signup-button').click()
      cy.contains('Name is required')
      cy.get('html').should('not.contain', 'Test User')

      cy.clearSignUp()
      cy.get('#name').type('Test User')
      cy.get('#password').type('password')
      cy.get('#passwordCheck').type('password')
      cy.get('#signup-button').click()
      cy.contains('Email address is required')
      cy.get('html').should('not.contain', 'Test User')

      cy.clearSignUp()
      cy.get('#name').type('Test User')
      cy.get('#email').type('test.user@gmail.com')
      cy.get('#passwordCheck').type('password')
      cy.get('#signup-button').click()
      cy.contains('Password is required')
      cy.get('html').should('not.contain', 'Test User')

      cy.clearSignUp()
      cy.get('#name').type('Test User')
      cy.get('#email').type('test.user@gmail.com')
      cy.get('#password').type('password')
      cy.get('#signup-button').click()
      cy.contains('Password confirmation is required')
      cy.get('html').should('not.contain', 'Test User')
    })

    it('fails if passwords do not match', function() {
      cy.get('#name').type('Test User')
      cy.get('#email').type('test.user@gmail.com')
      cy.get('#password').type('password')
      cy.get('#passwordCheck').type('passwor')
      cy.get('#signup-button').click()
      cy.contains('Your passwords do not match')
      cy.get('html').should('not.contain', 'Test User')
    })

    it('fails if email address is not valid', function() {
      cy.get('#name').type('Test User')
      cy.get('#email').type('test.user@')
      cy.get('#password').type('password')
      cy.get('#passwordCheck').type('password')
      cy.get('#signup-button').click()
      cy.contains('Enter a valid email')
      cy.get('html').should('not.contain', 'Test User')
    })

    it('fails if name is too short', function() {
      cy.get('#name').type('Tes')
      cy.get('#email').type('test.user@gmail.com')
      cy.get('#password').type('password')
      cy.get('#passwordCheck').type('password')
      cy.get('#signup-button').click()
      cy.contains('Name has to be atleast 4 characters long')
      cy.get('html').should('not.contain', 'Test User')
    })

    it('fails if password is too short', function() {
      cy.get('#name').type('Test User')
      cy.get('#email').type('test.user@gmail.com')
      cy.get('#password').type('passw')
      cy.get('#passwordCheck').type('passw')
      cy.get('#signup-button').click()
      cy.contains('Password has to be atleast 6 characters long')
      cy.get('html').should('not.contain', 'Test User')
    })

    it('fails if email already exists in DB', function() {
      cy.get('#name').type('Test User')
      cy.get('#email').type('init.user@gmail.com')
      cy.get('#password').type('password')
      cy.get('#passwordCheck').type('password')
      cy.get('#signup-button').click()

      cy.contains('Email address already exists, try logging in.')
      cy.get('html').should('not.contain', 'Test User')
    })

  })

})