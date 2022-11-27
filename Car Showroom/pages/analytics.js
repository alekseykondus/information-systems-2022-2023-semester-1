function CreateElement(nameElement, idElement, innerText, parentId) {
     let element = document.createElement(nameElement);
     element.id = idElement;
     element.innerText = innerText;
     if (parentId == "body")
          document.body.appendChild(element);
     else
          document.getElementById(parentId).appendChild(element);
     return element;
}

function FillInEmployeesTable(startDate = 0, endDate = 0, notOnLoad = 0) {

     if (startDate == 0 && endDate == 0 && notOnLoad == 0) { //при загрузке страницы
          CreateElement("h2", "h2-employees", "Таблица статистики работников", "main-products-container").classList.add("text-center");
          CreateElement("table", "employees-table", "", "main-products-container").classList.add("table", "table-striped", "table-hover");
          CreateElement("thead", "thead", "", "employees-table")
          CreateElement("tr", "tr1", "", "thead")
          CreateElement("td", "thead-tr1-td1", "Id сотрудника", "tr1").classList.add("text-center", "w-15");
          CreateElement("td", "thead-tr1-td2", "Полное имя", "tr1");
          CreateElement("td", "thead-tr1-td3", "Количество продаж", "tr1").classList.add("text-center");
          CreateElement("td", "thead-tr1-td4", "Общая сумма продаж", "tr1").classList.add("text-center");

          CreateElement("tbody", "tbody", "", "employees-table")
          fetch('/getEmployeesFromDB', {
               method: 'GET',
          })
               .then(res1 => res1.text())
               .then(res1 => {
                    let employees = JSON.parse(res1);

                    fetch('/getEmployeeStatisticsFromDB', {
                         method: 'GET',
                    })
                         .then(res2 => res2.text())
                         .then(res2 => {
                              let employeeStatisticsTable = JSON.parse(res2);
                              for (let i = 0; i < employeeStatisticsTable.length; i++) {
                                   CreateElement("tr", "tr" + i + "-body", "", "tbody")
                                   CreateElement("td", "tr" + employeeStatisticsTable[i]['employeeId'] + "-td1", employeeStatisticsTable[i]['employeeId'], "tr" + i + "-body").classList.add("text-center");
                                   CreateElement("td", "tr" + employeeStatisticsTable[i]['employeeId'] + "-td2", employees[i]['fullName'], "tr" + i + "-body")
                                   CreateElement("td", "tr" + employeeStatisticsTable[i]['employeeId'] + "-td3", employeeStatisticsTable[i]['numberOfSales'], "tr" + i + "-body").classList.add("text-center");
                                   CreateElement("td", "tr" + employeeStatisticsTable[i]['employeeId'] + "-td4", employeeStatisticsTable[i]['salesAmount'].toLocaleString(), "tr" + i + "-body").classList.add("text-center");
                              }
                         });
               });
     }
     else if (notOnLoad == 0) { // при изменении даты в периоде
          //         CreateElement("tbody", "tbody", "", "employees-table")
          fetch('/getEmployeesFromDB', {
               method: 'GET',
          })
               .then(res1 => res1.text())
               .then(res1 => {
                    let employees = JSON.parse(res1);
                    for (let i = 0; i < employees.length; i++) {
                         if (document.getElementById("tr" + employees[i]['employeeId'] + "-td3"))
                              document.getElementById("tr" + employees[i]['employeeId'] + "-td3").innerText = 0;
                         if (document.getElementById("tr" + employees[i]['employeeId'] + "-td4"))
                              document.getElementById("tr" + employees[i]['employeeId'] + "-td4").innerText = 0;
                    }

                    fetch('/getEmployeeStatisticsForThePeriodFromDB', {
                         method: 'POST',
                         body: JSON.stringify({
                              "startDate": startDate,
                              "endDate": endDate,
                         })
                    })
                         .then(res2 => res2.text())
                         .then(res2 => {
                              let employeeStatisticsTable = JSON.parse(res2);
                              for (let i = 0; i < employeeStatisticsTable.length; i++) {
                                   document.getElementById("tr" + employeeStatisticsTable[i]['employeeId'] + "-td3").innerText = employeeStatisticsTable[i]['numberOfSales'];
                                   document.getElementById("tr" + employeeStatisticsTable[i]['employeeId'] + "-td4").innerText = parseInt(employeeStatisticsTable[i]['salesAmount']).toLocaleString();
                              }
                         });
               });
     }
     else if (notOnLoad == 1) { // при возврате на весь период
          fetch('/getEmployeesFromDB', {
               method: 'GET',
          })
               .then(res1 => res1.text())
               .then(res1 => {
                    let employees = JSON.parse(res1);
                    for (let i = 0; i < employees.length; i++) {
                         document.getElementById("tr" + employees[i]['employeeId'] + "-td3").innerText = 0;
                         document.getElementById("tr" + employees[i]['employeeId'] + "-td4").innerText = 0;
                    }

                    fetch('/getEmployeeStatisticsFromDB', {
                         method: 'GET',
                    })
                         .then(res2 => res2.text())
                         .then(res2 => {
                              let employeeStatisticsTable = JSON.parse(res2);
                              for (let i = 0; i < employees.length; i++) {
                                   document.getElementById("tr" + employeeStatisticsTable[i]['employeeId'] + "-td3").innerText = employeeStatisticsTable[i]['numberOfSales'];
                                   document.getElementById("tr" + employeeStatisticsTable[i]['employeeId'] + "-td4").innerText = employeeStatisticsTable[i]['salesAmount'].toLocaleString();
                              }
                         });
               });
     }
}

