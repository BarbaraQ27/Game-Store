//npx cypress open  ====> abrir la app cypress con navegador de pruebas

describe('Barra de busqueda', () => {

  beforeEach(() => {
    // Simula sesion activa
    cy.setCookie('session', JSON.stringify({
      email: 'test@example.com',
      session_token: 'fake-token-123',
    }))
    cy.visit('/game-store/dashboard/store') //montar la pagina
  })
  //verifica que el campo existe
  it('muestra el campo de busqueda', () => {
    cy.get('.v-text-field input').should('be.visible')
  })
  //verifica que permite ingresar texto
  it('permite escribir en el campo', () => {
    cy.get('.v-text-field input').type('Witcher')
    cy.get('.v-text-field input').should('have.value', 'Witcher')
  })
  //verifica que al presionar el input muestre la store con las card de juegos
  it('navega a Store y muestra resultados al buscar', () => {
    cy.get('.v-text-field input').type('Witcher')
    cy.get('.v-text-field input').type('{enter}')
    cy.url().should('include', '/dashboard/store')
    cy.get('.game-card').should('have.length.greaterThan', 0) //importa las card que se muestran
  })

})
