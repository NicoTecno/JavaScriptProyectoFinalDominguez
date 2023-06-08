var productos_actuales = [];
var lista_carrito = [];
var constante_global_data;
var nombre_lista_actual_json;
var lista_productos_con_sus_cantidades = [];
var valor_total_compra = 0;
//CONSATNTES GLOBALES DE LISTA DE CADA TIPO DE PRODUCTO DEL JSON
const JSON_PC_ARMADAS = "lista_pc_armadas";
//LISTAS OPCIONES AHRDWARE
const JSON_PROCESADORES = "lista_procesadores";
const JSON_MOTHERS = "lista_mothers";
const JSON_ALMACENAMIENTO = "lista_almacenamiento";
const JSON_MEMORIAS_RAM = "lista_memorias_ram";
const JSON_FUENTES = "Fuentes";
//LISTAS OPCIONES PERIFERIOS
const JSON_TECLADOS = "Teclados";
const JSON_MOUSES = "Mouses";
const JSON_MONITORES = "Monitores";
const JSON_AUICULARES = "Auriculares";
//estas variables y copnstante son para ARMA TU PC
const nombres_lista_Hardware_para_armar_tu_pc = [
  JSON_PROCESADORES,
  JSON_MOTHERS,
  JSON_ALMACENAMIENTO,
  JSON_MEMORIAS_RAM,
  JSON_FUENTES,
];
const cantidad_productos_hardaware = 5;
var posicion_lista_actual_arma_tu_pc = 0;
var estoy_en_arma_tu_pc = false;
var lista_componentes_elegidos = [];
//variables vista carrito
var div_productos_div_carrito = false;
var contador_2 = 0;
var contador_prueba = 0;
//
var ultimo_titulo = "";
//
var la_tarjeta_fue_llamada_desde_carrito = true;

//OBLIGO A CARGAR LA PRIMERA VEZ (ESTO SOLO AYUDA SI SE EMPIEZA DESDE PRODUCTOS.HTML)
fetch("productos.json")
  .then((response) => response.json())
  .then((data) => {
    constante_global_data = data;
  });

function resetear_contadores_vista_carrito() {
  contador_2 = 0;
  contador_prueba = 0;
}

function resetear_armar_tu_pc() {
  posicion_lista_actual_arma_tu_pc = 0;
  lista_componentes_elegidos = [];
  string_para_html_alerta = "";
}

const listaProductos = document.querySelector("#productos");
function generar_productos(data) {
  data.forEach(function (elemento) {
    const div = document.createElement("div");
    const imgElement = document.createElement("img");
    imgElement.src = elemento.img;
    let nombre_boton = "Agregar al carrito";
    let nombre_clase_boton = "add-to-cart";
    if (estoy_en_arma_tu_pc) {
      nombre_clase_boton = "agregar-a-lista-componentes";
      nombre_boton = "Agregar componente";
    }

    div.innerHTML = `
    <div class="card" id="producto">
    <img src="${imgElement.src}" alt="">
    <h3>${elemento.nombre}</h3>
    <p>Description of product 1.</p>
    <p>$${elemento.precio}</p>
    <button class="${nombre_clase_boton}" data-producto-id="${elemento.id}" >${nombre_boton}</button>
    </div>
    `;

    listaProductos.append(div);
  });
}

//ELIMINAR DIVS
function eliminar_productos() {
  while (listaProductos.firstChild) {
    listaProductos.removeChild(listaProductos.firstChild);
  }
}

function cargar_data() {
  fetch("productos.json")
    .then((response) => response.json())
    .then((data) => {
      constante_global_data = data;
    });
}

