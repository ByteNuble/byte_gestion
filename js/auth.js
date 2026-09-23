// =========================================================
// auth.js — Autenticación demostrativa
// =========================================================
// Este módulo es SOLO una simulación de login.
// No es un sistema de autenticación seguro.
// Su única función es demostrar la interfaz y proteger
// el acceso a app.html dentro de la demo.
// =========================================================


// ---------------------------------------------------------
// 1. CONSTANTES
// ---------------------------------------------------------

const DEMO_USER = "demo@bytenuble.cl";
const DEMO_PASS = "demo1234";

// Claves de localStorage
const SESSION_KEY = "bg_session";


// ---------------------------------------------------------
// 2. UTILIDADES DE SESIÓN
// (reutilizables desde app.js)
// ---------------------------------------------------------

/**
 * Devuelve el objeto de sesión guardado, o null si no existe.
 */
function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Indica si hay una sesión activa.
 */
function isLoggedIn() {
  return getSession() !== null;
}

/**
 * Guarda la sesión activa.
 */
function saveSession(user) {
  const session = {
    loggedIn: true,
    user: user,
    at: Date.now()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Elimina la sesión activa.
 */
function logout() {
  localStorage.removeItem(SESSION_KEY);
}


// ---------------------------------------------------------
// 3. LÓGICA DE LA PANTALLA DE LOGIN
// (solo se ejecuta si estamos en index.html)
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("login-form");

  // Si NO existe el formulario, estamos en app.html.
  // No hacemos nada aquí; app.js se encarga.
  if (!form) return;

  // Referencias del DOM
  const emailEl   = document.getElementById("email");
  const passEl    = document.getElementById("password");
  const errorEl   = document.getElementById("login-error");
  const toggleBtn = document.getElementById("toggle-pass");
  const loginBtn  = document.getElementById("login-btn");

  // Si ya hay sesión activa, saltar directo a la app
  if (isLoggedIn()) {
    window.location.href = "app.html";
    return;
  }

  // -------------------------------------------------------
  // Mostrar / ocultar contraseña
  // -------------------------------------------------------
  toggleBtn.addEventListener("click", () => {
    const esPassword = passEl.type === "password";
    passEl.type = esPassword ? "text" : "password";
    toggleBtn.textContent = esPassword ? "Ocultar" : "Ver";
  });

  // -------------------------------------------------------
  // Envío del formulario
  // -------------------------------------------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ocultarError();

    const email = emailEl.value.trim().toLowerCase();
    const pass  = passEl.value;

    // Validación básica
    if (!email || !pass) {
      mostrarError("Completa todos los campos.");
      return;
    }

    if (!esEmailValido(email)) {
      mostrarError("Ingresa un correo electrónico válido.");
      return;
    }

    // Estado "cargando" para dar sensación de sistema real
    loginBtn.disabled = true;
    loginBtn.textContent = "Ingresando…";

    setTimeout(() => {
      if (email === DEMO_USER && pass === DEMO_PASS) {
        saveSession(email);
        window.location.href = "app.html";
      } else {
        loginBtn.disabled = false;
        loginBtn.textContent = "Ingresar";
        mostrarError("Credenciales incorrectas. Verifica el correo y la contraseña.");
      }
    }, 450);
  });

  // -------------------------------------------------------
  // Funciones auxiliares
  // -------------------------------------------------------
  function mostrarError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  function ocultarError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  function esEmailValido(email) {
    // Validación simple, suficiente para una demo
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});