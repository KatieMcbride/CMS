var mysql = require("mysql");
const inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Ktbuh165!",
  database: "cms_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});


function start() {
    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "Add a department",
          "Add a role",
          "Add an employee",
          "View department",
          "View role",
          "View employee",
          "Update Employee Role"

        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Add a department":
          addDepartment();
          break;
  
        case "Add a role":
          addRole();
          break;
  
        case "Add an employee":
          addEmployee();
          break;
  
        case "View department":
          viewDepartment();
          break;
  
        case "View role":
          viewRole();
          break;

        case "View employee":
          viewEmployee();
          break;

        case "Update Employee Role":
          updateEmployee();
          break;
        }
      });
  }