function FillInCarsStatisticsTable(startDate = 0, endDate = 0, notOnLoad = 0) {
     if (startDate == 0 && endDate == 0 && notOnLoad == 0) { //при загрузке страницы
          CreateElement("h2", "h2-cars-statistics", "Таблица статистики машин", "main-products-container").classList.add("text-center");
          CreateElement("table", "cars-statistics-table", "", "main-products-container").classList.add("table", "table-striped", "table-hover");
          CreateElement("thead", "cars-statistics-thead", "", "cars-statistics-table")
          CreateElement("tr", "cars-statistics-tr1", "", "cars-statistics-thead")
          CreateElement("td", "cars-statistics-thead-tr1-td1", "Id машины", "cars-statistics-tr1").classList.add("text-center");
          CreateElement("td", "cars-statistics-thead-tr1-td2", "Название", "cars-statistics-tr1").classList.add("text-center");
          CreateElement("td", "cars-statistics-thead-tr1-td3", "Количество проданых", "cars-statistics-tr1").classList.add("text-center");
          CreateElement("td", "cars-statistics-thead-tr1-td4", "Общая сумма продаж", "cars-statistics-tr1").classList.add("text-center");

          CreateElement("tbody", "cars-statistics-tbody", "", "cars-statistics-table")

          fetch('/getCarsFromDB', {
               method: 'GET',
          })
               .then(result1 => result1.text())
               .then(result1 => {
                    let carsTable = JSON.parse(result1);

                    fetch('/getCarsStatisticsFromDB', {
                         method: 'GET',
                    })
                         .then(result2 => result2.text())
                         .then(result2 => {
                              let carsStatisticsTable = JSON.parse(result2);
                              for (let i = 0; i < carsStatisticsTable.length; i++) {
                                   CreateElement("tr", "cars-statistics-tr" + i + "-body", "", "cars-statistics-tbody")
                                   CreateElement("td", "cars-statistics-tr" + carsStatisticsTable[i]['carId'] + "-td1", carsStatisticsTable[i]['carId'], "cars-statistics-tr" + i + "-body").classList.add("text-center");
                                   CreateElement("td", "cars-statistics-tr" + carsStatisticsTable[i]['carId'] + "-td2", carsTable[carsStatisticsTable[i]['carId'] - 1]['name'], "cars-statistics-tr" + i + "-body")
                                   CreateElement("td", "cars-statistics-tr" + carsStatisticsTable[i]['carId'] + "-td3", carsStatisticsTable[i]['numberOfSales'], "cars-statistics-tr" + i + "-body").classList.add("text-center");
                                   CreateElement("td", "cars-statistics-tr" + carsStatisticsTable[i]['carId'] + "-td4", (carsStatisticsTable[i]['numberOfSales'] * carsTable[carsStatisticsTable[i]['carId'] - 1]['price']).toLocaleString(), "cars-statistics-tr" + i + "-body").classList.add("text-center");
                              }
                         });
               });

     }
     else if (notOnLoad == 0) { // при изменении даты в периоде

          fetch('/getCarsFromDB', {
               method: 'GET',
          })
               .then(result1 => result1.text())
               .then(result1 => {
                    let carsTable = JSON.parse(result1);
                    for (let i = 0; i < carsTable.length; i++) {
                         if (document.getElementById("cars-statistics-tr" + carsTable[i]['carId'] + "-td3"))
                              document.getElementById("cars-statistics-tr" + carsTable[i]['carId'] + "-td3").innerText = 0;
                         if (document.getElementById("cars-statistics-tr" + carsTable[i]['carId'] + "-td4"))
                              document.getElementById("cars-statistics-tr" + carsTable[i]['carId'] + "-td4").innerText = 0;
                    }

                    fetch('/getCarsStatisticsForThePeriodFromDB', {
                         method: 'POST',
                         body: JSON.stringify({
                              "startDate": startDate,
                              "endDate": endDate,
                         })
                    })
                         .then(result2 => result2.text())
                         .then(result2 => {
                              let carsStatisticsTable = JSON.parse(result2);
                              for (let i = 0; i < carsStatisticsTable.length; i++) {
                                   document.getElementById("cars-statistics-tr" + carsStatisticsTable[i]['carId'] + "-td3").innerText = carsStatisticsTable[i]['numberOfSales'];
                                   document.getElementById("cars-statistics-tr" + carsStatisticsTable[i]['carId'] + "-td4").innerText = (carsStatisticsTable[i]['numberOfSales'] * carsTable[carsStatisticsTable[i]['carId'] - 1]['price']).toLocaleString();
                              }
                         });
               });
     }
     else if (notOnLoad == 1) { // при возврате на весь период
          fetch('/getCarsFromDB', {
               method: 'GET',
          })
               .then(result1 => result1.text())
               .then(result1 => {
                    let carsTable = JSON.parse(result1);
                    fetch('/getCarsStatisticsFromDB', {
                         method: 'GET',
                    })
                         .then(result2 => result2.text())
                         .then(result2 => {
                              let carsStatisticsTable = JSON.parse(result2);
                              for (let i = 0; i < carsStatisticsTable.length; i++) {
                                   document.getElementById("cars-statistics-tr" + carsStatisticsTable[i]['carId'] + "-td3").innerText = carsStatisticsTable[i]['numberOfSales'];
                                   document.getElementById("cars-statistics-tr" + carsStatisticsTable[i]['carId'] + "-td4").innerText = (carsStatisticsTable[i]['numberOfSales'] * carsTable[carsStatisticsTable[i]['carId'] - 1]['price']).toLocaleString();
                              }
                         });
               });
     }
}