function lista_correspondiente_para_ese_navlink(nombre_navlink) {
  var string_nombre_lista_json;
  switch (nombre_navlink) {
    case "Pcs Armadas":
      string_nombre_lista_json = JSON_PC_ARMADAS;
      break;
    case "Procesadores":
      string_nombre_lista_json = JSON_PROCESADORES;
      break;
    case "Mothers":
      string_nombre_lista_json = JSON_MOTHERS;
      break;
    case "Almacenamiento":
      string_nombre_lista_json = JSON_ALMACENAMIENTO;
      break;
    case "Memorias Ram":
      string_nombre_lista_json = JSON_MEMORIAS_RAM;
      break;
    case "Fuentes":
      string_nombre_lista_json = JSON_FUENTES;
      break;
    case "Teclados":
      string_nombre_lista_json = JSON_TECLADOS;
      break;
    case "Mouses":
      string_nombre_lista_json = JSON_MOUSES;
      break;
    case "Monitores":
      string_nombre_lista_json = JSON_MONITORES;
      break;
    case "Auriculares":
      string_nombre_lista_json = JSON_AUICULARES;
      break;
  }
  return string_nombre_lista_json;
}

//Detecto que navbar toque
var navLinkss = document.querySelectorAll(".nav-link");
navLinkss.forEach(function (navLink) {
  navLink.addEventListener("click", function () {
    var selectedText = this.innerHTML;
    if (selectedText == "Consulta") {
      alerta_consulta();
      return;
    }
    ocultar_inicio();
    div_productos_div_carrito = true;
    cambiar_vista_carrito_con_navbar();
    resetear_armar_tu_pc();
    estoy_en_arma_tu_pc = false;
    resetear_contadores_vista_carrito();
    if (selectedText == "Arma tu Pc") {
      estoy_en_arma_tu_pc = true;
      arma_tu_pc();
      titulo_productos(selectedText);
      return;
    }
    titulo_productos(selectedText);
    cargar_data();
    var lista_del_json = lista_correspondiente_para_ese_navlink(selectedText);
    nombre_lista_actual_json = constante_global_data[lista_del_json];
    eliminar_productos();
    filtrar_por_precio(nombre_lista_actual_json);
  });
});

//Detecto que SubNavBar toque
var subNavLinks = document.querySelectorAll(".dropdown-item");
subNavLinks.forEach(function (navLink) {
  navLink.addEventListener("click", function () {
    ocultar_inicio();
    div_productos_div_carrito = true;
    resetear_armar_tu_pc();
    //NUEVO
    estoy_en_arma_tu_pc = false;
    cambiar_vista_carrito_con_navbar();
    resetear_contadores_vista_carrito();

    var selectedText = this.innerHTML;
    titulo_productos(selectedText);
    var lista_del_json = lista_correspondiente_para_ese_navlink(selectedText);
    nombre_lista_actual_json = constante_global_data[lista_del_json];
    eliminar_productos();
    filtrar_por_precio(nombre_lista_actual_json);
  });
});

// ESTA PARTE ES PARA EL ARANGO DE PRECIOS
const rangeInput = document.querySelectorAll(".range-input input"),
  priceInput = document.querySelectorAll(".price-input input"),
  progress = document.querySelector(".slider__rango--precio .progress");

let priceGap = 1000;

priceInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minVal = parseInt(priceInput[0].value),
      maxVal = parseInt(priceInput[1].value);

    if (maxVal - minVal >= priceGap && maxVal <= 10000) {
      if (e.target.className === "input-min") {
        rangeInput[0].value = minVal;
        progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      } else {
        rangeInput[1].value = maxVal;
        progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
      }
    }
  });
});

rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minVal = parseInt(rangeInput[0].value),
      maxVal = parseInt(rangeInput[1].value);

    if (maxVal - minVal < priceGap) {
      if (e.target.className === "range-min") {
        rangeInput[0].value = maxVal - priceGap;
      } else {
        rangeInput[1].value = minVal + priceGap;
      }
    } else {
      priceInput[0].value = minVal;
      priceInput[1].value = maxVal;
      progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    }
  });
});

//DETECTAR SI USO EL SLIDER DEL FILTRO DE PRECIOS Y EFECTUAR FILTRO
const slider_min = document.querySelectorAll(".range-min");
slider_min.forEach((input) => {
  input.addEventListener("input", (e) => {
    filtrar_por_precio(nombre_lista_actual_json);
  });
});

const slider_max = document.querySelectorAll(".range-max");
slider_max.forEach((input) => {
  input.addEventListener("input", (e) => {
    filtrar_por_precio(nombre_lista_actual_json);
  });
});

