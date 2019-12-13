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
          "Update Employee Role",
          "Delete Employee",
          "Delete Department"

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
        
        case "Delete Employee":
          deleteEmployee();
          break;
        
        case "Delete Department":
           deleteDepartment();
           break;
        }
      });
}

// View specific Departments
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
        start();
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
        start();
    });
};

// View an Employee
function viewEmployee() {
    var query = "SELECT first_name, last_name, role_id FROM employee"

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
                    name:`${res[i].first_name} ${res[i].last_name}`,
                    value:`${res[i].role_id}`
                });
            };
            return employeeList;
        }
      })
      .then(function(answer) {
        var query = "SELECT * FROM employee INNER JOIN role ON (employee.role_id = role.id) WHERE (employee.role_id = ?)";

        connection.query(query, [answer.employee], function(err, res) {
            console.log(answer.employee);
            if (err) throw err;
            console.table(res);
        });
        start();
    });
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
        start();
    })
    
};

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
        type: 'list',
        message: 'What is the Department?',
        choices:[
            {
                name: "sales",
                value: 1
            },
            {
                name: "Finance",
                value: 2
            },
            {
                name: "Legal",
                value: 3
            },
            {
                name: "Engineer",
                value: 4
            },
            {
                name: "Management",
                vaue: 5
            }
        ]
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
        start();
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
    start();
};    

// Add en Employee
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
            {name: "Software Engineer",
            value: 1},
            { name: "Junior Manager",
            value: 2
            },
            {
               name: "Senior Sales",
               value: 3
            },
            {
                name: "Junior Sales",
                value: 4
            },
            {
                name:"Accountant",
                value: 5
            },
            {
                name:"Auditor",
                value: 6
            },
            {
                name: "Lawyer",
                value: 7
            },
            {
                name:"Paralegal",
                value: 8
            },
            {
                name: "Web Developer",
                value: 9
            },
            {
                name: "Engineer",
                value: 10
            },
            {
                name:"CEO",
                value: 11
            },
            {
                name:"Senior Manager",
                value:12
            }
        ]
    }   
    ]).then(answer =>{
        connection.query(
            'INSERT INTO employee SET ?',
            {
                first_name: answer.addFirstName,
                last_name: answer.addLastName,
                role_id: answer.addRole,
                // manager_id: answer.addManId
            },
            err => {
                if (err) throw err;
                console.log('your employee was created')
            }
        );
        start();
    })
}; 

// Delete Employee
function deleteEmployee() {
    let query =
      "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON role.id = employee.role_id";
    connection.query(query, (err, res) => {
      if (err) throw err;
      inquirer
      .prompt([
        {
          type: "list",
          name: "delete",
          message: "Select Employee to Remove",
          choices: function() {
            let choiceArray = [];
            res.forEach(employee => {
              choiceArray.push(
                `${employee.first_name} ${employee.last_name}, ${employee.title}, ${employee.id}`
              );
            });
            return choiceArray;
          }
        }
      ]).then(ans => {
        let choice = ans.delete;
        let id = choice.match(/\d+/g);
        let query = "DELETE FROM employee WHERE id = ?";
        connection.query(query, id, (err, res) => {
          if (err) throw err;
          console.log("succesfully deleted");
        });
      });
      start();
    });
};

// DELETE DEPARTMENT
function deleteDepartment() {
    let query =
      "SELECT * FROM department";
    connection.query(query, (err, res) => {
      if (err) throw err;
      inquirer
      .prompt([
        {
          type: "list",
          name: "deleteDepartment",
          message: "Select department to Remove",
          choices: function() {
            let choiceArray = [];
            res.forEach(department => {
              choiceArray.push(
                `${department.department_name}, ${department.id}`
              );
            });
            return choiceArray;
          }
        }
      ]).then(ans => {
        let choice = ans.deleteDepartment;
        let id = choice.match(/\d+/g);
        let query = "DELETE FROM department WHERE id = ?";
        connection.query(query, id, (err, res) => {
          if (err) throw err;
          console.log("succesfully deleted");
        });
      });
    });
    // start();
};