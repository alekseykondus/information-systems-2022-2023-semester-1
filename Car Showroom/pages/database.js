const http = require('http');
const fs = require('fs');

const config = require('./config');



http.createServer(function (request, response) {
     console.log(request.url);
     console.log(request.method);
     console.log("HIII");

     // response.setHeader("Content-Type", "text/html; charset=utf-8;")



     /*
          const mysql = require("mysql");
     
          const connection = mysql.createConnection(config);
     
          connection.connect(function (err) {
               if (err) {
                    return console.error("Ошибка: " + err.message);
               }
               else {
                    console.log("Подключение к серверу MySQL успешно установлено");
               }
          });
     
     
          let query = "SELECT * FROM cars";
     
     
          connection.query(query, (err, result, field) => {
               console.log(err);
               console.log(result);
               response.end(result[1]['name']);
               //console.log(field);
          });
     
          // закрытие подключения
          connection.end(function (err) {
               if (err) {
                    return console.log("Ошибка: " + err.message);
               }
               console.log("Подключение закрыто");
          });
          */


     //     if (request.url = "/index") {
     //          let myFile = fs.readFileSync("index.html")
     //          //     response.end(myFile);
     //     }

     if (request.url === '/') {

     }
     else if (request.url === '/hi') {
          console.log(request);

          let body = '';
          request.on('data', chunk => {
               body += chunk.toString();
          });
          request.on('end', () => {
               console.log(body);
          });
     }
}).listen(3000);



/*const http = require('http');
const fs = require('fs');
const path = require('path');
//var serveStatic = require('serve-static');
//var finalhandler = require('finalhandler')

//var serve = serveStatic("pages");
var server = http.createServer((request, response) => {
     //  serve(request, response, finalhandler(request, response));
     //   console.log(request.url);
     //console.log(request.url);
     //     if (request.url == "/price-list.html") {
     //   let myFile = fs.readFileSync("index.html")
     //     response.end("myFile");
     //     }
     response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
     //response.setHeader("Content-Type", "text/html; charset=utf-8;")

     console.log('request:' + request.url);
     if (request.url === '/') {
          sendRes('/index.html', 'text/html; charset=utf-8', response);
     }
     else if (request.url === '/price-list') {
          sendRes('/price-list', 'text/html; charset=utf-8', response);
     }
     else if (request.url === '/hi') {
          console.log(request.method);

          let body = '';
          request.on('data', chunk => {
               body += chunk.toString();
          });
          request.on('end', () => {
               console.log(body);
          });
     }
     else {
          sendRes(request.url, getContentType(request.url), response);
     }

}).listen(3000);

function sendRes(url, contentType, response) {
     console.log(__dirname + '/pages', url);
     let file = path.join(__dirname + '/pages', url);
     fs.readFile(file, (err, content) => {
          if (err) {
               response.writeHead(404);
               response.write('file not found');
               response.end();
               console.log('error 404 ${file}');
          }
          else {
               response.writeHead(200, { 'Content-Type': contentType });
               response.end(content, 'utf-8');
          }
     })
}

let Result = db();

function db() {
     let Result;
     const mysql = require("mysql");

     const connection = mysql.createConnection({
          host: "localhost",
          user: "root",
          database: "deluxeauto",
          password: "password"
     });

     connection.connect(function (err) {
          if (err) {
               return console.error("Ошибка: " + err.message);
          }
          else {
               console.log("Подключение к серверу MySQL успешно установлено");
          }
     });


     let query = "SELECT * FROM cars";


     connection.query(query, (err, result, field) => {
          console.log(err);
          //    console.log(result);
          Result = result;
          //response.end(result[1]['name']);
          //console.log(field);
     });

     // закрытие подключения
     connection.end(function (err) {
          if (err) {
               return console.log("Ошибка: " + err.message);
          }
          console.log("Подключение закрыто");
     });
     return Result;
}

function getContentType(url) {
     switch (path.extname(url)) {
          case ".html":
               return "test/html";
          case ".css":
               return "test/css";
          case ".js":
               return "test/js";
          case ".json":
               return "test/json";
          default:
               return "application/octate-stream";
     }
}

/*
http.createServer(function (request, response) {
     console.log(request.url);
     console.log(request.method);
     console.log("HIII");

     response.setHeader("Content-Type", "text/html; charset=utf-8;")



     if (request.url = "/index") {
          let myFile = fs.readFileSync("index.html")
          response.end(myFile);
     }
}).listen(3000);
*/