//Filtro precio
function filtrar_por_precio(lista_productos_buscada) {
  let minVal = parseInt(priceInput[0].value);
  let maxVal = parseInt(priceInput[1].value);
  const nuevo_array = lista_productos_buscada.filter(function (elemento) {
    return elemento.precio >= minVal && elemento.precio <= maxVal;
  });
  //no es lo mejor pero por alguna razon copy() no funciona asique hago esto
  productos_actuales.push(nuevo_array);
  eliminar_productos();
  generar_productos(nuevo_array);
}

priceInput[0].addEventListener("input", function () {
  eliminar_productos();
  filtrar_por_precio(nombre_lista_actual_json);
});

priceInput[1].addEventListener("input", function () {
  eliminar_productos();
  filtrar_por_precio(nombre_lista_actual_json);
});

//Local Storage

function guardar_sesion(lista_carrito) {
  const jsonDeListaCarrito = JSON.stringify(lista_carrito);
  localStorage.setItem("ListaCarrito", jsonDeListaCarrito);
}

function obtener_carrito_sesion() {
  const lista_carrito_storage = localStorage.getItem("ListaCarrito");
  return JSON.parse(lista_carrito_storage);
}

//Carrito
function buscar_producto_por_id(lista, id_buscado) {
  for (let posicion = 0; posicion < lista.length; posicion++) {
    if (lista[posicion].id == id_buscado) {
      return lista[posicion];
    }
  }
  return -1;
}

listaProductos.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-to-cart")) {
    const idProducto = event.target.dataset.productoId;

    alerta_producto_agregar_carrito();
    var producto_encontrado = buscar_producto_por_id(
      nombre_lista_actual_json,
      idProducto
    );

    lista_carrito = obtener_carrito_sesion();

    if (lista_carrito == null) {
      lista_carrito = [];
    }
    lista_carrito.push(producto_encontrado);
    guardar_sesion(lista_carrito);
    actualizar_total();
  }
});

listaProductos.addEventListener("click", function (event) {
  if (event.target.classList.contains("agregar-a-lista-componentes")) {
    const idProducto = event.target.dataset.productoId;
    var lista_del_json_donde_buscar =
      nombres_lista_Hardware_para_armar_tu_pc[posicion_lista_actual_arma_tu_pc];
    var producto_encontrado = buscar_producto_por_id(
      constante_global_data[lista_del_json_donde_buscar],
      idProducto
    );
    lista_componentes_elegidos.push(producto_encontrado);
    if (posicion_lista_actual_arma_tu_pc >= cantidad_productos_hardaware - 1) {
      alerta_fin_arma_tu_pc();
      return;
    }
    posicion_lista_actual_arma_tu_pc++;
    titulo_productos();
    arma_tu_pc();
  }
});

//FUNCION MODIFICAR PRECIO TOTAL
function actualizar_total() {
  valor_total_compra = 0;
  lista_carrito = obtener_carrito_sesion();
  if (lista_carrito.length != 0) {
    lista_carrito.forEach(function (producto) {
      valor_total_compra += producto.precio;
    });
  }
  let total_dos_decimales = valor_total_compra.toFixed(2);
  const total = document.getElementById("total");
  total.innerText = `${total_dos_decimales}`;
}

//PASAR A LA SECCION DE COMPRA (OCULTO EL CONTEINER DE LOS PRODUCTOS Y FILTROS)
const listaProductosCarrito = document.querySelector("#carrito ul");

listaProductosCarrito.addEventListener("click", function (event) {
  if (event.target.classList.contains("button__eliminar")) {
    const idProducto = event.target.dataset.productoId;
    lista_carrito = obtener_carrito_sesion();
    for (i = 0; i < lista_carrito.length; i++) {
      if (lista_carrito[i].id == idProducto) {
        lista_carrito.splice(i, 1);
        guardar_sesion(lista_carrito);
        mostrar_carrito();
        break;
      }
    }
    actualizar_total();
  }
});

