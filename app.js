// Ocultar Splash Screen después de 1.5 segundos
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("splash-screen").classList.add("hidden");
  }, 1500);
  cargarTodo();
});

// Navegación entre pantallas
function cambiarPantalla(nombre) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(`screen-${nombre}`).classList.add("active");
  document.querySelector(`.nav-btn[data-target="${nombre}"]`).classList.add("active");
}

// Estado guardado en el teléfono/navegador
let appData = JSON.parse(localStorage.getItem("trueFitness_data")) || {
  nombre: "Usuario",
  peso: 75,
  altura: 1.78,
  edad: 32,
  calorias: 1100,
  ejercicios: [
    { nombre: "Press de banca", series: "4x10" },
    { nombre: "Fondos en paralelas", series: "3x12" }
  ]
};

function guardarDatos() {
  localStorage.setItem("trueFitness_data", JSON.stringify(appData));
}

function cargarTodo() {
  // Perfil e IMC
  const imc = (appData.peso / (appData.altura * appData.altura)).toFixed(1);
  document.getElementById("user-name-display").textContent = appData.nombre;
  document.getElementById("perfil-nombre").textContent = appData.nombre;
  document.getElementById("stat-peso").textContent = `${appData.peso} kg`;
  document.getElementById("stat-altura").textContent = `${appData.altura} m`;
  document.getElementById("stat-edad").textContent = appData.edad;
  document.getElementById("stat-imc").textContent = imc;

  // Calorías
  document.getElementById("calorias-actuales").textContent = appData.calorias;
  document.getElementById("inicio-calorias").textContent = appData.calorias;

  // Ejercicios
  renderizarEjercicios();
}

// Entrenos
function seleccionarPlan(titulo, meta) {
  document.getElementById("plan-activo-titulo").textContent = titulo;
  document.getElementById("plan-activo-meta").textContent = meta;
}

function renderizarEjercicios() {
  const lista = document.getElementById("lista-ejercicios");
  lista.innerHTML = "";
  appData.ejercicios.forEach((ej, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${ej.nombre}</strong> — ${ej.series}</span>
      <button class="btn-del" onclick="borrarEjercicio(${idx})">✕</button>
    `;
    lista.appendChild(li);
  });
}

document.getElementById("form-ejercicio").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("input-nombre").value.trim();
  const series = document.getElementById("input-series").value.trim();
  if (!nombre || !series) return;

  appData.ejercicios.push({ nombre, series });
  document.getElementById("input-nombre").value = "";
  document.getElementById("input-series").value = "";
  guardarDatos();
  renderizarEjercicios();
});

function borrarEjercicio(idx) {
  appData.ejercicios.splice(idx, 1);
  guardarDatos();
  renderizarEjercicios();
}

// Nutrición
function registrarComida() {
  const input = document.getElementById("input-comida-cal");
  const valor = parseInt(input.value, 10);
  if (valor > 0) {
    appData.calorias += valor;
    input.value = "";
    guardarDatos();
    cargarTodo();
  }
}

// Perfil
function editarPerfil() {
  const nuevoNombre = prompt("Tu nombre:", appData.nombre);
  const nuevoPeso = parseFloat(prompt("Tu peso en kg:", appData.peso));
  const nuevaAltura = parseFloat(prompt("Tu altura en metros (ej. 1.75):", appData.altura));

  if (nuevoNombre) appData.nombre = nuevoNombre;
  if (nuevoPeso > 0) appData.peso = nuevoPeso;
  if (nuevaAltura > 0) appData.altura = nuevaAltura;

  guardarDatos();
  cargarTodo();
}

function reiniciarDatos() {
  if (confirm("¿Seguro que quieres reiniciar tus datos?")) {
    localStorage.removeItem("trueFitness_data");
    location.reload();
  }
}