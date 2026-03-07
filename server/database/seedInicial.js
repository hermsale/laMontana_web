// ============================================================================
// Archivo: seedInicial.js
// Contexto: Seed de datos de ejemplo para SQLite.
// Alcance: Inserta usuario de pruebas, productos, noticias, promociones y servicios
//          y normaliza datos legacy en tablas relacionales.
// Ejecución: Al iniciar el servidor.
// Saltar: SKIP_SEED=true en server/.env
// ============================================================================

import db from "./db.js";
import crypto from "crypto";
import { hashearPassword } from "../src/utils/seguridad.js";

const generarId = () => crypto.randomBytes(10).toString("hex");
const ahora = () => new Date().toISOString();

const productosBase = [
  { nombre: "Apuntes B/N Medicina", descripcion: "Impresion laser en blanco y negro, papel 75gr, anillado simple.", categoria: "apuntes", tipo: "producto", precio: 900, imagenes: ["/images/catalogo/apuntes-med-bn.jpg"] },
  { nombre: "Apuntes Color Medicina", descripcion: "Apuntes a color para anatomia y histologia, papel 100gr.", categoria: "apuntes", tipo: "producto", precio: 1800, imagenes: ["/images/catalogo/apuntes-med-color.jpg"] },
  { nombre: "Manual de Practicas Clinicas", descripcion: "Manual encuadernado tapa blanda, ideal para rotaciones.", categoria: "manuales", tipo: "producto", precio: 5200, imagenes: ["/images/catalogo/manual-practicas.jpg"] },
  { nombre: "Guia de Semiologia", descripcion: "Cuadernillo anillado, impresion B/N, laminado de tapa.", categoria: "manuales", tipo: "producto", precio: 3900, imagenes: ["/images/catalogo/guia-semiologia.jpg"] },
  { nombre: "Libro Resumen Fisiologia", descripcion: "Tapa blanda, papel ahuesado, armado tipo libro.", categoria: "libros", tipo: "producto", precio: 6500, imagenes: ["/images/catalogo/libro-fisiologia.jpg"] },
  { nombre: "Compendio Neurociencias", descripcion: "Impresion a color, encuadernado termico con tapa transparente.", categoria: "libros", tipo: "producto", precio: 7200, imagenes: ["/images/catalogo/compendio-neuro.jpg"] },
  { nombre: "Dossier Investigacion Sociales", descripcion: "Compilado A4 para metodologias cualitativas, anillado metalico.", categoria: "apuntes", tipo: "producto", precio: 2100, imagenes: ["/images/catalogo/dossier-sociales.jpg"] },
  { nombre: "Lecturas Clasicas Sociologia", descripcion: "Pack de textos en B/N, papel 80gr, refuerzo de tapa.", categoria: "libros", tipo: "producto", precio: 3400, imagenes: ["/images/catalogo/lecturas-sociologia.jpg"] },
  { nombre: "Cuadernillo Trabajo de Campo", descripcion: "Impresion a color de grillas y mapas, anillado resistente.", categoria: "manuales", tipo: "producto", precio: 2600, imagenes: ["/images/catalogo/cuadernillo-campo.jpg"] },
  { nombre: "Guia Estadistica Sociales", descripcion: "Hojas A4, B/N, con separadores plasticos y anillado doble.", categoria: "manuales", tipo: "producto", precio: 3100, imagenes: ["/images/catalogo/guia-estadistica.jpg"] },
];

const noticiasBase = [
  { titulo: "Imprenta estudiantil suma guardias de examenes", descripcion: "Extendemos horarios en epocas de finales para Medicina y Sociales con retiro en el dia.", categorias: ["servicio"], esNueva: true, fecha: new Date().toISOString(), disponible: true },
  { titulo: "Nuevos papeles eco para apuntes", descripcion: "Incorporamos papel reciclado 80gr para tiradas grandes de apuntes y dossiers.", categorias: ["sustentable"], esNueva: true, fecha: new Date().toISOString(), disponible: true },
];

