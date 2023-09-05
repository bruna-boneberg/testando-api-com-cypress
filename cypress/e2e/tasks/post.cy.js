describe("POST /tasks", () => {
  beforeEach(function () {
    cy.fixture("tasks/post").then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it("register a new task", function () {

    const { user, task } = this.tasks.create;

    cy.task("removeUser", user.email);
    cy.postUser(user);

    cy.postSession(user)
    .then(userResp => {
      cy.task("removeTask", task.name, user.email);

      cy.postTask(task, userResp.body.token)
      .then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eql(task.name);
        expect(response.body.tags).to.eql(task.tags);
        expect(response.body.is_done).to.be.false;
        expect(response.body.user).to.eq(userResp.body.user._id);
        expect(response.body._id.length).to.eq(24);
    });
  });
});

  it("duplicated task", function () {
    const { user, task } = this.tasks.dup;

    cy.task("removeUser", user.email);
    cy.postUser(user);

    cy.postSession(user)
    .then(userResp => {
      cy.task("removeTask", task.name, user.email);

      cy.postTask(task, userResp.body.token)
      cy.postTask(task, userResp.body.token)

      .then(response => {

        const { message } = response.body

        expect(response.status).to.eq(409);
        expect(message).to.eq("Duplicated task!");

    });
  });
});
});
