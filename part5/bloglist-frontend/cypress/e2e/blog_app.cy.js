describe('display login form by default', () => {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: "melchanti",
      name: "Mohamad EL-Chanti",
      password: "secret"
    });
    cy.visit('http://localhost:3000');
  });

  it('passes', () => {
    cy.contains("log in to application");
  });

  describe("Login", function() {
    it('succeeds with correct credentials', function() {
      cy.get('[name="Username"]').type('melchanti');
      cy.get('[name="Password"]').type('secret');
      cy.get('#login-button').click();

      cy.contains('Mohamad EL-Chanti logged in');
    });

    it('fails with wrong credentials', function() {
      cy.get('[name="Username"]').type('melchanti');
      cy.get('[name="Password"]').type('sec');
      cy.get('#login-button').click();

      cy.contains('wrong credentials')
        .should('have.css', 'color', 'rgb(255, 0, 0)');
    });

    describe('logged in users', function() {
      beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'melchanti',
          password: 'secret'
        }).then(response => {
          localStorage.setItem('loggedBlogUser', JSON.stringify(response.body));
          cy.visit('http://localhost:3000');
        });
      });

      /*it('can create a blog', function() {
        cy.contains('new blog').click();

        cy.get('[name="Title"]').type('End to end testing is delicate');
        cy.get('[name="Author"]').type('houston');
        cy.get('[name="Url"').type('https://testing.com');
        cy.get('#create-blog').click();

        cy.contains('End to end testing is delicate');
      });*/

      describe('When a blog is present', function() {
        beforeEach(function() {
          cy.request({
            method: 'POST',
            url: 'http://localhost:3003/api/blogs',
            body: {title: 'one nedds to be careful', author: 'houston', url:'https://testing.com'},
            headers: {
              'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogUser')).token}`
            }
            }).then(response => {
              cy.visit('http://localhost:3000')
            });
          });

        it('logged in users can like a blog', function() {
          cy.contains('view').click();
          cy.contains('like').click();
          cy.contains('likes: 1');
        });

        it('users who created a blog can delete it', function() {
          cy.contains('view').click();
          cy.contains('remove').click();
          cy.contains('one should be careful');
        })
      })

    })
  })
});