var lista_mostrar = [];
function crear_lista_objetos_con_cantidad(lista_carrito) {
  for (let posicion = 0; posicion < lista_carrito.length; posicion++) {
    let repetido = false;
    for (let i = 0; i < lista_mostrar.length; i++) {
      if (lista_mostrar[i][0].id == lista_carrito[posicion].id) {
        lista_mostrar[i][1] = lista_mostrar[i][1] + 1;
        repetido = true;
      }
    }
    if (!repetido) {
      lista_mostrar.push([lista_carrito[posicion], 1]);
    }
  }
  return lista_mostrar;
}

//Funcion auxiliar para evitar duplicados en el carrito cada vez que tocamos el carrito
function borrar_carrito() {
  while (listaProductosCarrito.firstChild) {
    listaProductosCarrito.removeChild(listaProductosCarrito.firstChild);
  }
}

var primera_vez = true;
function mostrar_carrito() {
  borrar_carrito();
  quitar_titulo();
  if (primera_vez) {
    lista_mostrar = crear_lista_objetos_con_cantidad(obtener_carrito_sesion());
    primera_vez = false;
  } else {
    lista_mostrar = [];
    lista_mostrar = crear_lista_objetos_con_cantidad(obtener_carrito_sesion());
  }

  lista_mostrar.forEach(function (elemento) {
    const div = document.createElement("div");
    const imgElement = document.createElement("img");
    imgElement.src = elemento[0].img;
    div.innerHTML = `
    <li class="carrito__producto"><img src="${imgElement.src}" class="img_producto_carrito"/> <h3>${elemento[0].nombre}</h3><h3>$${elemento[0].precio}</h3><h3>x(${elemento[1]})</h3> <button class="button__eliminar" data-producto-id="${elemento[0].id}">
    <svg viewBox="0 0 448 512" class="svgIcon__eliminar"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
  </button> </li>
    `;

    listaProductosCarrito.append(div);
  });
}

var div_carrito = document.querySelector("#carrito");
var contenedor = document.querySelector(".contenedor__productos");

function titulo_productos(nombre_categoria_productos) {
  var lista_productos_orden = [
    "Procesador",
    "Mother",
    "Almacenamiento",
    "Memoria Ram",
    "Fuente",
  ];
  const titulo = document.getElementById("titulo_productos");
  if (estoy_en_arma_tu_pc) {
    titulo.innerText = `Elija ${lista_productos_orden[posicion_lista_actual_arma_tu_pc]}`;
  } else {
    titulo.innerText = `${nombre_categoria_productos}`;
  }
  ultimo_titulo = nombre_categoria_productos;
  actualizar_animacion_titulo();
}

function quitar_titulo() {
  const total = document.getElementById("titulo_productos");
  total.innerText = "";
}

var div_inicio = document.querySelector("#Inicio");
var div_productos_y_filtro = document.querySelector("#Seccion_productos");

function ocultar_inicio() {
  div_inicio.style.display = "none";
  div_productos_y_filtro.style.display = "";
}

function mostrar_inicio() {
  div_inicio.style.display = "";
  div_productos_y_filtro.style.display = "none";
  div_productos_div_carrito = false;
  if (!div_productos_div_carrito) {
    resetear_contadores_vista_carrito();
  }
}
function mostrar_inicio_desde_visita_carrito() {
  div_inicio.style.display = "";
  div_productos_y_filtro.style.display = "none";
  div_productos_div_carrito = false;
}

mostrar_inicio();

// var contador_prueba = 0;
//Esto es para que el carrito tenga display none desde que carga la pagina
var primera_carga_pagina = true;
if (primera_carga_pagina) {
  div_carrito.style.display = "none";
  primera_carga_pagina = false;
}

