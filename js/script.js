import { getProducts } from "./api.js";
const cont = document.querySelector(".container")
const cartBtn = document.querySelector(".cartBtn")
const cart = document.querySelector(".cart")
const cartProductsArr = []

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
    const buyBtn = card.querySelector(".buy_btn")
    buyBtn.addEventListener("click", () => {
        const element = cartProductsArr.find((item) => item.id === obj.id)
        if (element) {
            element.count += 1
            console.log(element.count)
            refrestCartProduct(element)
        }
        else {
            const newOvj = {...obj, count: 1}
            cartProductsArr.push(newOvj)
            createCartProduct(newOvj)
        }
    })
}

function createCartProduct (obj) {
    const Product = document.createElement("div")
    Product.classList.add("added_product")
    Product.innerHTML = `
    <h3>${obj.title}</h3>
    <p>${obj.price}</p>
    <div>
        <button><-</button>
        <span>${obj.count}</span>
        <button>-></button>
    </div>
    `
    obj.elemCount = Product.querySelector("span")
    cart.append(Product)
}

function refrestCartProduct (element) {
    element.elemCount.textContent = element.count
}

function openCart () {
    cart.classList.toggle("cartOpened")
}