const promocionesBase = [
  { nombre: "Promo finales Medicina", descripcion: "10% OFF en apuntes y manuales de clinica y fisiologia.", descuento: 0.1, categorias: ["apuntes", "manuales"], disponible: true },
  { nombre: "Pack color Sociales", descripcion: "15% OFF en impresiones a color para material de campo y laminas.", descuento: 0.15, categorias: ["apuntes", "color"], disponible: true },
  { nombre: "Tesis encuadernada UBA", descripcion: "12% OFF en encuadernado termico o tapa blanda para tesis cortas.", descuento: 0.12, categorias: ["encuadernados"], disponible: true },
];

const serviciosBase = [
  { nombre: "fotocopiado_bn", descripcion: "Fotocopiado en blanco y negro por carilla, simple faz.", precio: 40, disponible: true },
  { nombre: "fotocopiado_color", descripcion: "Fotocopiado/color por carilla, simple faz.", precio: 120, disponible: true },
  { nombre: "doble_faz", descripcion: "Recargo o ajuste por impresión doble faz.", precio: 0.8, disponible: true },
  { nombre: "encuadernado", descripcion: "Encuadernado simple (tapa blanda).", precio: 1500, disponible: true },
  { nombre: "anillado", descripcion: "Anillado plástico o metálico estándar.", precio: 900, disponible: true },
];

const usuarioPrueba = {
  email: "prueba@prueba.com",
  password: "targetgtr",
  nombre: "Usuario",
  apellido: "Prueba",
};

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseJsonObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const existePorCampo = (tabla, campo, valor) => {
  const row = db.prepare(`SELECT 1 FROM ${tabla} WHERE ${campo} = ? LIMIT 1`).get(valor);
  return !!row;
};

const existeProducto = db.prepare("SELECT 1 FROM productos WHERE id = ? LIMIT 1");

const upsertProductoImagenStmt = db.prepare(`
  INSERT INTO producto_imagenes (id, productoId, url, orden, creadoEn, actualizadoEn)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(productoId, url)
  DO UPDATE SET orden = excluded.orden, actualizadoEn = excluded.actualizadoEn
`);

const upsertPromocionCategoriaStmt = db.prepare(`
  INSERT INTO promocion_categorias (id, promocionId, categoria, creadoEn, actualizadoEn)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(promocionId, categoria)
  DO UPDATE SET actualizadoEn = excluded.actualizadoEn
`);

const upsertNoticiaCategoriaStmt = db.prepare(`
  INSERT INTO noticia_categorias (id, noticiaId, categoria, creadoEn, actualizadoEn)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(noticiaId, categoria)
  DO UPDATE SET actualizadoEn = excluded.actualizadoEn
`);

const upsertCarritoItemStmt = db.prepare(`
  INSERT INTO carrito_items (
    id, carritoId, productoId, cantidad, precioUnitario, nombre, descripcion, imagen, categoria, creadoEn, actualizadoEn
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(carritoId, productoId)
  DO UPDATE SET
    cantidad = excluded.cantidad,
    precioUnitario = excluded.precioUnitario,
    nombre = excluded.nombre,
    descripcion = excluded.descripcion,
    imagen = excluded.imagen,
    categoria = excluded.categoria,
    actualizadoEn = excluded.actualizadoEn
`);

const upsertPedidoArchivoStmt = db.prepare(`
  INSERT INTO pedido_archivos (id, pedidoId, nombre, tipo, tamano, creadoEn, actualizadoEn)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(pedidoId)
  DO UPDATE SET
    nombre = excluded.nombre,
    tipo = excluded.tipo,
    tamano = excluded.tamano,
    actualizadoEn = excluded.actualizadoEn
`);