// var div_productos_div_carrito = false;
// var contador_2 = 0;
// contador_prueba = 1;
var quiero_mostrar_ultimo_titulo = false;
function vista_carrito() {
  actualizar_total();
  la_tarjeta_fue_llamada_desde_carrito = true;

  if (div_productos_div_carrito) {
    if (contador_prueba % 2 == 0) {
      contenedor.style.display = "none";
      div_carrito.style.display = "";
      quiero_mostrar_ultimo_titulo = false;
    } else {
      contenedor.style.display = "";
      div_carrito.style.display = "none";
      quiero_mostrar_ultimo_titulo = true;
    }
    contador_prueba++;
    contador_2 = 0;
  } else {
    //CASO CONTRARIO ES INICIO_CARRITO
    if (contador_2 % 2 == 0) {
      ocultar_inicio();
      contenedor.style.display = "none";
      div_carrito.style.display = "";
      quiero_mostrar_ultimo_titulo = false;
    } else {
      mostrar_inicio_desde_visita_carrito();
      contenedor.style.display = "";
      div_carrito.style.display = "none";
      quiero_mostrar_ultimo_titulo = false;
    }
    contador_2++;
  }
  mostrar_carrito();
  if (quiero_mostrar_ultimo_titulo) {
    titulo_productos(ultimo_titulo);
  }
}

function cambiar_vista_carrito_con_navbar() {
  contenedor.style.display = "";
  div_carrito.style.display = "none";
  contador_prueba++;
}

function alerta_producto_agregar_carrito() {
  Toastify({
    text: "El producto se agregó al carrito",
    duration: 3000,
    newWindow: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

function arma_tu_pc() {
  var nombre_lista_actual =
    nombres_lista_Hardware_para_armar_tu_pc[posicion_lista_actual_arma_tu_pc];

  nombre_lista_actual_json = constante_global_data[nombre_lista_actual];
  filtrar_por_precio(constante_global_data[nombre_lista_actual]);
}

//ESTA PARTE ES PARA INICIAR SESION O REGISTRARSE
function iniciar_sesion() {
  Swal.fire({
    title: "Iniciar sesión",
    html:
      '<label for="email">Correo electrónico:</label>' +
      '<input type="email" id="email" name="email" required class="swal2-input">' +
      '<label for="password">Contraseña:</label>' +
      '<input type="password" id="password" name="password" required class="swal2-input">' +
      '<button type="button" id="login-btn">Iniciar sesión</button>' +
      '<button type="button" id="register-btn">Registrarse</button>',
    customClass: {
      container: "custom-alert-container",
    },
    showCloseButton: true,
  });

  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");

  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validar credenciales del usuario
    if (email === "usuario@ejemplo.com" && password === "contraseña") {
      Swal.fire({
        title: "¡Inicio de sesión exitoso!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "#";
      });
    } else {
      Swal.fire({
        title: "¡Error!",
        text: "Credenciales incorrectas",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  });

  registerBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Registrarse",
      html:
        '<label for="register-email">Correo electrónico:</label>' +
        '<input type="email" id="register-email" name="register-email" required class="swal2-input">' +
        '<label for="register-password">Contraseña:</label>' +
        '<input type="password" id="register-password" name="register-password" required class="swal2-input">',
      customClass: {
        container: "custom-alert-container",
      },
      confirmButtonText: "Registrarse",
      preConfirm: () => {
        const registerEmail =
          Swal.getPopup().querySelector("#register-email").value;
        const registerPassword =
          Swal.getPopup().querySelector("#register-password").value;

        // Validar y crear la cuenta del usuario
        if (registerEmail && registerPassword) {
          return { email: registerEmail, password: registerPassword };
        } else {
          Swal.showValidationMessage(
            "Por favor, ingrese un correo electrónico y contraseña válidos"
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Registro exitoso!",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "#";
        });
      }
    });
  });
}

var string_para_html_alerta = "";
function armar_html_para_alerta() {
  for (
    let posicion_lista_componentes_elegidos = 0;
    posicion_lista_componentes_elegidos <= 1;
    posicion_lista_componentes_elegidos++
  ) {
    var producto =
      lista_componentes_elegidos[posicion_lista_componentes_elegidos];

    var imgSrc = producto.img;
    var nombreProducto = producto.nombre;
    var precioProducto = producto.precio;

    string_para_html_alerta =
      string_para_html_alerta +
      `
    <div class="contenedor_de_alerta_arma_tu_pc">
      <img src="${imgSrc}" alt="Imagen del producto" style="width: 50px; height: 50px;">
      <p>${nombreProducto}</p>
      <p>${precioProducto}</p>
    </div>
  `;
  }

  return string_para_html_alerta;
}

