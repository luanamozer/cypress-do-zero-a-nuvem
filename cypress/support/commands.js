
Cypress.Commands.add('fillMandatoryFieldsAndSubmit', ()=>{
  cy.get('#firstName').type('luana')
  cy.get('#lastName').type('mozzer')
  cy.get('#email').type('luana@teste.com') 
  cy.get('#open-text-area').type('testes comandos customizados')
  cy.get('button[type="submit"]').click()  

} )

Cypress.Commands.add('ErrorMessageMandatoryFieldNotFilled', (data)=>{
  cy.get('#firstName').type(data.firstName)
  cy.get('#lastName').type(data.lastName)
  cy.get('#email').type(data.email) 
  cy.get('#phone-checkbox').check()
  cy.get('#open-text-area').type('teste')
  cy.get('button[type="submit"]').click()

})