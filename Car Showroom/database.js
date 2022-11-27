const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.join(__dirname, 'pages')))
app.get('/', (request, response) => {
     res.sendFile(`${__dirname}/pages/index.html`);
});

const config = require('./config');

app.get('/getCarsFromDB', (request, response) => {
     const connection = ConnectToDB(config);

     let query = "SELECT * FROM cars";
     let queryResult = {};

     connection.query(query, (err, result, field) => {
          //console.log(err);
          queryResult = result;
          result.forEach(function (item, i, arr) {
               queryResult[i] = { "carId": item['carId'], "name": item['name'], "price": item['price'], "pathToPhoto": item['pathToPhoto'] };
          });
          //console.log(queryResult);
          response.send(queryResult);
     });

     CloseConnectionToDB(connection);
});

app.get('/getCarsFromDBToIndex', (request, response) => {
     const connection = ConnectToDB(config);

     let query = "SELECT * FROM cars";
     connection.query(query, (err, result, field) => {
          //console.log(err);
          //console.log(result);
          response.send(result);
     });

     CloseConnectionToDB(connection);
});


app.get('/getCarNamesFromDB', (request, response) => {
     const connection = ConnectToDB(config);
     let query = "SELECT name FROM cars";
     connection.query(query, (err, result, field) => {
          //console.log(err);
          response.send(result);
     });
     CloseConnectionToDB(connection);
});

app.get('/getCarPricesFromDB', (request, response) => {
     const connection = ConnectToDB(config);
     let query = "SELECT price FROM cars";
     connection.query(query, (err, result, field) => {
          //console.log(err);
          response.send(result);
     });
     CloseConnectionToDB(connection);
});

async function getEmployeeIdFromDB(fullNameEmployee) {
     let query = "SELECT employeeId FROM employees WHERE fullName = '" + fullNameEmployee + "'";
     const connection = await mysql2.createConnection(config);
     const [rows, fields] = await connection.execute(query);
     connection.end();
     //console.log(rows);
     return rows[0]['employeeId'];
}

async function getСlientIdFromDB(receivedFromForm) {
     let clientId = -1;
     let query = "SELECT clientId FROM clients WHERE passportID = " + receivedFromForm.passportID;

     const connection = await mysql2.createConnection(config);
     const [rows, fields] = await connection.execute(query);
     //console.log(rows);
     if (rows.length != 0) {
          clientId = rows[0]['clientId'];
     }
     connection.end();
     return clientId;
}

async function AddNewСlientToDB(receivedFromForm) {
     let query = "INSERT INTO `clients` (`name`, `surname`, `patronymic`, `passportID`, `phoneNumber`) VALUES ('"
          + receivedFromForm.name + "', '" + receivedFromForm.surname + "', '" + receivedFromForm.patronymic + "', '"
          + receivedFromForm.passportID + "', '" + receivedFromForm.phoneNumber + "')";

     const connection = await mysql2.createConnection(config);
     const [rows, fields] = await connection.execute(query);
     connection.end();
     //     console.log("rows: ", rows);
     //     console.log("rows.insertId - 201", rows.insertId);
     return rows.insertId;
}

function formatDate(date) {
     var dd = date.getDate();
     if (dd < 10) dd = '0' + dd;

     var mm = date.getMonth() + 1;
     if (mm < 10) mm = '0' + mm;

     var yy = date.getFullYear();
     if (yy < 10) yy = '0' + yy;

     return yy + '-' + mm + '-' + dd;
}
async function AddNewOrderAdditionalToDB(orderId, carId, equipment) {
     let query = "INSERT INTO `ordersadditional` (`orderId`, `carId`, `equipment`) VALUES ('"
          + orderId + "', '" + carId + "', '" + equipment + "')";

     const connection = await mysql2.createConnection(config);
     const [rows, fields] = await connection.execute(query);
     connection.end();

     return rows.insertId;
}
async function AddNewOrderToDB(employeeId, clientId, receivedFromForm) {
     let query = "INSERT INTO `orders` (`carIds`, `clientId`, `employeeId`, `transactionAmount`, `orderDate`) VALUES ('"
          + receivedFromForm.carIDs + "', '" + clientId + "', '" + employeeId + "', '" + receivedFromForm.transactionAmount + "', '" + formatDate(new Date()) + "')";

     const connection = await mysql2.createConnection(config);
     const [rows, fields] = await connection.execute(query);
     connection.end();

     receivedFromForm.carIDs_Equipments.forEach((equipment, key, map) => {
          AddNewOrderAdditionalToDB(rows.insertId, key, equipment);
     });
     //     console.log("rows: ", rows);
     //     console.log("rows.insertId - 201", rows.insertId);
     return rows.insertId;
}

app.post('/writeOrderToDB', (request, response) => {
     let body = '';
     request.on('data', chunk => {
          body += chunk.toString();
     });
     request.on('end', async () => {
          //console.log(body);
          let receivedFromForm = JSON.parse(body);
          receivedFromForm.carIDs_Equipments = new Map(Object.entries(JSON.parse(receivedFromForm.carIDs_Equipments)));

          let clientId = await getСlientIdFromDB(receivedFromForm);
          if (clientId == -1)
               clientId = await AddNewСlientToDB(receivedFromForm);

          let employeeId = await getEmployeeIdFromDB(receivedFromForm.fullNameEmployee)
          console.log("clientId: ", clientId);
          console.log("employeeId: ", employeeId);

          let orderId = await AddNewOrderToDB(employeeId, clientId, receivedFromForm);
          console.log("orderId: ", orderId);
     });
});