var precioTotalArmaTuPc = 0;
function alerta_fin_arma_tu_pc() {
  for (
    let posicion_lista_componentes_elegidos = 0;
    posicion_lista_componentes_elegidos <= cantidad_productos_hardaware - 1;
    posicion_lista_componentes_elegidos++
  ) {
    var producto =
      lista_componentes_elegidos[posicion_lista_componentes_elegidos];

    var imgSrc = producto.img;
    var nombreProducto = producto.nombre;
    var precioProducto = producto.precio;

    string_para_html_alerta =
      string_para_html_alerta +
      `
    <div class="contenedor_de_alerta_arma_tu_pc">
    <img src="${imgSrc}" alt="Imagen del producto" style="width: 50px; height: 50px;">
    <p>${nombreProducto}</p>
    <p>$${precioProducto}</p>
    </div>
    `;
    precioTotalArmaTuPc += precioProducto;
  }
  string_para_html_alerta =
    string_para_html_alerta +
    `
<div class="contenedor_de_alerta_arma_tu_pc">
<p>El precio de la Pc Armada es $${precioTotalArmaTuPc}</p>
</div>
`;
  precioTotalArmaTuPc = 0;

  // Swal.fire({
  //   title: "Componentes elegidos",
  //   html: string_para_html_alerta,
  //   customClass: {
  //     container: "alerta_arma_tu_pc_finalizada",
  //   },
  //   showCloseButton: true,
  // });

  //////////////////////////////
  // function mostrarAlerta() {
  Swal.fire({
    title: "Esta es su Pc Armada",
    html: string_para_html_alerta,
    customClass: {
      container: "alerta_arma_tu_pc_finalizada",
    },
    showCancelButton: true,
    confirmButtonText: "Armar otra PC",
    cancelButtonText: "Ir a pagar",
    confirmButtonColor: "#8B0000 ",
    cancelButtonColor: "#28a745",
  }).then((result) => {
    if (result.value) {
      // Acción si se hace clic en "Armar otra PC"
      console.log("Armar otra PC");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Acción si se hace clic en "Ir a pagar"
      console.log("Ir a pagar");
      la_tarjeta_fue_llamada_desde_carrito = false;
      ingresar_tarjeta();
    }
  });
  // }

  //Con esto reseteo Armar tu Pc
  var navbar = document.querySelector(".nav-link");
  navbar.click();
}

function alerta_consulta() {
  Swal.fire({
    title: "Consulta",
    html:
      '<label for="nombre">Nombre</label>' +
      '<input id="nombre" class="swal2-input">' +
      '<label for="email">Email</label>' +
      '<input id="email" type="email" class="swal2-input">' +
      '<label for="consulta">Consulta</label>' +
      '<textarea id="consulta" class="swal2-textarea"></textarea>',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Enviar",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const nombre = Swal.getPopup().querySelector("#nombre").value;
      const email = Swal.getPopup().querySelector("#email").value;
      const consulta = Swal.getPopup().querySelector("#consulta").value;
      if (!nombre || !email || !consulta) {
        Swal.showValidationMessage(`Por favor, completa todos los campos`);
      }
      return { nombre: nombre, email: email, consulta: consulta };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(result.value);
      Swal.fire({
        title: "Consulta enviada",
        icon: "success",
      });
    }
  });
}

//
function actualizar_animacion_titulo() {
  const elementoTexto = document.getElementById("titulo_productos");
  elementoTexto.classList.remove("tracking-in-expand");
  setTimeout(() => {
    elementoTexto.classList.add("tracking-in-expand");
  }, 50);
}

//NUEVOO
function alerta_pago_efectuado() {
  Swal.fire({
    title: "Pago efectuado",
    text: "Tu pago ha sido procesado exitosamente. Gracias por tu compra.",
    icon: "success",
    confirmButtonText: "Cerrar",
    showCancelButton: false,
    allowOutsideClick: false,
  });
}

