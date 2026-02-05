function initMap() {
  const girardot = { lat: 4.3034, lng: -74.8039 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: girardot,
  });

  new google.maps.Marker({
    position: girardot,
    map: map,
    title: "Girardot",
  });
}

function contienePalabrasProhibidas(texto) {
  const malasPalabras = ["mierda", "puta", "estúpido", "imbécil", "idiota", "carajo"];
  const expresionInvalida = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ,.!¡¿? \n]/g;

  const textoLimpio = texto.toLowerCase();
  return malasPalabras.some(p => textoLimpio.includes(p)) || expresionInvalida.test(texto);
}

function obtenerComentarios() {
  const guardados = localStorage.getItem("comentarios");
  return guardados ? JSON.parse(guardados) : [];
}

function guardarComentarios(comentarios) {
  localStorage.setItem("comentarios", JSON.stringify(comentarios));
}

function eliminarComentario(index) {
  const userToken = sessionStorage.getItem("adminToken");
  if (userToken !== "soyadmin") {
    alert("Solo el administrador puede eliminar comentarios.");
    return;
  }
  const comentarios = obtenerComentarios();
  comentarios.splice(index, 1);
  guardarComentarios(comentarios);
  cargarComentarios();
}

function cargarComentarios() {
  const container = document.getElementById("comentarios-container");
  container.innerHTML = "";
  const comentarios = obtenerComentarios();
  const userToken = sessionStorage.getItem("adminToken");

  comentarios.forEach((c, index) => {
    const div = document.createElement("div");
    div.className = "comentario";
    div.innerHTML = `
      <p><strong>${c.nombre}</strong> ★ ${c.estrellas}</p>
      <p>${c.texto}</p>
      ${userToken === "soyadmin" ? `<button onclick="eliminarComentario(${index})">Eliminar</button>` : ""}
    `;
    container.appendChild(div);
  });

  // Mostrar mensaje de admin si es el caso
  const adminMensaje = document.getElementById("admin-bienvenida");
  if (userToken === "soyadmin") {
    adminMensaje.style.display = "block";
  } else {
    adminMensaje.style.display = "none";
  }
}

function mostrarMensaje(texto, exito = true) {
  const mensaje = document.createElement("div");
  mensaje.textContent = texto;
  mensaje.style.position = "fixed";
  mensaje.style.top = "20px";
  mensaje.style.left = "50%";
  mensaje.style.transform = "translateX(-50%)";
  mensaje.style.background = exito ? "#4CAF50" : "#f44336";
  mensaje.style.color = "white";
  mensaje.style.padding = "10px 20px";
  mensaje.style.borderRadius = "8px";
  mensaje.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  mensaje.style.zIndex = 1000;
  mensaje.style.transition = "opacity 0.5s ease";

  document.body.appendChild(mensaje);
  setTimeout(() => {
    mensaje.style.opacity = 0;
    setTimeout(() => document.body.removeChild(mensaje), 500);
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  // Quitar admin al recargar
  sessionStorage.removeItem("adminToken");

  cargarComentarios();

  const form = document.getElementById("comentario-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const comentario = document.getElementById("comentario").value.trim();
    const estrellas = document.getElementById("estrellas").value;
    const mensajeError = document.getElementById("mensaje-error");

    if (!nombre || !comentario || !estrellas) {
      mensajeError.textContent = "Todos los campos son obligatorios.";
      return;
    }

    if (contienePalabrasProhibidas(comentario)) {
      mensajeError.textContent = "El comentario contiene palabras no permitidas.";
      return;
    }

    const comentarios = obtenerComentarios();
    comentarios.push({ nombre, texto: comentario, estrellas });
    guardarComentarios(comentarios);
    cargarComentarios();
    form.reset();
    mensajeError.textContent = "";
  });

  const loginForm = document.getElementById("admin-login-form");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const clave = document.getElementById("clave-admin").value;
    if (clave === "GTTURISMOGT") {
      sessionStorage.setItem("adminToken", "soyadmin");
      mostrarMensaje("Contraseña correcta. Bienvenido administrador.", true);
      document.getElementById("admin-login-form").style.display = "none";
      cargarComentarios();
    } else {
      mostrarMensaje("Contraseña incorrecta.", false);
    }
  });
});