function FillInClientsStatisticsTable(startDate = 0, endDate = 0, notOnLoad = 0) {
     if (startDate == 0 && endDate == 0 && notOnLoad == 0) { //при загрузке страницы
          CreateElement("h2", "h2-clients", "Таблица статистики клиентов", "main-products-container").classList.add("text-center");
          CreateElement("table", "clients-table", "", "main-products-container").classList.add("table", "table-striped", "table-hover");
          CreateElement("thead", "clients-thead", "", "clients-table")
          CreateElement("tr", "clients-tr1", "", "clients-thead")
          CreateElement("td", "clients-thead-tr1-td1", "Id клиента", "clients-tr1").classList.add("text-center", "w-15");
          CreateElement("td", "clients-thead-tr1-td2", "Полное имя", "clients-tr1");
          CreateElement("td", "clients-thead-tr1-td3", "Количество покупок", "clients-tr1").classList.add("text-center");
          CreateElement("td", "clients-thead-tr1-td4", "Протраченая сумма", "clients-tr1").classList.add("text-center");

          CreateElement("tbody", "clients-tbody", "", "clients-table")
          fetch('/getClientsFromDB', {
               method: 'GET',
          })
               .then(result1 => result1.text())
               .then(result1 => {
                    let clients = JSON.parse(result1);
                    fetch('/getClientStatisticsFromDB', {
                         method: 'GET',
                    })
                         .then(result2 => result2.text())
                         .then(result2 => {
                              let clientStatisticsTable = JSON.parse(result2);
                              for (let i = 0; i < clientStatisticsTable.length; i++) {
                                   CreateElement("tr", "clients-tr" + i + "-body", "", "clients-tbody")
                                   CreateElement("td", "clients-tr" + clientStatisticsTable[i]['clientId'] + "-td1", clients[i]['clientId'], "clients-tr" + i + "-body").classList.add("text-center");
                                   CreateElement("td", "clients-tr" + clientStatisticsTable[i]['clientId'] + "-td2", clients[i]['surname'] + ' ' + clients[i]['name'] + ' ' + clients[i]['patronymic'], "clients-tr" + i + "-body")
                                   CreateElement("td", "clients-tr" + clientStatisticsTable[i]['clientId'] + "-td3", clientStatisticsTable[i]['numberOfOrders'], "clients-tr" + i + "-body").classList.add("text-center");
                                   CreateElement("td", "clients-tr" + clientStatisticsTable[i]['clientId'] + "-td4", clientStatisticsTable[i]['ordersAmount'].toLocaleString(), "clients-tr" + i + "-body").classList.add("text-center");
                              }
                         });
               });
     }
     else if (notOnLoad == 0) { // при изменении даты в периоде
          fetch('/getClientsFromDB', {
               method: 'GET',
          })
               .then(result1 => result1.text())
               .then(result1 => {
                    let clients = JSON.parse(result1);
                    for (let i = 0; i < clients.length; i++) {
                         if (document.getElementById("clients-tr" + clients[i]['clientId'] + "-td3"))
                              document.getElementById("clients-tr" + clients[i]['clientId'] + "-td3").innerText = 0;
                         if (document.getElementById("clients-tr" + clients[i]['clientId'] + "-td4"))
                              document.getElementById("clients-tr" + clients[i]['clientId'] + "-td4").innerText = 0;
                    }

                    fetch('/getClientStatisticsForThePeriodFromDB', {
                         method: 'POST',
                         body: JSON.stringify({
                              "startDate": startDate,
                              "endDate": endDate,
                         })
                    })
                         .then(result2 => result2.text())
                         .then(result2 => {
                              let clientStatisticsTable = JSON.parse(result2);
                              for (let i = 0; i < clientStatisticsTable.length; i++) {
                                   document.getElementById("clients-tr" + clientStatisticsTable[i]['clientId'] + "-td3").innerText = clientStatisticsTable[i]['numberOfOrders'];
                                   document.getElementById("clients-tr" + clientStatisticsTable[i]['clientId'] + "-td4").innerText = parseInt(clientStatisticsTable[i]['ordersAmount']).toLocaleString();
                              }
                         });
               });
     }
     else if (notOnLoad == 1) { // при возврате на весь период
          fetch('/getClientsFromDB', {
               method: 'GET',
          })
               .then(result1 => result1.text())
               .then(result1 => {
                    let clients = JSON.parse(result1);
                    fetch('/getClientStatisticsFromDB', {
                         method: 'GET',
                    })
                         .then(result2 => result2.text())
                         .then(result2 => {
                              let clientStatisticsTable = JSON.parse(result2);
                              for (let i = 0; i < clientStatisticsTable.length; i++) {
                                   document.getElementById("clients-tr" + clientStatisticsTable[i]['clientId'] + "-td3").innerText = clientStatisticsTable[i]['numberOfOrders'];
                                   document.getElementById("clients-tr" + clientStatisticsTable[i]['clientId'] + "-td4").innerText = parseInt(clientStatisticsTable[i]['ordersAmount']).toLocaleString();
                              }
                         });
               });
     }
}

