var mysql = require("mysql");
const inquirer = require('inquirer');
const cTable = require('console.table');

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

  function viewDepartment() {
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "What department would you like to see?",
        choices: [
            "Sales",
            "Legal",
            "Engineer",
            "Finance"
          ]
      })
      .then(function(answer) {
        console.log(answer.name);
        connection.query("SELECT * FROM department WHERE ?", { department_name: answer.department }, function(err, res) {
          console.log(
            "Department Name: " +
              res[0].department_name +
              " || Id " +
              res[0].id
            )
        //   runSearch();
        });
      });
  }


//   ADD DEPARTMENT
function addDepartment() {
    inquirer
      .prompt({
        name: "addDep",
        type: "input",
        message: "What department would you like to add?",
      })
      .then(answer =>{
        connection.query(
            'INSERT INTO department SET ?',
            {
                department_name: answer.addDep,
            },
            err => {
                if (err) throw err;
                console.log('your department was created')
            }
        );
    })
}