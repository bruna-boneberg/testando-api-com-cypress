describe("DELETE /tasks/:id", () => {

  beforeEach(function () {
    cy.fixture('tasks/delete').then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it("remove a task", function () {
    const { user, task } = this.tasks.remove;

    cy.task("removeTask", task.name, user.email);
    cy.task("removeUser", user.email);
    cy.postUser(user);

    cy.postSession(user)
    .then(respUser => {
      cy.postTask(task, respUser.body.token)
      .then(respTask => {
        cy.deleteTask(respTask.body._id, respUser.body.token)
        .then(response => {
            expect(response.status).to.eq(204)        
        });
      });
    });
  });

  it("task not found", function () {

    const { user, task } = this.tasks.not_found;

    cy.task("removeTask", task.name, user.email);
    cy.task("removeUser", user.email);
    cy.postUser(user);

    cy.postSession(user)
    .then(respUser => {
      cy.postTask(task, respUser.body.token)
      .then(respTask => {
        cy.deleteTask(respTask.body._id, respUser.body.token)
        .then(
          (response) => {
            expect(response.status).to.eq(204);
          }
        );

        cy.getUniqueTask(respTask.body._id, respUser.body.token)
        .then(response => {
            expect(response.status).to.eq(404);
          }
        );
      });
    });
  });
});
