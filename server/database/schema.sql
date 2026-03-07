-- Esquema SQLite para La Montaña
-- Ejecutar con: node database/init.js

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  uid TEXT,
  nombre TEXT NOT NULL,
  apellido TEXT,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT DEFAULT '',
  direccion TEXT DEFAULT '',
  passwordHash TEXT NOT NULL,
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL
);

-- Productos
CREATE TABLE IF NOT EXISTS productos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  categoria TEXT DEFAULT '',
  tipo TEXT DEFAULT 'producto',
  precio REAL NOT NULL DEFAULT 0,
  disponible INTEGER NOT NULL DEFAULT 1,
  imagenes TEXT DEFAULT '[]',
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL
);

-- Imágenes de productos (normalizado)
CREATE TABLE IF NOT EXISTS producto_imagenes (
  id TEXT PRIMARY KEY,
  productoId TEXT NOT NULL,
  url TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL,
  FOREIGN KEY (productoId) REFERENCES productos(id) ON DELETE CASCADE
);

-- Servicios
CREATE TABLE IF NOT EXISTS servicios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  precio REAL NOT NULL DEFAULT 0,
  disponible INTEGER NOT NULL DEFAULT 1,
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL
);

-- Promociones
CREATE TABLE IF NOT EXISTS promociones (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  descuento REAL NOT NULL DEFAULT 0,
  categorias TEXT DEFAULT '[]',
  disponible INTEGER NOT NULL DEFAULT 1,
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL
);

-- Categorías de promociones (normalizado)
CREATE TABLE IF NOT EXISTS promocion_categorias (
  id TEXT PRIMARY KEY,
  promocionId TEXT NOT NULL,
  categoria TEXT NOT NULL,
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL,
  FOREIGN KEY (promocionId) REFERENCES promociones(id) ON DELETE CASCADE
);

-- Noticias
CREATE TABLE IF NOT EXISTS noticias (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  categorias TEXT DEFAULT '[]',
  esNueva INTEGER NOT NULL DEFAULT 0,
  fecha TEXT,
  disponible INTEGER NOT NULL DEFAULT 1,
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL
);

-- Categorías de noticias (normalizado)
CREATE TABLE IF NOT EXISTS noticia_categorias (
  id TEXT PRIMARY KEY,
  noticiaId TEXT NOT NULL,
  categoria TEXT NOT NULL,
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL,
  FOREIGN KEY (noticiaId) REFERENCES noticias(id) ON DELETE CASCADE
);

-- Carritos
CREATE TABLE IF NOT EXISTS carritos (
  id TEXT PRIMARY KEY,
  usuarioId TEXT NOT NULL,
  estado INTEGER NOT NULL DEFAULT 1,
  items TEXT DEFAULT '[]',
  total REAL NOT NULL DEFAULT 0,
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Items de carrito (normalizado)
CREATE TABLE IF NOT EXISTS carrito_items (
  id TEXT PRIMARY KEY,
  carritoId TEXT NOT NULL,
  productoId TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precioUnitario REAL NOT NULL DEFAULT 0,
  nombre TEXT DEFAULT '',
  descripcion TEXT DEFAULT '',
  imagen TEXT DEFAULT '',
  categoria TEXT DEFAULT '',
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL,
  FOREIGN KEY (carritoId) REFERENCES carritos(id) ON DELETE CASCADE,
  FOREIGN KEY (productoId) REFERENCES productos(id) ON DELETE RESTRICT
);

-- Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id TEXT PRIMARY KEY,
  usuarioID TEXT NOT NULL,
  items TEXT DEFAULT '[]',
  archivo TEXT DEFAULT '{}',
  carillas INTEGER DEFAULT 0,
  modo TEXT DEFAULT 'bn',
  dobleFaz INTEGER DEFAULT 0,
  encuadernado INTEGER DEFAULT 0,
  anillado INTEGER DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  estado TEXT DEFAULT 'pendiente',
  historialEstados TEXT DEFAULT '["pendiente"]',
  telefonoContacto TEXT DEFAULT '',
  direccionEnvio TEXT DEFAULT '',
  notasCliente TEXT DEFAULT '',
  metodoPago TEXT DEFAULT '',
  comprobante TEXT DEFAULT '',
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL,
  FOREIGN KEY (usuarioID) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Items de pedido (normalizado)
CREATE TABLE IF NOT EXISTS pedido_items (
  id TEXT PRIMARY KEY,
  pedidoId TEXT NOT NULL,
  productoId TEXT,
  tipo TEXT NOT NULL DEFAULT 'producto',
  nombre TEXT DEFAULT '',
  descripcion TEXT DEFAULT '',
  categoria TEXT DEFAULT '',
  cantidad INTEGER NOT NULL DEFAULT 1,
  precioUnitario REAL NOT NULL DEFAULT 0,
  subtotal REAL NOT NULL DEFAULT 0,
  meta TEXT DEFAULT '{}',
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL,
  FOREIGN KEY (pedidoId) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (productoId) REFERENCES productos(id) ON DELETE SET NULL
);

-- Archivo asociado al pedido (normalizado, 1:1)
CREATE TABLE IF NOT EXISTS pedido_archivos (
  id TEXT PRIMARY KEY,
  pedidoId TEXT NOT NULL UNIQUE,
  nombre TEXT DEFAULT '',
  tipo TEXT DEFAULT '',
  tamano INTEGER DEFAULT 0,
  creadoEn TEXT NOT NULL,
  actualizadoEn TEXT NOT NULL,
  FOREIGN KEY (pedidoId) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- Historial de estados del pedido (normalizado)
CREATE TABLE IF NOT EXISTS pedido_estados (
  id TEXT PRIMARY KEY,
  pedidoId TEXT NOT NULL,
  estado TEXT NOT NULL,
  creadoEn TEXT NOT NULL,
  FOREIGN KEY (pedidoId) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_carritos_usuario_estado ON carritos(usuarioId, estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuarioID);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_carrito_items_carrito_producto ON carrito_items(carritoId, productoId);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_producto_imagenes_producto_url ON producto_imagenes(productoId, url);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_promocion_categorias_promocion_categoria ON promocion_categorias(promocionId, categoria);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_noticia_categorias_noticia_categoria ON noticia_categorias(noticiaId, categoria);
CREATE INDEX IF NOT EXISTS idx_carrito_items_carrito ON carrito_items(carritoId);
CREATE INDEX IF NOT EXISTS idx_pedido_items_pedido ON pedido_items(pedidoId);
CREATE INDEX IF NOT EXISTS idx_pedido_estados_pedido ON pedido_estados(pedidoId);
