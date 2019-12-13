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
          "View all Employees",
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
        
        case "View all Employees":
          allEmployee();
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
        query += "FROM department INNER JOIN role ON (role.department_id = department.id)";
        query += "WHERE (role.title = ?)";
        
        console.log(answer.role);

        connection.query(query, [answer.role], function(err, res) {
            
            if (err) throw err;
            console.table(res)
        });
    });
}


// DO connection query first to render names (push). then prompt questions, then another connection query
function viewEmployee() {
    var query = "SELECT first_name, last_name FROM employee"

    connection.query(query, function(err, res) {
        // if (err) throw err;
    inquirer
      .prompt({
        name: "employee",
        type: "list",
        message: "Which employee would you like to see?",
        choices: function(){
            employeeList = [];
            for(i= 0; i< res.length; i++) {
                var currentEmployee = res[i];
                employeeList.push({
                    name:`${res[i].first_name} ${res[i].last_name}`
                });
            };
            return employeeList;
        }
      })
      .then(function(answer) {
        var query = "SELECT *";
        query += "FROM employee INNER JOIN role ON (employee.role_id = role.id)";
        query += "WHERE (employee.first_name = ? and employee.last_name)";
        
        console.log(answer.role);

        connection.query(query, [answer.role], function(err, res) {
            
            if (err) throw err;
            console.table(res)
        });
    });
        // console.log(res);
        // console.log(res[0]);

    

    // console.log(employeeList);
    // console.log(employeeList[0]);
    
    //  console.table(employeeList);
}) 
};


   


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
};

// View all employees
function allEmployee(){
   
    var query = "SELECT *";
    query += "FROM employee INNER JOIN role ON (employee.role_id = role.id)";
   

    connection.query(query, function(err, res) {
        
        if (err) throw err;
        console.table(res)
    })
};    



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
        name: 'addRole',
        type: 'rawlist',
        message: 'What is the Role?',
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
    }   
    ]).then(answer =>{
        connection.query(
            'INSERT INTO employee SET ?',
            {
                first_name: answer.addFirstName,
                last_name: answer.addLastName,
                role_id: answer.addRole.answer,
                // manager_id: answer.addManId
            },
            err => {
                if (err) throw err;
                console.log('your employee was created')
            }
        );
    })
}         