function vaciar_carrito() {
  lista_carrito = [];
  guardar_sesion(lista_carrito);
  //falta actualizar carrito visual
  mostrar_carrito();
  //no se resetea el total
  actualizar_total();
}

function ingresar_tarjeta() {
  Swal.fire({
    title: "Formulario de tarjeta de crédito",
    html: `
      <div class="container-tarjeta">
        <div class="card-container">
          <div class="front">
            <div class="image">
              <img src="imgs/tarjeta/chip.png" alt="" />
              <img src="imgs/tarjeta/visa.png" alt="" />
            </div>
            <div class="card-number-box">####-####-####-####</div>
            <div class="flexbox">
              <div class="box">
                <span>Propietario</span>
                <div class="card-holder-name">Nombre Completo</div>
              </div>
              <div class="box">
                <span>Fecha expiración</span>
                <div class="expiration">
                  <span class="exp-month">mm</span>
                  <span class="exp-year">yy</span>
                </div>
              </div>
            </div>
          </div>
  
          <div class="back">
            <div class="stripe"></div>
            <div class="box">
              <span>cvc</span>
              <div class="cvv-box"></div>
              <img src="image/visa.png" alt="" />
            </div>
          </div>
        </div>
  
        <form action="">
          <div class="inputBox">
            <span>Numero de tarjeta</span>
            <input type="text" maxlength="16" class="card-number-input" />
          </div>
          <div class="inputBox">
            <span>Nombre del propietario</span>
            <input type="text" class="card-holder-input" />
          </div>
          <div class="flexbox">
            <div class="inputBox">
              <span>Mes de expiracion</span>
              <select name="" id="" class="month-input">
                <option value="month" selected disabled>Mes</option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
            <div class="inputBox">
              <span>Año de expiracion</span>
              <select name="" id="" class="year-input">
                <option value="year" selected disabled>Año</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
              </select>
            </div>
            <div class="inputBox">
              <span>cvc</span>
              <input type="text" maxlength="4" class="cvv-input" />
            </div>
          </div>
          <input type="submit" value="Efectuar Pago" class="submit-btn" />
        </form>
      </div>
    `,
    showConfirmButton: false,
  });
  document.querySelector(".card-number-input").oninput = () => {
    let numeros = document.querySelector(".card-number-input").value;
    let string = "";
    for (let pos = 0; pos < 16; pos++) {
      console.log("POS actual");
      console.log(pos);
      if (pos % 4 == 0 && pos != 0) {
        string = string + "-";
      }

      if (numeros.length <= pos) {
        string = string + "#";
      } else {
        string = string + String(numeros[pos]);
      }

      document.querySelector(".card-number-box").innerText = `${string}`;
    }
  };

  document.querySelector(".card-holder-input").oninput = () => {
    document.querySelector(".card-holder-name").innerText =
      document.querySelector(".card-holder-input").value;
  };

  document.querySelector(".month-input").oninput = () => {
    document.querySelector(".exp-month").innerText =
      document.querySelector(".month-input").value;
  };

  document.querySelector(".year-input").oninput = () => {
    document.querySelector(".exp-year").innerText =
      document.querySelector(".year-input").value;
  };

  document.querySelector(".cvv-input").onfocus = () => {
    document.querySelector(".front").style.transform =
      "perspective(1000px) rotateY(-180deg)";
    document.querySelector(".back").style.transform =
      "perspective(1000px) rotateY(0deg)";
  };

  document.querySelector(".cvv-input").onblur = () => {
    document.querySelector(".front").style.transform =
      "perspective(1000px) rotateY(0deg)";
    document.querySelector(".back").style.transform =
      "perspective(1000px) rotateY(180deg)";
  };

  document.querySelector(".cvv-input").oninput = () => {
    document.querySelector(".cvv-box").innerText =
      document.querySelector(".cvv-input").value;
  };

  //

  const boton_efectuar_pago = document.querySelector(".submit-btn");
  boton_efectuar_pago.addEventListener("click", () => {
    //Tendria que validar los datos pero seria Demasiado
    alerta_pago_efectuado();
    if (la_tarjeta_fue_llamada_desde_carrito) {
      vaciar_carrito();
    }
  });
}
