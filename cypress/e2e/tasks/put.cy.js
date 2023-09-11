describe("PUT /tasks/:id/done", () => {
  beforeEach(function () {
    cy.fixture("tasks/put").then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it("update task to done", function () {
    const { user, task } = this.tasks.update;

    cy.task("removeTask", task.name, user.email); // remove a task, usando nome da tarefa + email do usuario
    cy.task("removeUser", user.email); // remove o user pelo email
    cy.postUser(user); // cadastro o usuario novamente

    cy.postSession(user) // faz login, cadastrando o novo token
    .then(respUser => {
      cy.postTask(task, respUser.body.token) // Cadastra a tarefa
      .then(respTask => {
        cy.putTaskDone(respTask.body._id, respUser.body.token) // atualiza ela considerando a sub rota /done
          .then(response => {
            expect(response.status).to.eq(204);
        cy.getUniqueTask(respTask.body._id, respUser.body.token) // pega essa tarefa
        .then(response => {
            expect(response.body.is_done).to.be.true; // verifica o status code
          });
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
          .then(response => {
              expect(response.status).to.eq(204);
            }
          );
          cy.putTaskDone(respTask.body._id, respUser.body.token)
          .then(response => {
              expect(response.status).to.eq(404);
            }
          );
        });
      });
    });
  });
