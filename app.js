// VARIABLES GENERALES
const products = document.querySelector(".productos_container");
const cartItems = document.querySelector(".cart-items");
const resumen = document.querySelector(".resumen");
const data = "../data.json" 

// PRINT PRODUCTOS
function renderProducts() {
  fetch(data)
    .then((resinicial) => resinicial.json())
    .then((res) => {
      res.forEach((product) => {
        products.innerHTML += `
        <div class="card">
        <img class="card-img" src=${product.img} alt="${product.name}">
            <h4 class="card-title">
            ${product.name}
            </h4>
            <h5 class="card-sub">
            Camiseta marca ${product.brand}. Equipación ${product.kit}
            </h5>
            <p class="precio">
            $ ${product.price}
            </p>
            <button onclick="addToCart(${product.id})" type="button" class="boton add-to-cart">Añadir al carrito</button>
        </div>
            `;
      });
    });
}
renderProducts();

let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

function addToCart(id) {
  fetch(data)
    .then((resinicial) => resinicial.json())
    .then((res) => {
      const miArray = res;
      if (cart.some((item) => item.id === id)) {
        changeCant("plus", id);
      } else {
        const item = miArray.find((product) => product.id === id);
        Toastify({
          text: "Agregado al carrito",
          duration: 2000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "#222"
          },
        }).showToast();
        cart.push({
          ...item,
          cant: 1,
        });
      }
      updateCart();
    });
}

function updateCart() {
  renderCartItems();
  renderResumen();

  localStorage.setItem("CART", JSON.stringify(cart));
}

function renderResumen() {
  let totalPrice = 0,
    totalItems = 0;
  cart.forEach((item) => {
    totalPrice += item.price * item.cant;
    totalItems += item.cant;
  });
  resumen.innerHTML = `
  <h2>Resumen</h2> <span>Subtotal</span> (${totalItems} items): <span>$${totalPrice}</span>
  `;
  if (totalPrice < 1){
    cartItems.innerHTML += ` <div> 
    <h3>No hay productos en el carrito.</h3></div>`;
  }
}
// PRINT PRODUCTOS EN CARRITO
function renderCartItems() {
  cartItems.innerHTML = "";
  cart.forEach((item) => {
    cartItems.innerHTML += `
    <div class="card-cart">
    <img class="cart-card-img" src=${item.img} alt="${item.name}">
        <div class="cart-info"> 
            <h4 class="cart-title">${item.name}</h4>
            <h4 class="cart-price"> <span>Precio:</span> $${item.price}</h4>
            <h4 class="cart-price"><span>Cantidad:</span> ${item.cant}</h4>
            <div class="grupo-botones"> 
                <button class="boton-restar minus" onclick="changeCant("minus", ${item.id})">-</button>
                <button onclick="removeItemFromCart(${item.id})" class="boton-eliminar">Eliminar</button>
                <button class="boton-agregar plus" onclick="changeCant("plus", ${item.id})">+</button>
            </div>
        </div>
    </div>
        `;
  });
}

// ELIMINAR PRODUCTOS DEL CARRITO CON SWEETALERT
function removeItemFromCart(id) {
  const confirmacionCart = Swal.mixin({
    customClass: {
      confirmButton: "alert-boton-eliminar",
      cancelButton: "alert-boton",
    },
    buttonsStyling: false,
  });

  confirmacionCart.fire({
      title: "Seguro queres eliminar este producto?",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "No, conservar!",
      confirmButtonText: "Si, eliminar!",
      reverseButtons: true
    })
    .then((result) => {
      if (result.isConfirmed) {
        confirmacionCart.fire(
          "Eliminado",
          "El producto fue eliminado del carrito",
          "warning"
        );
        cart = cart.filter((item) => item.id !== id);
        updateCart();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        confirmacionCart.fire(
          "Genial",
          "Tu producto sigue en el carrito",
          "success"
        );
      }
    });
}
function changeCant(action, id) {
  cart = cart.map((item) => {
    let cant = item.cant;
    if (item.id === id) {
      if (action === "minus") {
        cant--;
      } else if (action === "plus") {
        cant++;
        Toastify({
          text: "Agregado al carrito",
          duration: 2000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "#222",
          },
        }).showToast();
      } 
    }
    return {
      ...item,
      cant,
    };
  });
  updateCart();
}
