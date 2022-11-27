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

let table = document.getElementById("cars-table");

/*
CreateElement("tbody", "tbody", "", "cars-table")
CreateElement("tr", "tr1", "", "tbody")
CreateElement("td", "tr1-td1", "1", "tr1")
CreateElement("td", "tr1-td2", "LAMBORGHINI SIAN", "tr1")
CreateElement("td", "tr1-td3", "3 600 000", "tr1")
*/

//console.log(Result)


function FillInTheTable() {
     console.log("Server Request start");

     CreateElement("tbody", "tbody", "", "cars-table")
     fetch('/getCarsFromDB', {
          method: 'GET',
     })
          .then(res => res.text())
          .then(res => {
               let carsTable = JSON.parse(res);
               for (let i = 0; i < carsTable.length; i++) {
                    CreateElement("tr", "tr" + i, "", "tbody")
                    CreateElement("td", "tr" + i + "-td1", carsTable[i]['carId'], "tr" + i)
                    CreateElement("td", "tr" + i + "-td2", carsTable[i]['name'], "tr" + i)
                    CreateElement("td", "tr" + i + "-td3", carsTable[i]['price'].toLocaleString(), "tr" + i)
               }
          });

     /*
          let xhr = new XMLHttpRequest();
          xhr.open('POST', 'hi', true);
          xhr.onreadystatechange = function () {
               if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                         console.log("success");
                    }
                    else {
                         console.log("error");
                    }
               }
          }
          xhr.send();*/
}
FillInTheTable();