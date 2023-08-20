describe("POST /users", () => {
  it("register a new user", () => {
    const user = {
      name: "Bruna Costa",
      email: "bruna@yahoo.com",
      password: "pwd123",
    };

    cy.task("deleteUser", user.email);

    cy.postUser(user).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("duplicate email", () => {
    const user = {
      name: "James Gunn",
      email: "james@hotmail.com",
      password: "pwd123",
    };

    cy.task("deleteUser", user.email);

    cy.postUser(user);

    cy.postUser(user).then((response) => {
      const { message } = response.body;

      expect(response.status).to.eq(409);
      expect(message).to.eq("Duplicated email!");
    });
  });

  context ("required fields", () => {
    
    let user;

    beforeEach(()=> {
        user = {
        name: "Margot Robbie",
        email: "margot@gmail.com",
        password: "FA12345do"
        }
    })

    it("name is required", () => {

      delete user.name

      cy.postUser(user)
      .then((response) => {

        const { message } = response.body;
        
        expect(response.status).to.eq(400);
        expect(message).to.eq("ValidationError: \"name\" is required")
      });
    });

    it("email is required", () => {

      delete user.email

      cy.postUser(user)
      .then((response) => {

        const { message } = response.body;
        
        expect(response.status).to.eq(400);
        expect(message).to.eq("ValidationError: \"email\" is required")
      });
    });

    it("password is required", () => {

      delete user.password

      cy.postUser(user)
      .then((response) => {

        const { message } = response.body;
        
        expect(response.status).to.eq(400);
        expect(message).to.eq("ValidationError: \"password\" is required")
      });
    });
  });
});
