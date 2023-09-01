describe("POST /tasks", () => {

  beforeEach(function () {
    cy.fixture("tasks").then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it("register a new task", function () {

    const { user, task } = this.tasks.create

    cy.task("deleteUser", user.email);

    cy.postUser(user);

    cy.postSession(user)
    .then(response => {

        cy.task('deleteTask', task.name)

        cy.api({
            url: '/tasks',
            method: 'POST',
            body: task,
            headers: {
                authorization : response.body.token
            },
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.eq(200)
        })
      })
    })
  })
