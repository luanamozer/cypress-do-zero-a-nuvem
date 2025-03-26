describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(()=>{
    cy.visit('./src/index.html')
  })
  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
  })

  Cypress._.times(3, ()=>{ // funcao(_.times) do lodash(lib JS) executa um funcao callback por um numero de vezes, passado no primeiro argumento(3), o segundo argumento recebe a funcao que deverá ser executada (o bloco it abaixo)
    it('preenche os campos obrigatórios e envia o formulário',() =>{

      const longText = Cypress._.repeat('ontrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC', 10) // Cypress._ (lodash)(é uma lib JS, permite chamar algumas funçoes) _.repeat: funcao que repete o texto 10x
  
      cy.get('#firstName').type('luana')
      cy.get('#lastName').type('mozzer')
      cy.get('#email').type('luana@teste.com') 
      cy.get('#open-text-area').type( longText, {delay:0,})
      cy.get('button[type="submit"]').click()
  
      cy.get('.success').should('be.visible')
      
    })

  })  
  

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', ()=>{
    cy.get('#firstName').type('luana')
    cy.get('#lastName').type('mozzer')
    cy.get('#email').type('luana@teste,,,,') 
    //cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
  })

  it('campo telefone continua vazio quando preenchido com um valor não-numérico', ()=>{
    cy.get('#phone').type('fsfdefe')
    cy.get('#phone').should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', ()=>{
    cy.get('#firstName').type('luana')
    cy.get('#lastName').type('mozzer')
    cy.get('#email').type('luana@teste.com') 
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('teste')
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
  })
  
  it('preenche e limpa os campos nome, sobrenome, email e telefone', ()=>{
    cy.get('#firstName').type('luana')
      .should('have.value','luana')
      .clear().should('have.value', '') 
       
    cy.get('#lastName').type('mozzer').should('have.value','mozzer')
      .clear().should('have.value', '') 

    cy.get('#email').type('luana@teste.com').should('have.value','luana@teste.com')
      .clear().should('have.value', '') 

    cy.get('#phone').type('9999999').should('have.value','9999999')
      .clear().should('have.value', '')
    })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', ()=>{
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', ()=>{
    cy.fillMandatoryFieldsAndSubmit() // comando customizado no arquivo support/commands.js

    cy.get('.success').should('be.visible')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário (personalizado)', ()=>{
    cy.clock() // funcao que congela o relogio do navegador

   const data ={
    firstName: 'esther',
    lastName: 'gomes',
    email: 'esther@teste.com'
   } 
   cy.ErrorMessageMandatoryFieldNotFilled(data)

    cy.get('.error').should('be.visible')

    cy.tick(3000) // funcao acelara o tempo em 3s
    cy.get('.error').should('not.be.visible')
    
  })

  /// selecionando menus suspensos/dropdown
  /// sendo selecionado por texto,value e indice
  it('seleciona um produto (YouTube) por seu texto', ()=>{
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', ()=>{
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })
  it('seleciona um produto (Blog) por seu índice', ()=>{
    cy.get('#product').select(1).should('have.value', 'blog')
  })

  ///marcando inputs do tipo radio
  it('marca o tipo de atendimento "Feedback"', ()=>{
    //cy.get('input[type="radio"]').check('feedback') 
    // ou
     cy.get('input[type="radio"][value="feedback"]') // selecionando pelo value
      .check()
      .should('be.checked')
  })
  it('marca cada tipo de atendimento', ()=>{
    cy.get('input[type="radio"]') //pega todos os inputs radios
      .each(TipodeAtendimento =>{ // each recebe como argumento uma funcao e percorre um dos radios
        cy.wrap(TipodeAtendimento) // embrulha todos e percorre cada um dando checked e verifica se foi checkado
        .check()
        .should('be.checked')
      })
  })

  /// marcando e desmarcando checkboxes

  it('marca ambos checkboxes, depois desmarca o último', ()=>{
    cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last() // pega o ultimo marcado
        .uncheck() // e desmarca
        .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures',()=>{
    cy.get('#file-upload').selectFile('cypress/fixtures/example.json')
      .should((input =>{
        console.log(input)
        expect(input[0].files[0].name).to.equal('example.json') // verifica se o nome do arquivo foi o que foi feito upload acessando pelo array do objeto
      }))
    })
  it('seleciona um arquivo simulando um drag-and-drop', ()=>{
    cy.get('#file-upload').selectFile('cypress/fixtures/example.json', {action: 'drag-drop'}) // passa com segundo argumento um obj com a funcao de arrasta e soltar o arquivo na pagina web
    .should((input =>{
      expect(input[0].files[0].name).to.equal('example.json')
    }))
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', ()=>{
    cy.fixture('example.json').as('sampleFile') 
    cy.get('#file-upload').selectFile('@sampleFile')
      .should((input =>{
        console.log(input)
        expect(input[0].files[0].name).to.equal('example.json')
      }))
  })
  /// lidando com links que abrem em outras abas dos navegadores
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', ()=>{
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'href', 'privacy.html')
      .and('have.attr', 'target','_blank') //  verificou se o <a> tinha o atributo target com o valor _blank, pq quando tem, por padrão o link abre em outra aba do navegador
  })
  it('acessa a página da política de privacidade removendo o target e então clicando no link', ()=>{
    cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .should('not.have.attr', 'target')
    cy.contains('a', 'Política de Privacidade').click()
    cy.contains('h1','CAC TAT - Política de Privacidade').should('be.visible')
  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show') // forca o elemento a ficar visivel
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide') // forca o elemento a sumir da tela
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })
  
  it('preenche o campo da área de texto usando o comando invoke', ()=>{
    cy.get('#open-text-area').invoke('val', 'testandoooo')
        .should('have.value', 'testandoooo')
    
  })

  it.only('encontra o gato escondido na aplicacao', ()=>{
    cy.get('#cat').invoke('show')
    .should('be.visible')
   cy.get('#title').invoke('text','CAT TAT') // altera o texto/titulo 
  })

})
