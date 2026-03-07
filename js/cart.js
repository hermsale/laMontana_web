

function renderCarrito(){
    const cartItemsContainer = document.getElementById("cart-items");

    const cartSubTotal = document.querySelector(".cart-subtotal");
    

    // guardamos el total del carrito
    let total = 0;

      // Leer el carrito del localStorage
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
      // corroboro el carrito
      console.log("Carrito cargado:");
      carrito.map(item => {
        console.log(`- ${item.nombre} | Cantidad: ${item.cantidad} | Precio: ${item.precio}`);
        total += item.cantidad * parseFloat(item.precio.replace(/[^0-9.-]+/g,"")); // sumo el precio de cada articulo y lo guardo en total
      });
      console.log(`Total: $${total.toFixed(2)}`);
  
      // en caso que el carrito este vacio. imprimo este mensaje 
      if (carrito.length === 0) {
        cartItemsContainer.innerHTML = "<p>🛍️ El carrito está vacío.</p>";
        cartSubTotal.innerHTML = `<p><strong>SubTotal: $${total.toFixed(2)}</strong></p>`
        return;
      }else{
        cartSubTotal.innerHTML = `<p><strong>SubTotal: $${total.toFixed(2)}</strong></p>`;
      }
  
      
  
      // Mostrar los productos en el carrito
        cartItemsContainer.innerHTML = carrito
    .map(
      (item) => `
        <div class="cart-item">
          <span class="item-name"><strong>${item.nombre}</strong></span>
          <span class="item-quantity">Cantidad: ${item.cantidad}</span>
          <span class="item-price">Precio: ${item.precio}</span>
        </div>
      `
    )
    .join("");

    }

    // Llamo a la funcion para renderizar el carrito al cargar la pagina
    renderCarrito();

function setupClearCart() {
    // tomo el boton de vaciar carrito
  const clearCartBtn = document.getElementById("cart-clear");

    // Función para vaciar carrito
    clearCartBtn.addEventListener("click", () => {
      if (confirm("¿Seguro que querés vaciar el carrito?")) {
        localStorage.removeItem("carrito"); // borra el contenido del localStorage
        total = 0; // reseteo el total
        renderCarrito(); // vuelvo a renderizar el carrito
       // cartItemsContainer.innerHTML = "<p>🛍️ El carrito está vacío.</p>";
        console.log("Carrito vaciado.");
      }
    });

};


document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();
  setupClearCart();
});