const insertarPedidoItemStmt = db.prepare(`
  INSERT INTO pedido_items (
    id, pedidoId, productoId, tipo, nombre, descripcion, categoria, cantidad, precioUnitario, subtotal, meta, creadoEn, actualizadoEn
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertarPedidoEstadoStmt = db.prepare(`
  INSERT INTO pedido_estados (id, pedidoId, estado, creadoEn)
  VALUES (?, ?, ?, ?)
`);

const sincronizarImagenesProducto = (productoId, imagenes = []) => {
  const ahoraStr = ahora();
  imagenes
    .filter((url) => typeof url === "string" && url.trim() !== "")
    .forEach((url, orden) => {
      upsertProductoImagenStmt.run(generarId(), productoId, url.trim(), orden, ahoraStr, ahoraStr);
    });
};

const sincronizarCategoriasPromocion = (promocionId, categorias = []) => {
  const ahoraStr = ahora();
  categorias
    .filter((categoria) => typeof categoria === "string" && categoria.trim() !== "")
    .forEach((categoria) => {
      upsertPromocionCategoriaStmt.run(
        generarId(),
        promocionId,
        categoria.trim().toLowerCase(),
        ahoraStr,
        ahoraStr
      );
    });
};

const sincronizarCategoriasNoticia = (noticiaId, categorias = []) => {
  const ahoraStr = ahora();
  categorias
    .filter((categoria) => typeof categoria === "string" && categoria.trim() !== "")
    .forEach((categoria) => {
      upsertNoticiaCategoriaStmt.run(
        generarId(),
        noticiaId,
        categoria.trim().toLowerCase(),
        ahoraStr,
        ahoraStr
      );
    });
};

const insertarUsuarioPrueba = async () => {
  if (existePorCampo("usuarios", "email", usuarioPrueba.email)) {
    return { creado: false, omitido: true };
  }
  const id = generarId();
  const passwordHash = await hashearPassword(usuarioPrueba.password);
  const ahoraStr = ahora();
  db.prepare(
    `INSERT INTO usuarios (id, uid, nombre, apellido, email, telefono, direccion, passwordHash, creadoEn, actualizadoEn)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, id, usuarioPrueba.nombre, usuarioPrueba.apellido, usuarioPrueba.email, "", "", passwordHash, ahoraStr, ahoraStr);
  return { creado: true, omitido: false };
};

