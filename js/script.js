import { getProducts, loginFunc, authApi, updateUserApi } from "./api.js";
const cont = document.querySelector(".container")
const cartBtn = document.querySelector(".cartBtn")
const cart = document.querySelector(".cart")
const cartProductList = document.querySelector(".cartProductList")
const cartProductsArr = []
const cartTotal = document.querySelector(".cartTotalSubtitle")
const overlayModal = document.querySelector(".paying")
const cartTotalBtn = document.querySelector(".cartTotalBtn")
const payingModal = document.querySelector(".paying_modal")
const payingModalInput = payingModal.querySelectorAll(".paying_modal_input")
const cartCloseBtn = document.querySelector(".cartClose")
const authForm = document.querySelector(".authModal")
const authFormOpenBtn = document.querySelector(".loginBtn")
const overlayAuthModal = document.querySelector(".sign_in")
const authModalCloseBtn = document.querySelector(".authModalCloseBtn")
const profileBtn = document.querySelector(".profileBtn")
let user
const profileName = document.querySelector(".profile-name")
const profileLastName = document.querySelector(".profile-2name")
const profileEmail = document.querySelector(".profile-mail")
const profilePhone = document.querySelector(".profile-phone")
const profileModal = document.querySelector(".profileModal")
const profileOverlay = document.querySelector(".profile")
const profileCloseBtn = document.querySelector(".profile-close-btn")
const ProfileLogoutBtn = document.querySelector(".profile-logout-btn")
const profileUsername = document.querySelector(".profile-username")
const profileEditForm = document.querySelector(".edit")
const profileDataCont = document.querySelector(".data")
const profileEditFormOpenBtn = document.querySelector('.profile-edit-btn')
const profile1btns = document.querySelector('.profile-btns')
const profile2btn = document.querySelector('.profile-save-btn')

getProducts()
    .then(data => data.forEach(renderProduct))
    .catch(error => console.log(error))

async function auth() {
    const res = await authApi()
    if (res.ok) {
        authFormOpenBtn.classList.add("none")
        profileBtn.classList.remove("none")
        const data = await res.json()
        user = data
        console.log(user)
        profileName.textContent = user.firstName
        profileLastName.textContent = user.lastName
        profileEmail.textContent = user.email
        profilePhone.textContent = user.phone
        profileUsername.textContent = user.username
    }   
}

function profileEditOpen () {
    profileDataCont.classList.add("none")
    profileEditForm.classList.remove("none")
    profile1btns.classList.add("none")
    profile2btn.classList.remove("none")
    const {firstName, lastName, email, phone} = profileEditForm.elements
    firstName.value = user.firstName
    lastName.value = user.lastName
    email.value = user.email
    phone.value = user.phone
}

function profileOpen () {
    profileOverlay.classList.remove("hidden")
    profileModal.classList.add("profileOpened")
}
function profileClose () {
    profileOverlay.classList.add("hidden")
    profileModal.classList.remove("profileOpened")
}
function logout () {
    localStorage.clear("token")
    authFormOpenBtn.classList.remove("none")
    profileBtn.classList.add("none")
    user = {}
    profileClose()
}

function renderProduct (obj) {
    const card = document.createElement("div")
    card.classList.add("card")
    card.innerHTML = `
        <img src="${obj.image}"></img>
        <div class="card_text_cont">
            <h2 class="card_title">${obj.title}</h2>
            <p class="card_subtitle">${obj.category}</p>
            <p class="card_price">${obj.price}$</p>
            <div class="card_buystr">
                <button class="buy_btn">Buy</button>
                <button class="more_btn">More</button>
            </div>
        </div>
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
    cart.classList.add("cartOpened")
}

function openPayModal () {
    overlayModal.classList.remove("hidden")
    cart.classList.remove("cartOpened")
}
    
function closePayModal (element) {
    element.classList.add("hidden")
}

function sendPaymentData (e) {
    e.preventDefault()
    const obj = {}
    for(let i = 0; i < payingModalInput.length; i++) {
        obj[payingModalInput[i].name] = payingModalInput[i].value
    }
    console.log(obj)
    closePayModal(overlayModal)
    payingModal.reset()
}

function initValidation (inputSelector, submitSelector) {
    const inputs = document.querySelectorAll(inputSelector)
    const submit = document.querySelector(submitSelector)
    inputs.forEach((input) => input.addEventListener("input", () => validation(input, submit, inputs)))
}

function validation (input, submit, inputs) {
    const errorMessage = input.nextElementSibling
    if (input.validity.valueMissing) {
        errorMessage.textContent = "input is empty"
    }
    else if (input.validity.patternMismatch) {
        errorMessage.textContent = errorMessage.getAttribute("data-error-pattern")
    }
    else if (input.validity.tooLong || input.validity.tooShort){
        errorMessage.textContent = errorMessage.getAttribute("data-error-length")
    }
    else {
        errorMessage.textContent = ""
    }
    submit.disabled = ![...inputs].every((inp) => inp.validity.valid===true)
}

initValidation('.paying_modal_input', '.paying_modal_paypal')

payingModal.addEventListener("submit", sendPaymentData)
cartBtn.addEventListener("click", openCart)
cartTotalBtn.addEventListener("click", openPayModal)
overlayModal.addEventListener("click", (e) => {
    if(e.target.classList.contains('overlay')){
        closePayModal(e.target)
    }
})
cartCloseBtn.addEventListener("click", () => cart.classList.toggle("cartOpened"))
authForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    const {username, password} = authForm.elements
    const obj = {
        username:username.value,
        password:password.value
    }
    const response = await loginFunc(obj)
    if(response.ok){
        const data =  await response.json()
        localStorage.setItem("token", data.token)
        overlayAuthModal.classList.add("hidden")
        authForm.classList.remove("authModalOpened")
        auth()
    } else {

    }
})
authFormOpenBtn.addEventListener("click", () => {
    authForm.classList.add("authModalOpened")
    overlayAuthModal.classList.remove("hidden")
})
authModalCloseBtn.addEventListener("click", () => {
    overlayAuthModal.classList.add("hidden")
    authForm.classList.remove("authModalOpened")
})
profileBtn.addEventListener("click", profileOpen)
profileCloseBtn.addEventListener("click", profileClose)
ProfileLogoutBtn.addEventListener("click", logout)
profileEditFormOpenBtn.addEventListener("click", profileEditOpen)
profile2btn.addEventListener("send", )

auth()