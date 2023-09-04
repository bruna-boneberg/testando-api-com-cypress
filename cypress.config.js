const { defineConfig } = require("cypress");

const { connect } = require("./cypress/support/mongo");

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // implement node event listeners here
      const db = await connect();

      on("task", {
        async deleteUser(email) {
          const users = db.collection("users");
          await users.deleteMany({ email: email });
          return null;
        },
        async deleteTask(taskName, emailUser) {
          const users = db.collection('users')
          const user = users.findOne({ email: emailUser })
          const tasks = db.collection("tasks")
          await tasks.deleteMany({ name: taskName, user: user._id })
          return null
        }
      });
    },
    baseUrl: "http://localhost:3333",
  },
});
