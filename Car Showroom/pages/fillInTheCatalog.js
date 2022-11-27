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

fetch('/getCarsFromDBToIndex', {
     method: 'GET',
})
     .then(res => res.text())
     .then(res => {
          typeof (res);
          let carsTable = JSON.parse(res);
          for (let i = 0; i < carsTable.length; i++) {
               var carId = carsTable[i]['carId'];
               CreateElement("div", "car-" + carId, "", "catalog").classList.add("product", "text-center");
               CreateElement("div", "img-Car-" + carId, "", "car-" + carId).classList.add("product-img", "mt-2", "border", "mx-auto");
               console.log("photo: ", carsTable[i]['pathToPhoto']);
               document.getElementById("img-Car-" + carId).setAttribute('style', "  background-image: url(images/" + carsTable[i]['pathToPhoto'] + ");");
               CreateElement("div", "name-Car-" + carId, carsTable[i]['name'], "car-" + carId).classList.add("product-name", "mt-3", "text-light", "font-weight-bolder");
               CreateElement("div", "description1-Car-" + carId, "Обьём двигателя: " + carsTable[i]['engineVolume'] + "\n Коробка передачь: " + carsTable[i]['transmission'], "car-" + carId).classList.add("product-description", "w-100", "p-3", "text-light");
               CreateElement("div", "price-Car" + carId, carsTable[i]['price'].toLocaleString(), "car-" + carId).classList.add("product-price", "text-light", "font-weight-bolder");
               if (carsTable[i]['inStock'] == "0") {
                    console.log(carsTable[i]['name']);
                    document.getElementById("car-" + carId).setAttribute('style', "filter: blur(1px);");
               }
               else {

                    CreateElement("button", carId, "", "car-" + carId).classList.add("add-car", "btn", "btn-secondary", "mt-n3", "mr-2", "pb-1", "position-relative", "float-right");
                    document.getElementById(carId).setAttribute('type', "button");
                    document.getElementById(carId).setAttribute('style', "z-index: 3");
                    CreateElement("img", carId, "", carId).classList.add("add-car");
                    var imgCart = document.getElementById(carId).getElementsByClassName("add-car")[0];
                    imgCart.setAttribute('src', "images/shoping.png");
                    imgCart.setAttribute('width', "20px");
                    imgCart.setAttribute('height', "20px");
               }
          }
     });

/*
CreateElement("div", "car-1", "", "catalog").classList.add("product", "text-center");
CreateElement("div", "img-Car-1", "", "car-1").classList.add("product-img", "mt-2", "border", "mx-auto");
document.getElementById("img-Car-1").setAttribute('style', "  background-image: url(images/Tesla_Roadster.jpg);");
CreateElement("div", "name-Car-1", "LAMBORGHINI SIAN", "car-1").classList.add("product-name", "mt-3", "text-light", "font-weight-bolder");
CreateElement("div", "description1-Car-1", "Обьём двигателя: 5.5 \n Коробра передачь: автомат", "car-1").classList.add("product-description", "w-100", "p-3", "text-light");
CreateElement("div", "price-Car1", "111111", "car-1").classList.add("product-price", "text-light", "font-weight-bolder");
CreateElement("button", "20", "", "car-1").classList.add("add-car", "btn", "btn-secondary", "mt-n3", "mr-2", "pb-1", "position-relative", "float-right");
document.getElementById("20").setAttribute('type', "button");
document.getElementById("20").setAttribute('style', "z-index: 3");
CreateElement("img", "20", "", "20").classList.add("add-car");
var imgCart = document.getElementById("20").getElementsByClassName("add-car")[0];
imgCart.setAttribute('src', "images/shoping.png");
imgCart.setAttribute('width', "20px");
imgCart.setAttribute('height', "20px");
*/