function FillInTables(startDate = 0, endDate = 0, notOnLoad = 0) {
     FillInEmployeesTable(startDate, endDate, notOnLoad);
     FillInCarsStatisticsTable(startDate, endDate, notOnLoad);
     FillInClientsStatisticsTable(startDate, endDate, notOnLoad);
}

function OnChangeDates() {
     var startDate = document.getElementById("start-date").value;
     var endDate = document.getElementById("end-date").value;

     fetch('/getSumOfAllOrdersForThePeriodFromDB', {
          method: 'POST',
          body: JSON.stringify({
               "startDate": startDate,
               "endDate": endDate,
          })
     })
          .then(result => result.text())
          .then(result => {
               document.getElementById("b-sales-amount").innerText = "Сумма всех продаж за период с " + startDate + " по " + endDate + " составляет: " + result;
          });
     FillInTables(startDate, endDate);
}

function PeriodChanged() {
     if (document.getElementById("period").value === "Весь период") {
          fetch('/getSumOfAllOrdersFromDB', {
               method: 'GET',
          })
               .then(result => result.text())
               .then(result => {
                    if (document.getElementById("b-sales-amount") == undefined)
                         CreateElement("b", "b-sales-amount", "Сумма всех продаж за весь период " + result, "sales-amount").setAttribute('style', "font-size: 1.5em;");
                    else
                         document.getElementById("b-sales-amount").innerText = "Сумма всех продаж за весь период: " + result;
               });
          if (document.getElementById("start-date-div") == undefined)
               FillInTables();
          else {
               document.getElementById("start-date-div").remove();
               document.getElementById("end-date-div").remove();
               FillInTables(0, 0, 1);
          }
     }
     else if (document.getElementById("period").value === "Определённый период") {
          if (!document.getElementById("start-date")) {
               CreateElement("div", "start-date-div", "", "periodStartEnd").classList.add("col-md-4", "mb-3");
               CreateElement("label", "start-date-label", "Начальная дата: ", "start-date-div").setAttribute('style', "font-size: 1.4em;");
               document.getElementById("start-date-label").classList.add("pt-3");
               CreateElement("input", "start-date", "", "start-date-div").classList.add("form-control");
               document.getElementById("start-date").setAttribute('type', "date");
               document.getElementById("start-date").value = "2022-11-01";
               document.getElementById("start-date").setAttribute('onchange', "OnChangeDates()");

               CreateElement("div", "end-date-div", "", "periodStartEnd").classList.add("col-md-4", "mb-3");
               CreateElement("label", "end-date-label", "Конечная дата: ", "end-date-div").setAttribute('style', "font-size: 1.4em;");
               document.getElementById("end-date-label").classList.add("pt-3");
               CreateElement("input", "end-date", "2022-11-01", "end-date-div").classList.add("form-control");
               document.getElementById("end-date").setAttribute('type', "date");
               document.getElementById("end-date").value = "2022-11-30";
               document.getElementById("end-date").setAttribute('onchange', "OnChangeDates()");
          }
          OnChangeDates();
     }
}

PeriodChanged();