let cart = {}
let carName;
// = ["LAMBORGHINI SIAN", "TESLA ROADSTER", "RENAULT ALPHINE", "CHEVROLET CORVETTE", "MERCEDES AMG ONE", "BUGATTI DIVO", "HONDA NSX", "SUBARU BRZ", "AUDIi E-TRON GT", "KIA STINGER", "BMW M4", "BENTLEY BENTAYGA"];
let carPrice;
// = [3600000, 400000, 270000, 110000, 2700000, 5800000, 320000, 90000, 205000, 95000, 280000, 710000];

fetch('/getCarNamesFromDB', {
     method: 'GET',
})
     .then(result => result.text())
     .then(result => { carName = JSON.parse(result); });

fetch('/getCarPricesFromDB', {
     method: 'GET',
})
     .then(result => result.text())
     .then(result => { carPrice = JSON.parse(result); });

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

document.onclick = (event) => {
     if (event.target.classList.contains('add-car')) {
          console.log(event.target.id);
          addCar(event.target.id, carName[event.target.id - 1].name, "product-img" + event.target.id, carPrice[event.target.id - 1].price);
          alert("Товар добавлен в корзину!");
     }
     else if (event.target.classList.contains('plus')) {
          console.log(event.target.id);
          plusFunction(event.target.id);
          saveData();
          changeRenderCart(event.target.id);
     }
     else if (event.target.classList.contains('minus')) {
          console.log(event.target.id);
          minusFunction(event.target.id);
          saveData();
          console.log(JSON.parse(localStorage.getItem('cart')) || []);
          changeRenderCart(event.target.id);
     }
}

function buttonCheckoutSubmitOnClickAndWriteOrderToDB() {
     try {
          const fullNameEmployee = document.getElementById('form-empl-select').value;
          const name = document.getElementById('form-name-input').value;
          const surname = document.getElementById('form-surname-input').value;
          const patronymic = document.getElementById('form-patronymic-input').value;
          const passportID = document.getElementById('form-passportID-input').value;
          const tel = document.getElementById('form-tel-input').value;
          //     if (!name || !surname || !patronymic || !tel) {
          //          alert('Пожалуйста, заполните все обязательные поля! ');
          //          return false;
          //     }
          let carIDs = "";
          // let carIDs_Equipments = [];
          let carIDs_Equipments = new Map();

          let ids = Object.keys(cart);
          ids.forEach(element => {
               carIDs_Equipments.set(element, document.getElementById("carEquipment-select" + element).value);

               if (element == ids[ids.length - 1])
                    carIDs += element;
               else
                    carIDs += element + ",";
          });
          fetch('/writeOrderToDB', {
               method: 'POST',
               body: JSON.stringify({
                    "fullNameEmployee": fullNameEmployee,
                    "carIDs": carIDs,
                    "carIDs_Equipments": JSON.stringify(Object.fromEntries(carIDs_Equipments)),
                    "name": name,
                    "surname": surname,
                    "patronymic": patronymic,
                    "passportID": passportID,
                    "phoneNumber": tel,
                    "transactionAmount": calculateThePrice(),
               })
          })
               .then(res => res.text())
               .then(res => console.log(res));
          cart = {};
          saveData();
          cartIsEmpty();
          document.getElementById("cart-body").remove();
          //очищаем cart ///
          buttonCheckoutCloseOnClick();
          alert("Заказ успешно отравлен!");
          return true;
     }
     catch (err) {
          alert(err);
          return false;
     }
}

function buttonCheckoutCloseOnClick() {
     document.getElementById("div-Checkout").remove();
}

function addOptions() {
     fetch('/getEmployeesFromDB', {
          method: 'GET',
     })
          .then(res => res.text())
          .then(res => {
               let employeesTable = JSON.parse(res);
               console.log(employeesTable);
               for (let i = 0; i < employeesTable.length; i++)
                    CreateElement("option", "form-empl-option-" + i, employeesTable[i].fullName, "form-empl-select");
          });
}

