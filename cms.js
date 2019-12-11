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
        type: "rawlist",
        message: "What department would you like to see?",
        choices: [
            "1. Sales",
            "2. Finance",
            "3. Legal",
            "4. Engineer",
            "5. Management"
          ]
      })
      .then(function(answer) {
        console.log(answer.name);

        var query = "SELECT department.department_name, role.title, role.salary ";
        query += "FROM department INNER JOIN role ON (department.id = role.department_id)";
        query += "WHERE (department.id = ?)";
        

        connection.query(query, [answer.department, answer.department], function(err, res) {
          console.table(res);
        });
      });
}

// VIEW ROLE
function viewRole() {
    inquirer
      .prompt({
        name: "role",
        type: "rawlist",
        message: "Which role would you like to see?",
        choices: [
            "Software Engineer",
            "Junior Manager",
            "Senior Sales",
            "Junior Sales",
            "Accountant",
            "Auditor",
            "Lawyer",
            "Paralegal",
            "Web Developer",
            "Engineer",
            "CEO",
            "Senior Manager"
          ]
      })
      .then(function(answer) {
        var query = "SELECT *";
        query += "FROM role INNER JOIN department ON (role.department_id = department.id)";
        query += "WHERE (role.title = ?)";
        
        console.log(answer.role);

        connection.query(query, [answer.role], function(err, res) {
            
            if (err) throw err;
            console.table(res)
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

// ADD ROLE
function addRole() {
    inquirer
      .prompt([
      {
        name: "addTitle",
        type: "input",
        message: "What role would you like to add?",
      },
      {
        name: 'addSal',
        type: 'input',
        message: 'What is the Salary?'
        },
        {
        name: 'addDepId',
        type: 'input',
        message: 'What is the Department ID?'
        }
    ])
      .then(answer =>{
        connection.query(
            'INSERT INTO role SET ?',
            {
                title: answer.addTitle,
                salary: answer.addSal,
                department_id: answer.addDepId
            },
            err => {
                if (err) throw err;
                console.log('your role was created')
            }
        );
    })
}

function addEmployee() {
    inquirer
      .prompt([
      {
        name: 'addFirstName',
        type: "input",
        message: "What is the first name?",
      },
      {
        name: 'addLastName',
        type: 'input',
        message: 'What is the last name?'
    },
    {
        name: 'addRolId',
        type: 'input',
        message: 'What is the Role ID'
    },
    {
        name: 'addManId',
        type: 'input',
        message: 'What is the Manager ID?'
    }
    ])
      .then(answer =>{
        connection.query(
            'INSERT INTO employee SET ?',
            {
                first_name: answer.addFirstName,
                last_name: answer.addLastName,
                role_id: answer.addRolId,
                manager_id: answer.addManId
            },
            err => {
                if (err) throw err;
                console.log('your employee was created')
            }
        );
    })
}