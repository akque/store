const url = "https://fakestoreapi.com/products"


export function getProducts () {
    return fetch(url) //get запрос на сервер
        .then((response) => response.json()) //обработка положительного результата запроса и преобразование ответа от сервера в js код
}