function buttonCheckoutOnClick() {
     CreateElement("div", "div-Checkout", "", "body").classList.add("checkout", "w-100", "h-100", "position-fixed", "d-flex",
          "flex-wrap", "justify-content-center");

     CreateElement("div", "div-Checkout-Background", "", "div-Checkout").classList.add("checkout-background", "w-100", "h-100", "position-absolute",
          "bg-secondary");
     CreateElement("div", "div-Checkout-item", "", "div-Checkout").classList.add("checkout-item", "d-block", "bg-white", "px-5", "mx-auto");

     CreateElement("div", "div-Checkout-close", "", "div-Checkout-item").classList.add("d-flex", "justify-content-end", "ml-5", "w-100");
     document.getElementById("div-Checkout-close").setAttribute('onclick', "buttonCheckoutCloseOnClick()");
     CreateElement("div", "div-close", "", "div-Checkout-close").classList.add("feedback-close-item", "bg-white");
     CreateElement("div", "close", "", "div-close").classList.add("close", "position-relative");

     CreateElement("h1", "div-Checkout-header", "Оформление заказа", "div-Checkout-item").classList.add("text-center", "font-weight-bolder", "mb-2");

     CreateElement("form", "form", "", "div-Checkout-item");

     CreateElement("div", "form-element-empl", "", "form").classList.add("mb-3");
     CreateElement("label", "form-empl-label", "Работник *", "form-element-empl").classList.add("form-label");
     CreateElement("select", "form-empl-select", "", "form-element-empl").classList.add("form-control");
     addOptions();

     CreateElement("div", "form-element-name", "", "form").classList.add("mb-3");
     CreateElement("label", "form-name-label", "Имя *", "form-element-name").classList.add("form-label");
     CreateElement("input", "form-name-input", "", "form-element-name").classList.add("form-control");
     document.getElementById("form-name-input").setAttribute('type', "name");

     CreateElement("div", "form-element-surname", "", "form").classList.add("mb-3");
     CreateElement("label", "form-surname-label", "Фамилия *", "form-element-surname").classList.add("form-label");
     CreateElement("input", "form-surname-input", "", "form-element-surname").classList.add("form-control");
     document.getElementById("form-name-input").setAttribute('type', "name");

     CreateElement("div", "form-element-patronymic", "", "form").classList.add("mb-3");
     CreateElement("label", "form-patronymic-label", "Отчество *", "form-element-patronymic").classList.add("form-label");
     CreateElement("input", "form-patronymic-input", "", "form-element-patronymic").classList.add("form-control");
     document.getElementById("form-patronymic-input").setAttribute('type', "name");

     CreateElement("div", "form-element-passportID", "", "form").classList.add("mb-3");
     CreateElement("label", "form-passportID-label", "Номер паспорта *", "form-element-passportID").classList.add("form-label");
     CreateElement("input", "form-passportID-input", "", "form-element-passportID").classList.add("form-control");
     document.getElementById("form-passportID-input").setAttribute('type', "name");

     CreateElement("div", "form-element-tel", "", "form").classList.add("mb-3");
     CreateElement("label", "form-tel-label", "Телефон *", "form-element-tel").classList.add("form-label");
     CreateElement("input", "form-tel-input", "", "form-element-tel").classList.add("form-control");
     document.getElementById("form-tel-input").setAttribute('type', "number");

     /*     CreateElement("div", "form-element-delivery", "", "form").classList.add("mb-3", "btn-group");
          CreateElement("label", "form-delivery-label", "Способ доставки *   ", "form-element-delivery").classList.add("form-label", "mr-3");
          CreateElement("input", "form-delivery-input-1", "", "form-element-delivery").classList.add("d-none", "btn-check");
          document.getElementById("form-delivery-input-1").setAttribute('type', "radio");
     
          CreateElement("label", "form-delivery-label-1", "Самовывоз", "form-element-delivery").classList.add("btn", "btn-outline-primary");
          document.getElementById("form-delivery-label-1").setAttribute('for', "form-delivery-input-1");
     
          CreateElement("input", "form-delivery-input-2", "", "form-element-delivery").classList.add("d-none", "btn-check");
          document.getElementById("form-delivery-input-2").setAttribute('type', "radio");
          CreateElement("label", "form-delivery-label-2", "Доставка домой", "form-element-delivery").classList.add("btn", "btn-outline-primary");
          document.getElementById("form-delivery-label-2").setAttribute('for', "form-delivery-input-2");*/

     CreateElement("div", "totalPrice", "Общая цена: " + calculateThePrice().toLocaleString() + " $", "div-Checkout-item").classList.add("h3", "mt-n3", "text-center");

     CreateElement("button", "form-button-submit", "Отправить", "div-Checkout-item").classList.add("btn", "btn-primary", "mx-auto", "w-100");
     document.getElementById("form-button-submit").setAttribute('type', "submit");
     document.getElementById("form-button-submit").setAttribute('onclick', "buttonCheckoutSubmitOnClickAndWriteOrderToDB()");
}
function addCar(id, name, classImg, price) {
     if (!cart[id]) {
          cart[id] = {
               "name": name,
               "classImg": classImg,
               "count": 0,
               "price": price,
          };
          plusFunction(id);
          saveData();
          console.log(JSON.parse(localStorage.getItem('cart')) || []);
     }
}

const plusFunction = (id) => {
     cart[id]['count']++;
}

const minusFunction = (id) => {
     if (cart[id]['count'] - 1 == 0) {
          deleteFunction(id);
          return;
     }
     cart[id]['count']--;
}

const deleteFunction = (id) => {
     cart = JSON.parse(localStorage.getItem('cart')) || [];
     delete cart[id];
     if (document.getElementById("cart-div") != undefined)
          document.getElementById("car" + id).remove();
}


