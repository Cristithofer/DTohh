$(document).ready(function () {
  // Cargar carrito desde localStorage o iniciar vacío
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Referencias a elementos
  const $lista = $("#lista-carrito");
  const $mensajeVacio = $("#mensaje-vacio");
  const $hrTotal = $("#hr-total");
  const $contenedorTotal = $("#contenedor-total");
  const $totalPrecio = $("#total-precio");
  const $badge = $(".badge.bg-danger");

  // Función para guardar en localStorage
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // Función para actualizar badge
  function actualizarBadge() {
    $badge.text(carrito.length);
  }

  // Función para renderizar carrito
  function renderizarCarrito() {
    $lista.empty();

    if (carrito.length === 0) {
      $mensajeVacio.show();
      $hrTotal.hide();
      $contenedorTotal.hide();
      $totalPrecio.text("$0");
      return;
    }

    $mensajeVacio.hide();
    $hrTotal.show();
    $contenedorTotal.show();

    let total = 0;

    $.each(carrito, function (index, item) {
      const precioNum = parseInt(item.precio.replace(/\D/g, ""));
      total += precioNum;

      const $item = $(`
        <div class="list-group-item d-flex justify-content-between align-items-center">
          ${item.nombre}
          <div>
            <span class="badge bg-primary rounded-pill me-2">${item.precio}</span>
            <button class="btn btn-sm btn-danger btn-quitar" data-index="${index}">Quitar</button>
          </div>
        </div>
      `);
      $lista.append($item);
    });

    $totalPrecio.text(`$${total.toLocaleString("es-CL")}`);
  }

  // Agregar servicio (evento en botones)
  $(".btn-agregar").on("click", function () {
    const nombre = $(this).data("nombre");
    const precio = $(this).data("precio");

    carrito.push({ nombre, precio });
    guardarCarrito();
    renderizarCarrito();
    actualizarBadge();

    // Notificación simple
    const $toast = $(`
      <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 2000;">
        <div class="toast show bg-success text-white">
          <div class="toast-body">¡${nombre} agregado!</div>
        </div>
      </div>
    `);
    $("body").append($toast);
    setTimeout(() => $toast.remove(), 3000);
  });

  // Quitar item (evento delegado)
  $(document).on("click", ".btn-quitar", function () {
    const index = $(this).data("index");
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarCarrito();
    actualizarBadge();
  });

  // Vaciar carrito
  $("#btn-vaciar").on("click", function () {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    actualizarBadge();
  });

  // Inicializar al cargar página
  renderizarCarrito();
  actualizarBadge();
});