const insertarProductos = () => {
  const insert = db.prepare(`
    INSERT INTO productos (id, nombre, descripcion, categoria, tipo, precio, disponible, imagenes, creadoEn, actualizadoEn)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const byName = db.prepare("SELECT id FROM productos WHERE nombre = ? LIMIT 1");

  let creados = 0;
  for (const p of productosBase) {
    const existente = byName.get(p.nombre);
    const ahoraStr = ahora();
    let productoId = existente?.id;

    if (!productoId) {
      productoId = generarId();
      insert.run(
        productoId,
        p.nombre,
        p.descripcion || "",
        p.categoria || "",
        p.tipo || "producto",
        Number(p.precio) || 0,
        p.disponible !== false ? 1 : 0,
        JSON.stringify(p.imagenes || []),
        ahoraStr,
        ahoraStr
      );
      creados++;
    }

    sincronizarImagenesProducto(productoId, p.imagenes || []);
  }
  return { creados, omitidos: productosBase.length - creados };
};

const insertarNoticias = () => {
  const insert = db.prepare(`
    INSERT INTO noticias (id, titulo, descripcion, categorias, esNueva, fecha, disponible, creadoEn, actualizadoEn)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const byTitulo = db.prepare("SELECT id FROM noticias WHERE titulo = ? LIMIT 1");

  let creados = 0;
  for (const n of noticiasBase) {
    const existente = byTitulo.get(n.titulo);
    const ahoraStr = ahora();
    let noticiaId = existente?.id;

    if (!noticiaId) {
      noticiaId = generarId();
      insert.run(
        noticiaId,
        n.titulo,
        n.descripcion || "",
        JSON.stringify(n.categorias || []),
        n.esNueva ? 1 : 0,
        n.fecha || ahoraStr,
        n.disponible !== false ? 1 : 0,
        ahoraStr,
        ahoraStr
      );
      creados++;
    }

    sincronizarCategoriasNoticia(noticiaId, n.categorias || []);
  }
  return { creados, omitidos: noticiasBase.length - creados };
};

const insertarPromociones = () => {
  const insert = db.prepare(`
    INSERT INTO promociones (id, nombre, descripcion, descuento, categorias, disponible, creadoEn, actualizadoEn)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const byNombre = db.prepare("SELECT id FROM promociones WHERE nombre = ? LIMIT 1");

  let creados = 0;
  for (const p of promocionesBase) {
    const existente = byNombre.get(p.nombre);
    const ahoraStr = ahora();
    let promocionId = existente?.id;

    if (!promocionId) {
      promocionId = generarId();
      insert.run(
        promocionId,
        p.nombre,
        p.descripcion || "",
        Number(p.descuento) || 0,
        JSON.stringify(p.categorias || []),
        p.disponible !== false ? 1 : 0,
        ahoraStr,
        ahoraStr
      );
      creados++;
    }

    sincronizarCategoriasPromocion(promocionId, p.categorias || []);
  }
  return { creados, omitidos: promocionesBase.length - creados };
};

const insertarServicios = () => {
  const insert = db.prepare(`
    INSERT INTO servicios (id, nombre, descripcion, precio, disponible, creadoEn, actualizadoEn)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  let creados = 0;
  for (const s of serviciosBase) {
    if (existePorCampo("servicios", "nombre", s.nombre)) continue;
    insert.run(generarId(), s.nombre, s.descripcion || "", Number(s.precio) || 0, s.disponible !== false ? 1 : 0, ahora(), ahora());
    creados++;
  }
  return { creados, omitidos: serviciosBase.length - creados };
};

const normalizarItemsCarritosLegacy = () => {
  const carritos = db.prepare("SELECT id, items FROM carritos").all();
  const countByCarrito = db.prepare("SELECT COUNT(1) AS c FROM carrito_items WHERE carritoId = ?");
  let migrados = 0;

  const tx = db.transaction((rows) => {
    for (const carrito of rows) {
      const existentes = countByCarrito.get(carrito.id)?.c || 0;
      if (existentes > 0) continue;

      const itemsLegacy = parseJsonArray(carrito.items);
      if (itemsLegacy.length === 0) continue;

      for (const raw of itemsLegacy) {
        const productoIdRaw = raw?.productoId || raw?.id;
        if (!productoIdRaw) continue;
        const productoId = String(productoIdRaw).trim();
        if (!productoId || !existeProducto.get(productoId)) continue;

        const cantidad = Math.max(1, Number(raw.cantidad) || 1);
        const precioUnitario = Number(raw.precioUnitario ?? raw.precio) || 0;
        const ahoraStr = ahora();

        upsertCarritoItemStmt.run(
          generarId(),
          carrito.id,
          productoId,
          cantidad,
          precioUnitario,
          raw.nombre || "",
          raw.descripcion || "",
          raw.imagen || "",
          raw.categoria || "",
          ahoraStr,
          ahoraStr
        );
        migrados++;
      }
    }
  });

  tx(carritos);
  return migrados;
};

const normalizarItemsPedidosLegacy = () => {
  const pedidos = db.prepare("SELECT id, items FROM pedidos").all();
  const countByPedido = db.prepare("SELECT COUNT(1) AS c FROM pedido_items WHERE pedidoId = ?");
  let migrados = 0;

  const tx = db.transaction((rows) => {
    for (const pedido of rows) {
      const existentes = countByPedido.get(pedido.id)?.c || 0;
      if (existentes > 0) continue;

      const itemsLegacy = parseJsonArray(pedido.items);
      if (itemsLegacy.length === 0) continue;

      for (const raw of itemsLegacy) {
        const productoIdRaw = raw?.productoId || raw?.id;
        const productoId =
          productoIdRaw && existeProducto.get(String(productoIdRaw).trim())
            ? String(productoIdRaw).trim()
            : null;
        const cantidad = Math.max(1, Number(raw?.cantidad) || 1);
        const precioUnitario = Number(raw?.precioUnitario ?? raw?.precio) || 0;
        const subtotal = Number(raw?.subtotal) || cantidad * precioUnitario;
        const meta = raw?.meta && typeof raw.meta === "object" ? raw.meta : {};
        const ahoraStr = ahora();

        insertarPedidoItemStmt.run(
          generarId(),
          pedido.id,
          productoId,
          raw?.tipo || "producto",
          raw?.nombre || "",
          raw?.descripcion || "",
          raw?.categoria || "",
          cantidad,
          precioUnitario,
          subtotal,
          JSON.stringify(meta),
          ahoraStr,
          ahoraStr
        );
        migrados++;
      }
    }
  });

  tx(pedidos);
  return migrados;
};

const normalizarArchivosPedidosLegacy = () => {
  const pedidos = db.prepare("SELECT id, archivo FROM pedidos").all();
  const tieneArchivo = db.prepare("SELECT 1 FROM pedido_archivos WHERE pedidoId = ? LIMIT 1");
  let migrados = 0;

  const tx = db.transaction((rows) => {
    for (const pedido of rows) {
      if (tieneArchivo.get(pedido.id)) continue;
      const archivo = parseJsonObject(pedido.archivo);
      if (!archivo.nombre && !archivo.tipo && !archivo.tamano) continue;

      const ahoraStr = ahora();
      upsertPedidoArchivoStmt.run(
        generarId(),
        pedido.id,
        String(archivo.nombre || ""),
        String(archivo.tipo || ""),
        Math.max(0, Number(archivo.tamano) || 0),
        ahoraStr,
        ahoraStr
      );
      migrados++;
    }
  });

  tx(pedidos);
  return migrados;
};

const normalizarEstadosPedidosLegacy = () => {
  const pedidos = db.prepare("SELECT id, estado, historialEstados, creadoEn FROM pedidos").all();
  const countByPedido = db.prepare("SELECT COUNT(1) AS c FROM pedido_estados WHERE pedidoId = ?");
  let migrados = 0;

  const tx = db.transaction((rows) => {
    for (const pedido of rows) {
      const existentes = countByPedido.get(pedido.id)?.c || 0;
      if (existentes > 0) continue;

      const historial = parseJsonArray(pedido.historialEstados);
      const estados = historial.length ? historial : [pedido.estado || "pendiente"];

      estados.forEach((estado) => {
        if (typeof estado !== "string" || estado.trim() === "") return;
        insertarPedidoEstadoStmt.run(
          generarId(),
          pedido.id,
          estado.trim().toLowerCase(),
          pedido.creadoEn || ahora()
        );
        migrados++;
      });
    }
  });

  tx(pedidos);
  return migrados;
};

const normalizarImagenesProductosLegacy = () => {
  const rows = db.prepare("SELECT id, imagenes FROM productos").all();
  let migrados = 0;

  const tx = db.transaction((productos) => {
    for (const row of productos) {
      const imagenes = parseJsonArray(row.imagenes);
      if (imagenes.length === 0) continue;
      const before = db
        .prepare("SELECT COUNT(1) AS c FROM producto_imagenes WHERE productoId = ?")
        .get(row.id)?.c || 0;
      sincronizarImagenesProducto(row.id, imagenes);
      const after = db
        .prepare("SELECT COUNT(1) AS c FROM producto_imagenes WHERE productoId = ?")
        .get(row.id)?.c || 0;
      migrados += Math.max(0, after - before);
    }
  });

  tx(rows);
  return migrados;
};

const normalizarCategoriasPromocionesLegacy = () => {
  const rows = db.prepare("SELECT id, categorias FROM promociones").all();
  let migrados = 0;

  const tx = db.transaction((promociones) => {
    for (const row of promociones) {
      const categorias = parseJsonArray(row.categorias);
      if (categorias.length === 0) continue;
      const before = db
        .prepare("SELECT COUNT(1) AS c FROM promocion_categorias WHERE promocionId = ?")
        .get(row.id)?.c || 0;
      sincronizarCategoriasPromocion(row.id, categorias);
      const after = db
        .prepare("SELECT COUNT(1) AS c FROM promocion_categorias WHERE promocionId = ?")
        .get(row.id)?.c || 0;
      migrados += Math.max(0, after - before);
    }
  });

  tx(rows);
  return migrados;
};

const normalizarCategoriasNoticiasLegacy = () => {
  const rows = db.prepare("SELECT id, categorias FROM noticias").all();
  let migrados = 0;

  const tx = db.transaction((noticias) => {
    for (const row of noticias) {
      const categorias = parseJsonArray(row.categorias);
      if (categorias.length === 0) continue;
      const before = db
        .prepare("SELECT COUNT(1) AS c FROM noticia_categorias WHERE noticiaId = ?")
        .get(row.id)?.c || 0;
      sincronizarCategoriasNoticia(row.id, categorias);
      const after = db
        .prepare("SELECT COUNT(1) AS c FROM noticia_categorias WHERE noticiaId = ?")
        .get(row.id)?.c || 0;
      migrados += Math.max(0, after - before);
    }
  });

  tx(rows);
  return migrados;
};

const sincronizarTotalCarritos = () => {
  const rows = db.prepare("SELECT id FROM carritos").all();
  const calcular = db.prepare(
    "SELECT COALESCE(SUM(cantidad * precioUnitario), 0) AS total FROM carrito_items WHERE carritoId = ?"
  );
  const update = db.prepare("UPDATE carritos SET total = ?, actualizadoEn = ? WHERE id = ?");

  const tx = db.transaction((carritos) => {
    for (const row of carritos) {
      const total = Number(calcular.get(row.id)?.total) || 0;
      update.run(total, ahora(), row.id);
    }
  });

  tx(rows);
};

const normalizarLegacyData = () => {
  const productosImg = normalizarImagenesProductosLegacy();
  const promoCats = normalizarCategoriasPromocionesLegacy();
  const noticiaCats = normalizarCategoriasNoticiasLegacy();
  const carritoItems = normalizarItemsCarritosLegacy();
  const pedidoItems = normalizarItemsPedidosLegacy();
  const pedidoArchivos = normalizarArchivosPedidosLegacy();
  const pedidoEstados = normalizarEstadosPedidosLegacy();
  sincronizarTotalCarritos();

  return {
    productoImagenes: productosImg,
    promocionCategorias: promoCats,
    noticiaCategorias: noticiaCats,
    carritoItems,
    pedidoItems,
    pedidoArchivos,
    pedidoEstados,
  };
};

const seedInicial = async () => {
  if (process.env.SKIP_SEED === "true") {
    console.log("[seed] SKIP_SEED=true, se omite la carga inicial.");
    return { skip: true };
  }

  const usuario = await insertarUsuarioPrueba();
  const productos = insertarProductos();
  const noticias = insertarNoticias();
  const promociones = insertarPromociones();
  const servicios = insertarServicios();
  const normalizacion = normalizarLegacyData();

  console.log("[seed] Usuario prueba:", usuario);
  console.log("[seed] Productos:", productos);
  console.log("[seed] Noticias:", noticias);
  console.log("[seed] Promociones:", promociones);
  console.log("[seed] Servicios:", servicios);
  console.log("[seed] Normalizacion:", normalizacion);

  return { usuario, productos, noticias, promociones, servicios, normalizacion };
};

export default seedInicial;