function isEmpty(obj) {
     for (var prop in obj) {
          if (prop != null)
               return false;
     }
     return true;
}
const calculateThePrice = () => {
     let result = 0;
     cart = JSON.parse(localStorage.getItem('cart')) || [];
     if (isEmpty(cart))
          return result;
     for (var element in cart) {
          if (cart[element] != null)
               result += cart[element]['count'] * cart[element]["price"];
     }
     return result;
}

const renderCart = () => {
     if (document.getElementById("cart-div") == undefined)
          return;

     let price = calculateThePrice();
     if (document.getElementById("cart-header") == undefined) {
          cart = JSON.parse(localStorage.getItem('cart')) || [];
          console.log(cart);
          CreateElement("div", "cart-header", "", "cart-div").classList.add("row", "w-100", "ml-0");
          CreateElement("div", "id", "ID", "cart-header").classList.add("col-1", "text-center");
          CreateElement("div", "img", "Фото", "cart-header").classList.add("col-3", "text-center");
          CreateElement("div", "name", "Название машины", "cart-header").classList.add("col-3", "text-center");
          CreateElement("div", "equipment", "Комплектация", "cart-header").classList.add("col-3", "text-center");
          CreateElement("div", "price", "Цена", "cart-header").classList.add("col-2", "text-center");

          CreateElement("div", "cart-body", "", "cart-div").classList.add("row", "w-100", "ml-0");
          for (element in cart) {
               if (cart[element] != null) {
                    CreateElement("div", "car" + element, "", "cart-body").classList.add("row", "w-100", "ml-0", "py-2");
                    CreateElement("div", "carId" + element, element, "car" + element).classList.add("col-1", "text-center", "m-auto");
                    CreateElement("div", "carImg" + element, "", "car" + element).classList.add("col-3", "product-img", cart[element]["classImg"]);
                    CreateElement("div", "carName" + element, cart[element]["name"], "car" + element).classList.add("col-3", "h4", "text-center", "m-auto");
                    CreateElement("div", "carEquipment-div" + element, "", "car" + element).classList.add("col-3", "text-center", "m-auto");
                    CreateElement("select", "carEquipment-select" + element, "", "carEquipment-div" + element).classList.add("form-control");
                    CreateElement("option", "option1", "Полная (стандарт)", "carEquipment-select" + element);
                    CreateElement("option", "option2", "Полная на магнитной подвеске", "carEquipment-select" + element);
                    CreateElement("option", "option3", "Полная с автопилотом", "carEquipment-select" + element);
                    //CreateElement("div", "carCount" + element, "", "car" + element).classList.add("col-3", "text-center", "m-auto");
                    //CreateElement("button", element, "-", "carCount" + element).classList.add("btn", "btn-secondary", "d-inline", "minus");
                    // CreateElement("div", "carCountNumber" + element, cart[element]["count"], "carCount" + element).classList.add("d-inline", "mx-2");
                    //CreateElement("button", element, "+", "carCount" + element).classList.add("btn", "btn-secondary", "d-inline", "plus");
                    CreateElement("div", "carPrice" + element, cart[element]["price"].toLocaleString() + " $", "car" + element).classList.add("col-2", "text-center", "m-auto");
               }
          }
          CreateElement("div", "totalPrice", "Общая цена: " + price.toLocaleString() + " $", "cart-div").classList.add("row", "ml-0", "h3", "mt-3", "mx-auto");
          CreateElement("button", "checkout", "Оформить заказ", "cart-div").classList.add("btn", "btn-primary", "mx-auto");
          document.getElementById("checkout").setAttribute('onclick', "buttonCheckoutOnClick()");

          if (!price)
               cartIsEmpty();
     }
}

const cartIsEmpty = () => {
     document.getElementById("totalPrice").remove();
     document.getElementById("cart-header").remove();
     document.getElementById("checkout").remove();
     CreateElement("div", "empty-cart", "Корзина пуста", "cart-div").classList.add("row", "w-100", "mx-auto", "font-weight-bolder", "h2", "align-center");
}

const changeTotalPrice = () => {
     let price = calculateThePrice();
     if (price)
          document.getElementById("totalPrice").innerText = "Общая цена: " + price.toLocaleString() + " $";
     else
          cartIsEmpty();
}

const changeRenderCart = (id) => {
     cart = JSON.parse(localStorage.getItem('cart')) || [];
     console.log(cart);
     if (document.getElementById("cart-div") == undefined)
          return;
     console.log(id);
     if (document.getElementById("car" + id))
          document.getElementById("carCountNumber" + id).innerText = cart[id]['count'];
     changeTotalPrice();
}

// Сохраняем данные в localStorage
function saveData() {
     localStorage.setItem('cart', JSON.stringify(cart));
     return cart;
}
function clearData() {
     cart = {};
     saveData();
     return cart;
}

cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log(JSON.parse(localStorage.getItem('cart')) || []);
renderCart();
