import { getProducts } from "./api.js";
const cont = document.querySelector(".container")
const cartBtn = document.querySelector(".cartBtn")
const cart = document.querySelector(".cart")

cartBtn.addEventListener("click", openCart)

getProducts()
    .then(data => data.forEach(renderProduct))
    .catch(error => console.log(error))

function renderProduct (obj) {
    const card = document.createElement("div")
    card.classList.add("card")
    // innerHTML - позволяет изменять контент внутри тега, включая другие теги, которые находились внутри
    card.innerHTML = `
        <h2>${obj.title}</h2>
        <p>${obj.description}</p>
        <p>${obj.price}</p>
        <p>${obj.category}</p>
        <img src="${obj.image}"></img>
        <btn class="buy_btn">Buy</btn>
    `
    cont.append(card) // append - добавляет элемент в конец контейнера
}

function openCart () {
    cart.classList.add("cartOpened")
}