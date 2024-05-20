import { getProducts } from "./api.js";
const cont = document.querySelector(".container")
const cartBtn = document.querySelector(".cartBtn")
const cart = document.querySelector(".cart")
const cartProductList = document.querySelector(".cartProductList")
const cartProductsArr = []
const cartTotal = document.querySelector(".cartTotalSubtitle")

cartBtn.addEventListener("click", openCart)

getProducts()
    .then(data => data.forEach(renderProduct))
    .catch(error => console.log(error))

function renderProduct (obj) {
    const card = document.createElement("div")
    card.classList.add("card")
    card.innerHTML = `
        <h2>${obj.title}</h2>
        <p>${obj.description}</p>
        <p>${obj.price}$</p>
        <p>${obj.category}</p>
        <img src="${obj.image}"></img>
        <btn class="buy_btn">Buy</btn>
    `
    cont.append(card)
    const buyBtn = card.querySelector(".buy_btn")
    buyBtn.addEventListener("click", () => {
        const element = cartProductsArr.find((item) => item.id === obj.id)
        if (element) {
            element.count += 1
            refrestCartProduct(element)
        }
        else {
            const newOvj = {...obj, count: 1}
            cartProductsArr.push(newOvj)
            createCartProduct(newOvj)
            cartTotal.textContent = cartProductsArr.reduce((acc, item) => acc + item.count*item.price, 0).toFixed(2)
        }
    })
}

function createCartProduct (obj) {
    const Product = document.createElement("div")
    Product.classList.add("added_product")
    Product.innerHTML = `
    <h3 class="CartTitle">${obj.title}</h3>
    <p class="cartPrice">${obj.price}$</p>
    <div class="cartCountCont">
        <button class="leftCartBtn">🡄</button>
        <span class="cartCount">${obj.count}</span>
        <button class="rightCartBtn">🡆</button>
    </div>
    `
    cartProductList.append(Product)
    obj.elemCount = Product.querySelector(".cartCount")
    obj.elemPrice = Product.querySelector(".cartPrice")
    const leftCARTbtn = Product.querySelector(".leftCartBtn")
    const rightCARTbtn = Product.querySelector(".rightCartBtn")
    leftCARTbtn.addEventListener("click", () => {
        obj.count --
        refrestCartProduct(obj)
        if (obj.count < 1) {
            deleteProduct(obj, Product)
        }
        else {
            obj.elemCount.textContent = obj.count
        }
    })
    rightCARTbtn.addEventListener("click", () => {
        obj.count ++
        obj.elemCount.textContent = obj.count
        refrestCartProduct(obj)
    })
}

function deleteProduct (obj, Product) {
    cartProductsArr.splice(cartProductsArr.findIndex((item) => item.id === obj.id), 1)
    Product.remove()
}

function refrestCartProduct (element) {
    element.elemCount.textContent = element.count
    element.elemPrice.textContent = element.count*element.price.toFixed(2)
    cartTotal.textContent = cartProductsArr.reduce((acc, item) => acc + item.count*item.price, 0).toFixed(2)
}

function openCart () {
    cart.classList.toggle("cartOpened")
}