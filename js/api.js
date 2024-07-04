const url = "https://fakestoreapi.com/products"


export function getProducts () {
    return fetch(url) //get запрос на сервер
        .then((response) => response.json()) //обработка положительного результата запроса и преобразование ответа от сервера в js код
}

export function loginFunc (obj) {
    return fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      })
}

export function authApi(){
  return fetch('https://dummyjson.com/auth/me', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' +  localStorage.getItem("token") }, 
  })
}

export function updateUserApi (obj, id) {
    return fetch('https://dummyjson.com/users/' + id, {
        method: 'PUT', /* or PATCH */
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      })
      .then(res => res.json())
}