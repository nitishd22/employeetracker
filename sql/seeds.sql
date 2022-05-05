USE employeeDB;

INSERT INTO department (name)
VALUES 
("Sales"), 
("Engineering"), 
("Finance"), 
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES 

("Salesperson", 80000, 1),
("Lead Engineer", 150000, 2),
("Sales Lead", 100000, 1),
("Software Engineer", 120000, 2), 
("Accountant", 125000, 3), 
("Legal Team Lead", 250000, 4), 
("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES 
("Nitish", "Doss", 1), 
("Adrian", "Sowul", 2), 
("Lenin", "Macias", 3),
("Andrew", "Wang", 4), 
("Julian", "Casablancas", 5), 
("Kevin", "Durant", 6), 
("Khalil", "Mack", 7), 
("Brad", "Pitt", 5), 
("Derek", "Carr", 4); 
