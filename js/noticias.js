// ==============================
// Noticias: ordenar, filtrar por categoría y "Mostrar más"
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector('section[aria-labelledby="noticias"]');
  if (!section) return;

  const list          = section.querySelector(".news-list");
  const box           = section.querySelector(".news-box");
  const btnRecientes  = document.getElementById("btn-news-recientes");
  const btnTodas      = document.getElementById("btn-news-todas");
  const btnCategorias = document.getElementById("btn-news-categorias");
  const catMenu       = document.getElementById("cat-menu");
  const btnMas        = document.getElementById("btn-news-more");

  const PAGE_SIZE = 4;
  let visible = PAGE_SIZE;    // cuántos ítems mostramos
  let mode    = "recientes";  // "recientes" | "todas"
  let cat     = "todas";      // categoría activa

  // cache inicial (en orden DOM)
  const allItems = Array.from(list.children);

  // Helpers
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function parseDate(el) {
    const t = el.querySelector("time[datetime]");
    if (t?.getAttribute("datetime")) return new Date(t.getAttribute("datetime"));
    if (el.dataset?.date) return new Date(el.dataset.date);
    return new Date(0); // sin fecha => muy viejo
  }
  function parseDiscount(el) {
    if (el.dataset?.discount) return Number(el.dataset.discount) || 0;
    const matches = el.textContent.match(/(\d{1,3})\s*%/g);
    if (!matches) return 0;
    return Math.max(...matches.map(s => parseInt(s, 10)));
  }
  function hasCategory(el, c) {
    if (c === "todas") return true;
    const raw = (el.dataset.cats || "").toLowerCase();
    return raw.split(",").map(s => s.trim()).includes(c.toLowerCase());
  }

  // Orden según modo
  function order(items) {
    const arr = items.slice();
    if (mode === "recientes") {
      return arr.sort((a, b) => parseDate(b) - parseDate(a));
    } else { // "todas": promos primero, luego por descuento y fecha
      const promos = [], others = [];
      arr.forEach(el => (el.classList.contains("promo") ? promos : others).push(el));
      const byImp = (a, b) =>
        (parseDiscount(b) - parseDiscount(a)) || (parseDate(b) - parseDate(a));
      promos.sort(byImp);
      others.sort(byImp);
      return [...promos, ...others];
    }
  }

  // Pipeline: filtrar por cat + ordenar
  function pipeline() {
    const filtered = allItems.filter(el => hasCategory(el, cat));
    return order(filtered);
  }

  // Render con paginado
  function render() {
    const source = pipeline();
    const slice  = source.slice(0, visible);
    const frag   = document.createDocumentFragment();
    slice.forEach(el => frag.appendChild(el));
    list.innerHTML = "";
    list.appendChild(frag);

    // Mostrar/ocultar "Mostrar más"
    if (btnMas) btnMas.hidden = visible >= source.length;

    // reset scroll del contenedor al cambiar filtros/orden
    if (box) box.scrollTop = 0;
  }

  function setActive(btn) {
    [btnRecientes, btnTodas].forEach(b => b?.classList.remove("active"));
    btn?.classList.add("active");
  }

  // Listeners de chips
  btnRecientes?.addEventListener("click", () => {
    mode = "recientes";
    visible = PAGE_SIZE;
    setActive(btnRecientes);
    render();
  });
  btnTodas?.addEventListener("click", () => {
    mode = "todas";
    visible = PAGE_SIZE;
    setActive(btnTodas);
    render();
  });

  // Mostrar más
  btnMas?.addEventListener("click", () => {
    visible += PAGE_SIZE;
    render();
  });

  // Dropdown categorías
  btnCategorias?.addEventListener("click", () => {
    const open = catMenu.hidden;
    catMenu.hidden = !open;
    btnCategorias.setAttribute("aria-expanded", String(open));
  });
  catMenu?.addEventListener("click", (e) => {
    const item = e.target.closest(".cat-item");
    if (!item) return;
    // marcar seleccionado
    catMenu.querySelectorAll(".cat-item").forEach(b =>
      b.setAttribute("aria-checked", String(b === item))
    );
    cat = item.dataset.cat || "todas";
    visible = PAGE_SIZE;

    // actualizar etiqueta del botón (opcional)
    btnCategorias.textContent = (cat === "todas" ? "Categorías" : `Categorías: ${cap(cat)}`) + " ▾";

    // cerrar y renderizar
    catMenu.hidden = true;
    btnCategorias.setAttribute("aria-expanded", "false");
    render();
  });
  document.addEventListener("click", (e) => {
    if (!catMenu || catMenu.hidden) return;
    if (!catMenu.contains(e.target) && !btnCategorias.contains(e.target)) {
      catMenu.hidden = true;
      btnCategorias.setAttribute("aria-expanded", "false");
    }
  });

  // Render inicial
  render();
});