app.get('/getEmployeesFromDB', (request, response) => {
     const connection = ConnectToDB(config);
     let query = "SELECT employeeId, fullName FROM employees";
     connection.query(query, (err, result, field) => {
          //console.log(err);
          response.send(result);
     });
     CloseConnectionToDB(connection);
});

app.get('/getEmployeeStatisticsFromDB', (request, response) => {
     const connection = ConnectToDB(config);
     let query = "SELECT * FROM employeestatistics";
     connection.query(query, (err, result, field) => {
          //console.log(err);
          response.send(result);
     });
     CloseConnectionToDB(connection);
});

app.post('/getEmployeeStatisticsForThePeriodFromDB', (request, response) => {
     let body = '';
     request.on('data', chunk => {
          body += chunk.toString();
     });
     request.on('end', async () => {
          //console.log(body);
          let receivedFromServer = JSON.parse(body);

          let query = "SELECT employeeId, COUNT(orderid) as numberOfSales, SUM(transactionAmount) as salesAmount FROM orders WHERE orderDate >= '" + receivedFromServer.startDate + "' AND orderDate <= '" + receivedFromServer.endDate + "'" + "GROUP BY employeeid";
          const connection = await mysql2.createConnection(config);
          const [rows, fields] = await connection.execute(query);
          //console.log(rows);
          response.send(rows);
          connection.end();

     });
});

app.get('/getCarsStatisticsFromDB', (request, response) => {
     const connection = ConnectToDB(config);
     let query = "SELECT carId, COUNT(orderId) as numberOfSales FROM ordersadditional GROUP BY carId";
     connection.query(query, (err, result, field) => {
          //console.log(err);
          response.send(result);
     });
     CloseConnectionToDB(connection);
});

app.post('/getCarsStatisticsForThePeriodFromDB', (request, response) => {
     let body = '';
     request.on('data', chunk => {
          body += chunk.toString();
     });
     request.on('end', async () => {
          let receivedFromServer = JSON.parse(body);
          let query = "SELECT ordersadditional.carId, count(ordersadditional.carId) as numberOfSales FROM ordersadditional JOIN orders ON ordersadditional.orderId = orders.orderId WHERE orders.orderDate >= '" + receivedFromServer.startDate + "' AND orders.orderDate <= '" + receivedFromServer.endDate + "' GROUP BY carId; ";
          const connection = await mysql2.createConnection(config);
          const [rows, fields] = await connection.execute(query);
          //console.log(rows);
          response.send(rows);
          connection.end();
     });
});

app.get('/getClientsFromDB', (request, response) => {
     const connection = ConnectToDB(config);
     let query = "SELECT clientId, name, surname, patronymic FROM clients;";
     connection.query(query, (err, result, field) => {
          //console.log(err);
          response.send(result);
     });
     CloseConnectionToDB(connection);
});

app.get('/getClientStatisticsFromDB', (request, response) => {
     const connection = ConnectToDB(config);
     let query = "SELECT clientId, COUNT(clientId) as numberOfOrders, SUM(transactionAmount) as ordersAmount FROM orders GROUP BY clientId";
     connection.query(query, (err, result, field) => {
          //console.log(err);
          response.send(result);
     });
     CloseConnectionToDB(connection);
});

app.post('/getClientStatisticsForThePeriodFromDB', (request, response) => {
     let body = '';
     request.on('data', chunk => {
          body += chunk.toString();
     });
     request.on('end', async () => {
          let receivedFromServer = JSON.parse(body);
          let query = "SELECT clientId, COUNT(clientId) as numberOfOrders, SUM(transactionAmount) as ordersAmount FROM orders WHERE orders.orderDate >= '" + receivedFromServer.startDate + "' AND orders.orderDate <= '" + receivedFromServer.endDate + "' GROUP BY clientId; ";
          const connection = await mysql2.createConnection(config);
          const [rows, fields] = await connection.execute(query);
          //console.log(rows);
          response.send(rows);
          connection.end();
     });
});

app.listen(3333, () => {
     console.log('Application listening on port 3333!');
});



const mysql = require("mysql");
const mysql2 = require("mysql2/promise");

function ConnectToDB(config) {
     const connection = mysql.createConnection(config);
     connection.connect(function (err) {
          if (err) {
               return console.error("Ошибка: " + err.message);
          }
          else {
               // console.log("Подключение к серверу MySQL успешно установлено");
          }
     });
     return connection;
}
function CloseConnectionToDB(connection) {
     connection.end(function (err) {
          if (err) {
               return console.log("Ошибка: " + err.message);
          }
          // console.log("Подключение закрыто");
     });
}


app.get('/getSumOfAllOrdersFromDB', async (request, response) => {
     let query = "SELECT SUM(transactionAmount) FROM orders";
     const connection = await mysql2.createConnection(config);
     const [rows, fields] = await connection.execute(query);
     response.send(rows[0]['SUM(transactionAmount)']);
     connection.end();

     //console.log("Сумма всех продаж за весь период", ;
});
app.post('/getSumOfAllOrdersForThePeriodFromDB', async (request, response) => {
     let body = '';
     request.on('data', chunk => {
          body += chunk.toString();
     });
     request.on('end', async () => {
          //console.log(body);
          let receivedFromServer = JSON.parse(body);

          let query = "SELECT SUM(transactionAmount) FROM orders WHERE orderDate >= '" + receivedFromServer.startDate + "' AND orderDate <= '" + receivedFromServer.endDate + "'";
          const connection = await mysql2.createConnection(config);
          const [rows, fields] = await connection.execute(query);
          response.send(rows[0]['SUM(transactionAmount)']);
          connection.end();
     });
});
