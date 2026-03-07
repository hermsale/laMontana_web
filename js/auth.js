// ======================
// Clase Usuario 
// ======================
class Usuario {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
    this.fechaRegistro = new Date().toISOString(); 
  }

  saludo() {
    return `Hola, ${this.nombre}`;
  }
}

// ======================
// Gestor de Autenticación
// ======================
const AuthManager = {
  LS_KEY: "lm_usuario",

  guardar(usuario) {
    // usuario: instancia de Usuario o POJO compatible
    localStorage.setItem(this.LS_KEY, JSON.stringify(usuario));
  },

  leer() {
    const raw = localStorage.getItem(this.LS_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  borrar() {
    localStorage.removeItem(this.LS_KEY);
  },

  isLogged() {
    return !!this.leer();
  }
};

// Exponer de forma global 
window.Usuario = Usuario;
window.AuthManager = AuthManager;
