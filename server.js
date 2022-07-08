const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");
const express = require("express");
const app = express();

const db = mysql.createConnection({
    host: "localhost",

    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeeDB'
});
    
db.connect((err) => {
  if (err) {
    console.log("ERROR:" + err);
  }
  console.log("Connected as id " + db.threadId);
  firstPrompt();
});

function firstPrompt(){
    inquirer.prompt([
    {
      type: 'list',
      name:'userInput',
      message: 'What would you like to do?',
      choices: [
      'View All Employees',
      'View Employees By Department',
      'Add Employee',
      'Remove Employee',
      'Update Employee Role',
      'Add Role',
      'Add Department',
      'Exit'
      ]
        
    }
  
    ]).then((res)=>{
      console.log(res.userInput);
      switch(res.userInput){
        case 'View All Employees':
          viewEmployees();
          break;
        case 'View Employees By Department':
          viewDepartments();
          break;
        case 'Add Employee':
          newEmployee();
          break;
        case 'View Roles':
          promptRoles();
          break;
        case 'Remove Employee':
          removeEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'Add Role':
          newRole();
          break;
        case 'Add Department':
          newDepartment();
          break;
        case 'End':
          db.end();
          break;
        }
    });
}

function viewEmployees(){
    console.log("Viewing employees\n");
    let query=
    `SELECT 
        employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
        ON employee.role_id = role.id
    LEFT JOIN department
        ON department.id = role.department_id
    LEFT JOIN employee manager
        ON manager.id = employee.manager_id`

    db.query(query,(err, res)=>{
      if (err) {throw err;}
  
      console.table(res);;
      firstPrompt();
    });    

}

function viewDepartments(){
  const query = "View Employees from Departments";

  db.query(query, function (err, res) {
    if (err) {throw err;}

    const departmentChoices = res.map(data => ({
      value: data.id, name: data.name
    }));

    firstPrompt();
  }

)}

function promptRoles(){
  const query = "View Employees from Roles";

  db.query(query, function (err, res) {
    if (err) {throw err;}

    const departmentRoles = res.map(data => ({
      value: data.id, name: data.name
    }));

    firstPrompt();
  }
)}

function newEmployee(){
  inquirer.prompt([
    {
    type: "input",
    name: "first_name",
    message: "Enter employee first name: ",
  },
  {
    type: "input",
    name: "last_name",
    message: "Enter employee last name: ",
  },
  ])
  .then((res) => {
    const parameters = [res.first_name, res.last_name];

    const rSql = "SELECT role.id, role.title FROM role";

    db.query(rSql, function (err, res) {
      if (err) {throw err;}

    const roles = data.map(({id, title}) => ({name: title, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "role_id",
        choices: roles,
        message: "Select Employee Role: ",
      },
    ])
    .then((rChoice)=>{
      const role = rChoice.role_id;
      parameters.push(role);

      const manageSql = "Select role from employee: ";

      db.query(manageSql, (err, data)=>{
        if (err){ throw err};
      })

      const mgrs = data.map(({ id, first_name, last_name }) => ({
        name: first_name +" "+ last_name,
        value: id,
      }));

      inquirer.prompt([
        {
        type: "list",
        name: "manager_id",
        choices: managers,
        message: "Select the employee's manager: ",
        },

      ])

      .then((mChoice)=> {
        const mgr = mChoice.manager_id;
        parameters.push(mgr);

        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';

        db.query(query, parameters, (err, result) => {
          if (err){ throw err}

          firstPrompt();
        });
        
        });
      });
    
    });
  });
};


function newDepartment() {
  inquirer.prompt([
    {
    type: "input",
    name: "departmentName",
    message: "Name the new department: ",
    }
  ])
  .then((res) => {
    const query = `INSERT INTO dept (department_name) VALUES (?)`;

    db.query(query, res.departmentName, (err, result) => {
      if (err){
        throw err;
      }
      console.log(res.departmentName+ " is added.");
      });

      firstPrompt();;
    });
}

function newRole(){
  inquirer.prompt([
    {
      type: "input",
      name: "role",
      message: "Name your new role: ",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the role's salary: "
    },
  ])
  .then((res)=>{
    const parameters = [res.role, res.salary]
    const query = "SELECT department_name, id from department";
    db.query(query, (err, data)=> {
      if (err){
        throw err;
      }

      const department = data.map(({department_name, id})=>({
        name: department_name,
        value: id,
      }));

      inquirer.prompt([
        {
        type: "list",
        name: "department",
        choices: department,
        message: "Enter the department of this role:",
        },
      ])

      .then((deptRes) => {
        const department = deptRes.department;
        parameters.push(department);
      
      
      const query = "INSERT INTO the role (title, salary, department_id) VALUES (?,?,?)";

      db.query(query, parameters, (err, result) =>{
        if(err){
          throw err;
        }

        console.log(deptRes.department +" is added.");

        firstPrompt();
      });


    });
  });
  });
}

function updateEmployeeRole(){
  const query = "SELECT ROLE FROM employee";

  db.query(query, (err, data) =>{
    if(err){
      throw err;
    }

    const employees = data.map(({id, first_name, last_name}) => ({
      name: first_name + " " +last_name,
      value:id,
    }));

    inquirer.prompt([
      {
      type: "list",
      name: "name",
      choices: employees,
      message: "Select an employee to update: ",
      },  
    ])

    .then((res)=>{
      const employee =res.name;
      const parameters = [];
      
      parameters.push(employee);

      const query = "SELECT EMPLOYEE FROM ROLE";
    
      db.query(query, (err, data)=> ({
        name: title,
        value: id,
      }));

      inquirer.prompt([
        {
          type: "list",
          name: "role",
          choices: roles,
          message: "Enter the new role of the employee: ",
        },
      ])

      .then((roleRes) =>{
        const role = roleRes.role;
        parameters.push(role);

        var employee = parameters[0];
        parameters[0] = role;
        parameters[1] = employee;

        const query = 'UPDATE employee SET role_id=role WHERE id = ?';

        db.query(query, parameters, (err, result)=>{
          if(err){
            throw err;
          }
          firstPrompt();
        });
      });
    
    });

  });


};


