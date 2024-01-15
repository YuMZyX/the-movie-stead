import '@testing-library/cypress/add-commands'

Cypress.Commands.add('clearSignUp', () => {
  cy.get('#name').clear()
  cy.get('#email').clear()
  cy.get('#password').clear()
  cy.get('#passwordCheck').clear()
})

Cypress.Commands.add('createUser', ({ name, email, password, role }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
    name, email, password, role
  })
})

Cypress.Commands.add('login', ({ email, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    email, password
  }).then(({ body }) => {
    localStorage.setItem('loggedTMSUser', JSON.stringify(body))
    cy.visit('')
  })
})