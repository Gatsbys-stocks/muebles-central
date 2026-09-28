// ============================================================
// Muebles Central · tienda
// Catálogo, favoritos, carrito y pedido contra el backend propio
// (muebles-central-backend). Sin frameworks ni build.
// ============================================================

const API_BASE_URL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://muebles-central-backend.onrender.com";

// ---------- Datos de respaldo ----------
// Si el backend no responde (por ejemplo, mientras Render arranca), la
// tienda se enseña con estos datos para no quedarse en blanco. Los pedidos
// en ese caso se derivan a WhatsApp.
const FALLBACK_CATEGORIES = [
  { id: "sofas", label: "Sofás", subs: ["Sofás", "Sofás cama", "Chaise longue", "Rinconeras"] },
  { id: "dormitorio", label: "Dormitorio", subs: ["Camas", "Colchones", "Cómodas / Cajoneras", "Tocadores", "Mesitas de noche"] },
  { id: "comedor", label: "Comedor", subs: ["Mesas", "Sillas", "Muebles de comedor"] },
  { id: "salon", label: "Salón", subs: ["Muebles de TV", "Mesas de centro", "Estanterías"] },
  { id: "almacenaje", label: "Armarios y almacenaje", subs: ["Armarios", "Zapateros", "Maletas"] },
  { id: "deco", label: "Espejos y decoración", subs: ["Espejos", "Decoración"] },
  { id: "electro", label: "Electrodomésticos", subs: ["Neveras", "Lavadoras", "Cocinas", "Hornos", "Placas vitrocerámica", "Microondas", "Batidoras"] },
];

const FALLBACK_SETTINGS = {
  shop: {
    address: "Carrer del Carme 106, bajo · Puerta 2",
    city: "08001 Barcelona",
    phones: ["617635765", "672303715"],
    whatsapp: "34617635765",
    hours: "",
    tiktok: "muebles_central",
    instagram: "",
  },
  delivery: { pickupEnabled: true, cashOnDelivery: true, zones: [] },
  payments: { card: false, cashOnDelivery: true },
};

const FALLBACK_PRODUCTS = [
  { id: "p1", name: "Sofá chaise longue tapizado", cat: "sofas", sub: "Chaise longue", price: 649, oldPrice: 749, dims: "270 × 160 × 90 cm", colors: ["Gris", "Beige", "Topo"], images: ["img/tienda-1.jpg"], tag: "Nuevo", featured: true, inStock: true, assembly: true, assemblyPrice: 40, description: "Sofá de 3 plazas con chaise longue reversible." },
  { id: "p2", name: "Sofá cama 3 plazas", cat: "sofas", sub: "Sofás cama", price: 459, dims: "200 × 95 × 88 cm", colors: ["Gris oscuro", "Crema"], images: [], tag: "Oferta", featured: true, inStock: true, assembly: true, assemblyPrice: 30, description: "Se abre en un gesto y se convierte en cama de matrimonio." },
  { id: "p4", name: "Sofá rinconera en L", cat: "sofas", sub: "Rinconeras", price: 899, dims: "290 × 220 × 88 cm", colors: ["Gris", "Beige"], images: [], featured: true, inStock: true, assembly: true, assemblyPrice: 50, description: "Rinconera amplia para salones grandes." },
  { id: "p5", name: "Colchón personalizado a medida", cat: "dormitorio", sub: "Colchones", price: 299, dims: "A medida", colors: ["Firmeza media", "Firme", "Extra firme"], images: [], tag: "A medida", featured: true, inStock: true, description: "A la medida de tu cama. 3 años de garantía." },
  { id: "p7", name: "Tocador con espejo y luces", cat: "dormitorio", sub: "Tocadores", price: 279, dims: "100 × 45 × 140 cm", colors: ["Blanco", "Blanco y rosa"], images: ["img/tienda-2.jpg"], tag: "Nuevo", inStock: true, assembly: true, assemblyPrice: 25, description: "Tocador con espejo de camerino y bombillas LED." },
  { id: "p10", name: "Armario de 2 puertas", cat: "almacenaje", sub: "Armarios", price: 329, dims: "100 × 55 × 200 cm", colors: ["Blanco", "Roble"], images: [], inStock: true, assembly: true, assemblyPrice: 40, description: "Armario con barra para colgar y balda superior." },
  { id: "p15", name: "Mesa de comedor extensible", cat: "comedor", sub: "Mesas", price: 349, dims: "160-200 × 90 cm", colors: ["Blanco", "Roble"], images: ["img/tienda-7.jpg"], inStock: true, assembly: true, assemblyPrice: 25, description: "Mesa extensible para 6 a 8 personas." },
  { id: "p17", name: "Nevera combi No Frost", cat: "electro", sub: "Neveras", price: 499, dims: "60 × 65 × 186 cm", colors: ["Blanco", "Inox"], images: [], inStock: true, description: "Frigorífico combi con congelador inferior." },
];

// ---------- Estado ----------
const state = {
  products: [],
  categories: FALLBACK_CATEGORIES,
  settings: FALLBACK_SETTINGS,
  online: false, // ¿respondió el backend?
  cat: "",
  sub: "",
  q: "",
  sort: "new",
  cart: load("mc_cart", []),
  favs: load("mc_favs", []),
};

// ---------- Utilidades ----------
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function eur(n) {
  const v = Number(n || 0);
  return v.toLocaleString("es-ES", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 }) + " €";
}
function fmtPhone(p) {
  return String(p).replace(/\D/g, "").replace(/^(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");
}
function waLink(text) {
  const n = state.settings.shop.whatsapp || "34617635765";
  return `https://wa.me/${n}${text ? "?text=" + encodeURIComponent(text) : ""}`;
}
function catLabel(id) {
  return (state.categories.find((c) => c.id === id) || {}).label || "";
}
function productById(id) {
  return state.products.find((p) => p.id === id);
}
function mainImage(p) {
  return p.images && p.images[0];
}
function picHtml(p, alt = "") {
  const img = mainImage(p);
  return img ? `<img src="${esc(img)}" alt="${esc(alt)}" loading="lazy">` : window.ILL.forProduct(p);
}
function toast(text) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

async function api(path, options = {}) {
  const res = await fetch(API_BASE_URL + path, {
    ...options,
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

// ---------- Carga inicial ----------
async function init() {
  renderSkeleton();
  renderCats();
  renderNav();
  bindGlobal();
  handlePaymentReturn();

  // Render gratis tarda en despertar: si en 12 s no responde, se usa el respaldo.
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 12000));
  try {
    const [products, categories, settings] = await Promise.race([
      Promise.all([api("/api/products"), api("/api/products/categories"), api("/api/settings")]),
      timeout,
    ]);
    state.products = products;
    state.categories = categories;
    state.settings = settings;
    state.online = true;
  } catch (e) {
    console.warn("Backend no disponible, se usa el catálogo de respaldo.", e);
    state.products = FALLBACK_PRODUCTS;
  }

  // Quita del carrito lo que ya no exista en el catálogo.
  state.cart = state.cart.filter((it) => productById(it.id));
  save("mc_cart", state.cart);

  applySettings();
  renderNav();
  renderCats();
  renderFeatured();
  renderCatalog();
  renderCounts();

  // Enlace directo a un producto: .../#p-p1
  const m = location.hash.match(/^#p-(.+)$/);
  if (m && productById(m[1])) openProduct(m[1]);
}

// ---------- Datos de la tienda (horario, redes, teléfonos) ----------
function applySettings() {
  const s = state.settings.shop || {};
  const tiktokUrl = `https://www.tiktok.com/@${s.tiktok || "muebles_central"}`;
  $$(".js-tiktok").forEach((a) => (a.href = tiktokUrl));
  $$(".js-tiktok-handle").forEach((el) => (el.textContent = `@${s.tiktok || "muebles_central"} · TikTok`));
  $$(".js-wa").forEach((a) => (a.href = waLink()));
  if (s.address) {
    $$(".js-address1").forEach((el) => (el.textContent = s.address));
    $$(".js-address").forEach((el) => (el.textContent = `${s.address} · ${s.city || ""}`));
  }
  if (s.city) $$(".js-city").forEach((el) => (el.textContent = s.city));

  const phones = (s.phones || []).filter(Boolean);
  if (phones.length) {
    $("#phones").innerHTML =
      phones.map((p) => `<div class="v"><a href="tel:+34${esc(p.replace(/\D/g, "").slice(-9))}">${esc(fmtPhone(p))}</a></div>`).join("") +
      `<small>Teléfono y WhatsApp</small>`;
    $("#footPhones").textContent = phones.map(fmtPhone).join(" · ");
  }

  if (s.hours) {
    $("#hours").textContent = s.hours;
    $("#hoursRow").hidden = false;
  }

  // Instagram: si la tienda ya tiene usuario, se enlaza; si no, queda el hueco preparado.
  const ig = s.instagram;
  const igIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`;
  if (ig) {
    const url = `https://www.instagram.com/${ig}/`;
    $("#igHandle").textContent = `@${ig}`;
    $("#igBtn").href = url;
    $("#igBtn").hidden = false;
    $("#igText").textContent = "Fotos de la tienda, novedades y muebles en casa de nuestros clientes.";
    $("#igGrid").innerHTML = ["tienda-1", "tienda-2", "tienda-3", "tienda-4", "tienda-6", "tienda-7"]
      .map((f) => `<a href="${url}" target="_blank" rel="noopener"><img src="img/${f}.jpg" alt="" loading="lazy"></a>`)
      .join("");
    ["#hdrInstagram", "#footInstagram"].forEach((sel) => {
      $(sel).href = url;
      $(sel).target = "_blank";
      $(sel).rel = "noopener";
    });
  } else {
    $("#igGrid").innerHTML = Array(6).fill(`<div>${igIcon}</div>`).join("");
  }

  const pay = state.settings.payments || {};
  $("#payText").textContent =
    pay.card && pay.cashOnDelivery ? "Con tarjeta o en la entrega" : pay.card ? "Con tarjeta, pago seguro" : "En la entrega o en tienda";
}

// ---------- Navegación ----------
const CHEV = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>`;

function renderNav() {
  const cats = state.categories;
  // Escritorio: menú con desplegable grande, al estilo Maisons du Monde
  const muebles = cats.filter((c) => c.id !== "electro");
  const electro = cats.find((c) => c.id === "electro");
  const col = (c) =>
    `<div><h4><a href="#catalogo" data-goto="${c.id}">${esc(c.label)}</a></h4><ul>${c.subs
      .map((s) => `<li><a href="#catalogo" data-goto="${c.id}" data-sub="${esc(s)}">${esc(s)}</a></li>`)
      .join("")}</ul></div>`;
  const feat = (cat, sub, eyebrow, text, ill) =>
    `<a class="feat" href="#catalogo" data-goto="${cat}" ${sub ? `data-sub="${esc(sub)}"` : ""}>${window.ILL.get(ill)}<span><span class="eyebrow">${eyebrow}</span><p>${text}</p></span></a>`;

  $("#mainNav").innerHTML = `
    <li><a href="#catalogo" data-goto="">Novedades</a></li>
    ${muebles
      .slice(0, 4)
      .map(
        (c, i) => `<li><a href="#catalogo" data-goto="${c.id}">${esc(c.label)}</a>
        <div class="mega"><div class="wrap inner">${col(c)}${col(muebles[(i + 4) % muebles.length])}
        ${i === 0 ? feat("sofas", "Sofás cama", "En tienda", "Sofás cama para pisos pequeños", "sofabed") : i === 1 ? feat("dormitorio", "Colchones", "A medida", "Colchones con 3 años de garantía", "mattress") : feat(c.id, "", "Te lo montamos", "Envío y montaje en tu casa", ill4(c.id))}</div></div></li>`
      )
      .join("")}
    ${electro ? `<li><a href="#catalogo" data-goto="electro">${esc(electro.label)}</a><div class="mega"><div class="wrap inner">${col(electro)}<div></div>${feat("electro", "", "Pregúntanos", "Te lo llevamos a casa", "washer")}</div></div></li>` : ""}
    <li><a href="#catalogo" data-goto="ofertas" class="hot">Ofertas</a></li>
    <li><a href="#visita">Contacto</a></li>`;

  // Móvil: acordeón como el de Nuestro Hogar
  $("#mobileNav").innerHTML =
    cats
      .map(
        (c) => `<div class="acc"><button aria-expanded="false">${esc(c.label)} ${CHEV}</button><ul hidden>
        <li><a href="#catalogo" data-goto="${c.id}">› Ver todo</a></li>
        ${c.subs.map((s) => `<li><a href="#catalogo" data-goto="${c.id}" data-sub="${esc(s)}">› ${esc(s)}</a></li>`).join("")}</ul></div>`
      )
      .join("") +
    `<div class="acc"><a href="#catalogo" data-goto="ofertas" class="hot">Ofertas</a></div>
     <div class="acc"><a href="#redes">TikTok e Instagram</a></div>
     <div class="acc"><a href="#visita">Contacto</a></div>`;

  $("#footCats").innerHTML = cats.map((c) => `<li><a href="#catalogo" data-goto="${c.id}">${esc(c.label)}</a></li>`).join("");
}
function ill4(id) {
  return { comedor: "table", salon: "tvunit", almacenaje: "wardrobe" }[id] || "chair";
}

function renderCats() {
  $("#cats").innerHTML = state.categories
    .map((c) => `<a class="cat" href="#catalogo" data-goto="${c.id}">${window.ILL.forCategory(c.id)}<span>${esc(c.label)}</span></a>`)
    .join("");
}

// ---------- Tarjetas de producto ----------
function isOnSale(p) {
  return p.oldPrice && p.oldPrice > p.price;
}

function card(p) {
  const inStock = p.inStock !== false;
  const fav = state.favs.includes(p.id);
  const tagCls = p.tag === "Nuevo" ? "new" : p.tag === "Oferta" ? "sale" : "";
  const colors = p.colors && p.colors.length > 1 ? `${p.colors.length} opciones` : "";
  return `
  <article class="card ${inStock ? "" : "off"}">
    <div style="position:relative">
      ${p.tag ? `<span class="tag ${tagCls}">${esc(p.tag)}</span>` : ""}
      <button class="fav" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? "Quitar de favoritos" : "Guardar en favoritos"}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>
      </button>
      <button class="pic" data-open="${p.id}" aria-label="Ver ${esc(p.name)}">${picHtml(p, p.name)}</button>
    </div>
    <h3><button data-open="${p.id}">${esc(p.name)}</button></h3>
    <div class="meta">${esc(p.dims || p.sub || "")}${colors ? " · " + colors : ""}</div>
    <div class="row2">
      <div><span class="price ${isOnSale(p) ? "sale" : ""}">${eur(p.price)}</span>${isOnSale(p) ? `<span class="old">${eur(p.oldPrice)}</span>` : ""}</div>
      ${inStock ? `<button class="add" data-quick="${p.id}">Añadir</button>` : `<span class="soldout">Agotado</span>`}
    </div>
  </article>`;
}

function renderSkeleton() {
  const sk = Array(4).fill('<div class="skeleton"></div>').join("");
  $("#featured").innerHTML = sk;
  $("#grid").innerHTML = sk + sk;
}

function renderFeatured() {
  let list = state.products.filter((p) => p.featured && p.inStock !== false);
  if (list.length < 4) list = list.concat(state.products.filter((p) => !list.includes(p) && p.inStock !== false));
  list = list.slice(0, 4);
  $("#destacados-sec").hidden = list.length === 0;
  $("#featured").innerHTML = list.map(card).join("");
}

// ---------- Catálogo con filtros ----------
function filtered() {
  const q = state.q.trim().toLowerCase();
  let list = state.products.filter((p) => {
    if (state.cat === "ofertas") { if (!isOnSale(p) && p.tag !== "Oferta") return false; }
    else if (state.cat && p.cat !== state.cat) return false;
    if (state.sub && p.sub !== state.sub) return false;
    if (q && ![p.name, p.sub, p.description, catLabel(p.cat), (p.colors || []).join(" ")].join(" ").toLowerCase().includes(q)) return false;
    return true;
  });
  if (state.sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
  // Los agotados, al final
  return [...list.filter((p) => p.inStock !== false), ...list.filter((p) => p.inStock === false)];
}

function renderCatalog() {
  const tabs = [{ id: "", label: "Todo" }, ...state.categories, { id: "ofertas", label: "Ofertas" }];
  $("#tabs").innerHTML = tabs.map((t) => `<button class="tab" data-goto="${t.id}" aria-pressed="${state.cat === t.id}">${esc(t.label)}</button>`).join("");

  const cat = state.categories.find((c) => c.id === state.cat);
  // Solo se enseñan los tipos que tienen algún producto
  const subs = cat ? cat.subs.filter((s) => state.products.some((p) => p.cat === cat.id && p.sub === s)) : [];
  $("#subs").hidden = subs.length < 2;
  $("#subs").innerHTML = subs.length
    ? [`<button class="chip" data-goto="${cat.id}" aria-pressed="${!state.sub}">Todos</button>`]
        .concat(subs.map((s) => `<button class="chip" data-goto="${cat.id}" data-sub="${esc(s)}" aria-pressed="${state.sub === s}">${esc(s)}</button>`))
        .join("")
    : "";

  $("#catTitle").textContent = state.q
    ? `Resultados para “${state.q}”`
    : state.sub || (state.cat === "ofertas" ? "Ofertas" : cat ? cat.label : "Todos los productos");

  const list = filtered();
  $("#grid").innerHTML = list.map(card).join("");
  $("#empty").hidden = list.length > 0;
}

function goto(cat, sub) {
  state.cat = cat || "";
  state.sub = sub || "";
  state.q = "";
  $("#q").value = "";
  renderCatalog();
  closeAll();
  $("#catalogo").scrollIntoView({ behavior: "smooth" });
}

// ---------- Favoritos ----------
function toggleFav(id) {
  const i = state.favs.indexOf(id);
  if (i >= 0) state.favs.splice(i, 1);
  else state.favs.push(id);
  save("mc_favs", state.favs);
  $$(`[data-fav="${id}"]`).forEach((b) => b.setAttribute("aria-pressed", state.favs.includes(id)));
  renderCounts();
}

function openFavs() {
  const list = state.favs.map(productById).filter(Boolean);
  openModal(`
    <div style="padding:32px">
      <h2 id="modalTitle" style="font-size:34px;margin-bottom:20px">Tus favoritos</h2>
      ${list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<p class="note">Aún no has guardado nada. Toca el corazón de un producto para guardarlo aquí.</p>`}
    </div>`);
}

// ---------- Ficha de producto ----------
function openProduct(id) {
  const p = productById(id);
  if (!p) return;
  const inStock = p.inStock !== false;
  const imgs = p.images || [];
  let color = (p.colors || [])[0] || "";
  let qty = 1;

  openModal(`
    <div class="pd">
      <div class="pd-media">
        <div class="pd-main" id="pdMain">${picHtml(p, p.name)}</div>
        ${imgs.length > 1 ? `<div class="pd-thumbs">${imgs.map((src, i) => `<button data-img="${esc(src)}" aria-pressed="${i === 0}"><img src="${esc(src)}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="pd-info">
        <div class="eyebrow">${esc(catLabel(p.cat))}${p.sub ? " · " + esc(p.sub) : ""}</div>
        <h2 id="modalTitle">${esc(p.name)}</h2>
        <div><span class="pd-price ${isOnSale(p) ? "price sale" : ""}">${eur(p.price)}</span>${isOnSale(p) ? `<span class="old">${eur(p.oldPrice)}</span>` : ""}</div>
        ${p.description ? `<p class="pd-desc">${esc(p.description)}</p>` : ""}
        <dl class="specs">
          ${p.dims ? `<dt>Medidas</dt><dd>${esc(p.dims)}</dd>` : ""}
          <dt>Entrega</dt><dd>Envío a domicilio${state.settings.delivery.pickupEnabled !== false ? " o recogida en tienda" : ""}</dd>
          ${p.assembly ? `<dt>Montaje</dt><dd>Opcional, ${eur(p.assemblyPrice)}</dd>` : ""}
        </dl>
        ${p.colors && p.colors.length ? `<div><span class="opt-label">${p.sub === "Colchones" ? "Firmeza" : "Color"}</span><div class="swatches" id="swatches">${p.colors.map((c, i) => `<button class="swatch" data-color="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join("")}</div></div>` : ""}
        ${p.assembly && inStock ? `<label class="check"><input type="checkbox" id="pdAssembly" checked><span>Quiero que me lo montéis en casa (+${eur(p.assemblyPrice)})</span></label>` : ""}
        ${inStock
          ? `<div class="pd-buy">
              <div class="qty"><button id="qMinus" aria-label="Menos">−</button><span id="qVal">1</span><button id="qPlus" aria-label="Más">+</button></div>
              <button class="btn dark" id="pdAdd">Añadir al carrito</button>
            </div>`
          : `<p class="err">Agotado ahora mismo. Pregúntanos cuándo vuelve a entrar.</p>`}
        <a class="pd-ask" id="pdAsk" href="#" target="_blank" rel="noopener">Preguntar por WhatsApp →</a>
      </div>
    </div>`);

  const updateAsk = () =>
    ($("#pdAsk").href = waLink(`Hola Muebles Central, me interesa: ${p.name}${color ? " (" + color + ")" : ""}. ¿Está disponible?`));
  updateAsk();

  const box = $("#modalContent");
  box.onclick = (e) => {
    const sw = e.target.closest("[data-color]");
    if (sw) {
      color = sw.dataset.color;
      $$("[data-color]", box).forEach((b) => b.setAttribute("aria-pressed", b === sw));
      updateAsk();
    }
    const th = e.target.closest("[data-img]");
    if (th) {
      $("#pdMain").innerHTML = `<img src="${esc(th.dataset.img)}" alt="${esc(p.name)}">`;
      $$("[data-img]", box).forEach((b) => b.setAttribute("aria-pressed", b === th));
    }
    if (e.target.closest("#qMinus")) qty = Math.max(1, qty - 1);
    if (e.target.closest("#qPlus")) qty = Math.min(20, qty + 1);
    if ($("#qVal")) $("#qVal").textContent = qty;
    if (e.target.closest("#pdAdd")) {
      addToCart(p.id, qty, color, Boolean($("#pdAssembly") && $("#pdAssembly").checked));
      closeAll();
      openCart();
    }
  };
}

// ---------- Carrito ----------
function addToCart(id, qty = 1, color, assembly) {
  const p = productById(id);
  if (!p || p.inStock === false) return;
  color = color || (p.colors || [])[0] || "";
  const existing = state.cart.find((it) => it.id === id && it.color === color);
  if (existing) {
    existing.qty = Math.min(20, existing.qty + qty);
    if (assembly !== undefined) existing.assembly = assembly;
  } else {
    state.cart.push({ id, qty, color, assembly: assembly === undefined ? Boolean(p.assembly) : assembly });
  }
  save("mc_cart", state.cart);
  renderCounts();
}

function cartTotals() {
  let items = 0, assembly = 0;
  state.cart.forEach((it) => {
    const p = productById(it.id);
    if (!p) return;
    items += p.price * it.qty;
    if (it.assembly && p.assembly) assembly += (p.assemblyPrice || 0) * it.qty;
  });
  return { items, assembly };
}

function renderCounts() {
  const n = state.cart.reduce((s, it) => s + it.qty, 0);
  $("#cartCount").textContent = n;
  $("#cartCount").hidden = n === 0;
  $("#favCount").textContent = state.favs.length;
  $("#favCount").hidden = state.favs.length === 0;
}

function renderCart() {
  if (!state.cart.length) {
    $("#cartBody").innerHTML = `<div class="cart-empty">${window.ILL.get("sofa")}<p>Tu carrito está vacío.</p><a class="btn dark" href="#catalogo" data-close>Ver catálogo</a></div>`;
    $("#cartFoot").innerHTML = "";
    return;
  }
  $("#cartBody").innerHTML = state.cart
    .map((it, i) => {
      const p = productById(it.id);
      if (!p) return "";
      return `
      <div class="citem">
        <div class="cimg">${picHtml(p)}</div>
        <div>
          <h4>${esc(p.name)}</h4>
          <div class="meta">${esc(it.color || "")}${it.color ? " · " : ""}${eur(p.price)}</div>
          ${p.assembly ? `<label class="asm"><input type="checkbox" data-asm="${i}" ${it.assembly ? "checked" : ""}> Montaje en casa +${eur(p.assemblyPrice)}</label>` : ""}
          ${p.inStock === false ? `<div class="err" style="font-size:13px">Agotado: quítalo para continuar</div>` : ""}
          <div class="cline">
            <div class="qty"><button data-dec="${i}" aria-label="Menos">−</button><span>${it.qty}</span><button data-inc="${i}" aria-label="Más">+</button></div>
            <b class="price">${eur(p.price * it.qty)}</b>
          </div>
          <button class="linkbtn" data-rm="${i}">Quitar</button>
        </div>
      </div>`;
    })
    .join("");

  const t = cartTotals();
  const blocked = state.cart.some((it) => (productById(it.id) || {}).inStock === false);
  $("#cartFoot").innerHTML = `
    <div class="sum"><span>Productos</span><span>${eur(t.items)}</span></div>
    ${t.assembly ? `<div class="sum"><span>Montaje</span><span>${eur(t.assembly)}</span></div>` : ""}
    <div class="sum total"><span>Total</span><span>${eur(t.items + t.assembly)}</span></div>
    <p class="note">El envío se calcula en el siguiente paso según tu código postal.</p>
    <button class="btn dark block" id="goCheckout" ${blocked ? "disabled" : ""}>Tramitar pedido</button>
    <a class="btn wa block" href="${waLink(cartWhatsappText())}" target="_blank" rel="noopener">Pedir por WhatsApp</a>`;
}

function cartWhatsappText() {
  const lines = state.cart.map((it) => {
    const p = productById(it.id);
    return p ? `- ${p.name}${it.color ? " (" + it.color + ")" : ""} x${it.qty}${it.assembly && p.assembly ? " con montaje" : ""}` : "";
  });
  return `Hola Muebles Central, quiero pedir:\n${lines.join("\n")}`;
}

function openCart() {
  renderCart();
  openDrawer("#cartDrawer");
}

// ---------- Checkout ----------
let quoteTimer = null;
let lastQuote = null;

function openCheckout() {
  if (!state.online) {
    closeAll();
    openModal(`<div class="done">
      <h2 id="modalTitle">Haz tu pedido por WhatsApp</h2>
      <p class="note">Ahora mismo no podemos tramitar pedidos desde la web. Mándanos el carrito por WhatsApp y te confirmamos precio y entrega.</p>
      <a class="btn wa" href="${waLink(cartWhatsappText())}" target="_blank" rel="noopener">Enviar pedido por WhatsApp</a></div>`);
    return;
  }
  const d = state.settings.delivery || {};
  const pay = state.settings.payments || {};
  const saved = load("mc_customer", {});
  closeAll();
  openModal(`
    <div class="co">
      <form class="co-form" id="coForm" novalidate>
        <h2 id="modalTitle">Finalizar pedido</h2>
        <fieldset>
          <legend>Tus datos</legend>
          <div class="f2">
            <label class="fld">Nombre y apellidos<input id="cName" autocomplete="name" required value="${esc(saved.name || "")}"></label>
            <label class="fld">Teléfono<input id="cPhone" type="tel" autocomplete="tel" required value="${esc(saved.phone || "")}"></label>
          </div>
          <label class="fld">Email (para recibir la confirmación)<input id="cEmail" type="email" autocomplete="email" value="${esc(saved.email || "")}"></label>
        </fieldset>
        <fieldset>
          <legend>Entrega</legend>
          <div class="choice">
            <label><input type="radio" name="dmethod" value="envio" checked><span><b>Envío a domicilio</b><small>${(d.zones || []).map((z) => `${esc(z.label)}: ${eur(z.price)}`).join(" · ")}</small></span></label>
            ${d.pickupEnabled !== false ? `<label><input type="radio" name="dmethod" value="recogida"><span><b>Recogida en tienda</b><small>Gratis · ${esc(state.settings.shop.address || "")}</small></span></label>` : ""}
          </div>
          <div id="addrFields" style="display:grid;gap:10px">
            <label class="fld">Calle y número<input id="cStreet" autocomplete="address-line1" value="${esc(saved.street || "")}"></label>
            <div class="f2">
              <label class="fld">Piso, puerta, ascensor…<input id="cFloor" autocomplete="address-line2" value="${esc(saved.floor || "")}"></label>
              <label class="fld">Código postal<input id="cZip" inputmode="numeric" maxlength="5" autocomplete="postal-code" value="${esc(saved.zip || "")}"></label>
            </div>
            <label class="fld">Ciudad<input id="cCity" autocomplete="address-level2" value="${esc(saved.city || "Barcelona")}"></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Pago</legend>
          <div class="choice">
            ${pay.card ? `<label><input type="radio" name="pay" value="tarjeta" checked><span><b>Tarjeta</b><small>Pago seguro con Stripe</small></span></label>` : ""}
            ${pay.cashOnDelivery ? `<label><input type="radio" name="pay" value="entrega" ${pay.card ? "" : "checked"}><span><b>Pagar en la entrega</b><small>En efectivo o tarjeta cuando recibas el pedido</small></span></label>` : ""}
          </div>
        </fieldset>
        <label class="fld">Notas (horario preferido, acceso al edificio…)<textarea id="cNotes"></textarea></label>
        <p class="err" id="coErr" hidden></p>
      </form>
      <aside class="co-sum">
        <h3>Resumen</h3>
        <div id="coLines"></div>
        <button class="btn dark block" id="coSubmit" form="coForm" type="submit" disabled>Confirmar pedido</button>
        <p class="note">Te llamaremos para acordar el día de entrega.</p>
      </aside>
    </div>`);

  const form = $("#coForm");
  const syncMethod = () => {
    const isPickup = form.dmethod.value === "recogida";
    $("#addrFields").hidden = isPickup;
    requestQuote();
  };
  form.addEventListener("change", (e) => { if (e.target.name === "dmethod") syncMethod(); });
  $("#cZip").addEventListener("input", () => requestQuote());
  form.addEventListener("submit", submitOrder);
  syncMethod();
}

function requestQuote() {
  clearTimeout(quoteTimer);
  lastQuote = null;
  $("#coSubmit").disabled = true;
  const form = $("#coForm");
  const method = form.dmethod.value;
  const zip = $("#cZip").value.trim();
  if (method === "envio" && !/^\d{5}$/.test(zip)) {
    renderSummary(null, "Escribe tu código postal para calcular el envío.");
    return;
  }
  renderSummary(null, "Calculando…");
  quoteTimer = setTimeout(async () => {
    try {
      const q = await api("/api/shipping/quote", {
        method: "POST",
        body: JSON.stringify({ items: state.cart, delivery: { method, zip } }),
      });
      lastQuote = q;
      renderSummary(q);
      $("#coSubmit").disabled = false;
    } catch (e) {
      renderSummary(null, e.message);
    }
  }, 300);
}

function renderSummary(q, message) {
  const t = cartTotals();
  const lines = state.cart
    .map((it) => {
      const p = productById(it.id);
      return p ? `<div class="co-line"><span>${esc(p.name)} ×${it.qty}</span><span>${eur(p.price * it.qty)}</span></div>` : "";
    })
    .join("");
  $("#coLines").innerHTML = `
    ${lines}
    <div class="co-sep"></div>
    <div class="co-line"><span>Productos</span><span>${eur(q ? q.items_total : t.items)}</span></div>
    ${(q ? q.assembly_total : t.assembly) ? `<div class="co-line"><span>Montaje</span><span>${eur(q ? q.assembly_total : t.assembly)}</span></div>` : ""}
    <div class="co-line"><span>${q ? esc(q.shipping.label) : "Envío"}</span><span>${q ? (q.shipping.amount ? eur(q.shipping.amount) : "Gratis") : "—"}</span></div>
    <div class="co-sep"></div>
    <div class="co-line" style="font-size:18px;font-weight:600"><span style="color:inherit">Total</span><span>${q ? eur(q.total) : "—"}</span></div>
    ${message ? `<p class="${q ? "note" : "err"}" style="margin-top:6px">${esc(message)}</p>` : ""}`;
}

async function submitOrder(e) {
  e.preventDefault();
  const form = $("#coForm");
  const err = $("#coErr");
  err.hidden = true;
  const v = (id) => $(id).value.trim();
  const method = form.dmethod.value;
  const payment = form.pay ? form.pay.value : "entrega";

  const missing = [];
  if (!v("#cName")) missing.push("tu nombre");
  if (!/^[+\d\s]{9,}$/.test(v("#cPhone"))) missing.push("un teléfono válido");
  if (method === "envio" && !v("#cStreet")) missing.push("la calle");
  if (method === "envio" && !v("#cCity")) missing.push("la ciudad");
  if (v("#cEmail") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("#cEmail"))) missing.push("un email correcto");
  if (missing.length) {
    err.textContent = `Falta ${missing.join(", ")}.`;
    err.hidden = false;
    return;
  }

  const customer = { name: v("#cName"), phone: v("#cPhone"), email: v("#cEmail") };
  const delivery = { method, street: v("#cStreet"), floor: v("#cFloor"), zip: v("#cZip"), city: v("#cCity") };
  save("mc_customer", { ...customer, ...delivery });

  const btn = $("#coSubmit");
  btn.disabled = true;
  btn.textContent = "Enviando pedido…";
  try {
    const order = await api("/api/orders", {
      method: "POST",
      body: JSON.stringify({ customer, delivery, items: state.cart, payment_method: payment, notes: v("#cNotes") }),
    });

    if (payment === "tarjeta") {
      btn.textContent = "Abriendo el pago…";
      const { checkout_url } = await api(`/api/orders/${order.order_id}/checkout`, { method: "POST" });
      location.href = checkout_url;
      return;
    }

    state.cart = [];
    save("mc_cart", state.cart);
    renderCounts();
    showDone(order.order_id, order.total);
  } catch (ex) {
    err.textContent = ex.message;
    err.hidden = false;
    btn.disabled = false;
    btn.textContent = "Confirmar pedido";
  }
}

function showDone(orderId, total) {
  openModal(`
    <div class="done">
      <svg class="ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="m7.5 12 3 3 6-6"/></svg>
      <h2 id="modalTitle">¡Pedido recibido!</h2>
      <div class="oid">${esc(orderId)}</div>
      <p class="note">${total ? `Total ${eur(total)}. ` : ""}Te llamaremos para acordar el día de entrega. Si tienes cualquier duda, escríbenos con este número de pedido.</p>
      <div class="btns" style="justify-content:center">
        <a class="btn wa" href="${waLink(`Hola, he hecho el pedido ${orderId} en la web.`)}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
        <button class="btn" data-close>Seguir mirando</button>
      </div>
    </div>`);
}

// Vuelta desde Stripe: ?payment=success|cancelled&order=MC-XXXX
function handlePaymentReturn() {
  const params = new URLSearchParams(location.search);
  const payment = params.get("payment");
  if (!payment) return;
  const order = params.get("order") || "";
  const b = $("#banner");
  if (payment === "success") {
    state.cart = [];
    save("mc_cart", state.cart);
    b.className = "banner ok";
    b.innerHTML = `<span>Pago recibido. Tu pedido <b>${esc(order)}</b> está confirmado y te llamaremos para la entrega.</span><button aria-label="Cerrar">×</button>`;
  } else {
    b.className = "banner";
    b.innerHTML = `<span>El pago no se completó. Tu carrito sigue guardado; puedes intentarlo de nuevo o pagar en la entrega.</span><button aria-label="Cerrar">×</button>`;
  }
  b.hidden = false;
  b.querySelector("button").onclick = () => (b.hidden = true);
  setTimeout(() => (b.hidden = true), 12000);
  history.replaceState(null, "", location.pathname + location.hash);
}

// ---------- Drawers y modal ----------
let lastFocus = null;

function openDrawer(sel) {
  lastFocus = document.activeElement;
  $(sel).hidden = false;
  document.body.classList.add("locked");
  const btn = $(sel).querySelector("[data-close].ic");
  if (btn) btn.focus();
}

function openModal(html) {
  lastFocus = lastFocus || document.activeElement;
  $("#modalContent").innerHTML = html;
  $("#modal").hidden = false;
  $("#modal .mbox").scrollTop = 0;
  document.body.classList.add("locked");
  $("#modal .mclose").focus();
}

function closeAll() {
  ["#menuDrawer", "#cartDrawer", "#modal"].forEach((s) => ($(s).hidden = true));
  document.body.classList.remove("locked");
  if (location.hash.startsWith("#p-")) history.replaceState(null, "", location.pathname);
  if (lastFocus && lastFocus.focus) lastFocus.focus();
  lastFocus = null;
}

// ---------- Eventos globales ----------
function bindGlobal() {
  document.addEventListener("click", (e) => {
    const t = e.target;

    const close = t.closest("[data-close]");
    if (close) {
      closeAll();
      if (close.tagName !== "A") return;
    }

    const fav = t.closest("[data-fav]");
    if (fav) return toggleFav(fav.dataset.fav);

    const open = t.closest("[data-open]");
    if (open) {
      closeAll();
      history.replaceState(null, "", "#p-" + open.dataset.open);
      return openProduct(open.dataset.open);
    }

    const quick = t.closest("[data-quick]");
    if (quick) {
      const p = productById(quick.dataset.quick);
      // Si tiene colores o montaje, mejor elegir en la ficha
      if (p && ((p.colors && p.colors.length > 1) || p.assembly)) return openProduct(p.id);
      addToCart(quick.dataset.quick);
      return toast("Añadido al carrito");
    }

    const g = t.closest("[data-goto]");
    if (g) {
      e.preventDefault();
      return goto(g.dataset.goto, g.dataset.sub);
    }

    const acc = t.closest(".acc > button");
    if (acc) {
      const openNow = acc.getAttribute("aria-expanded") === "true";
      acc.setAttribute("aria-expanded", !openNow);
      acc.nextElementSibling.hidden = openNow;
      return;
    }

    // Carrito
    const i = (attr) => Number(t.closest(`[${attr}]`).getAttribute(attr));
    if (t.closest("[data-inc]")) { state.cart[i("data-inc")].qty = Math.min(20, state.cart[i("data-inc")].qty + 1); cartChanged(); }
    if (t.closest("[data-dec]")) { const it = state.cart[i("data-dec")]; it.qty = Math.max(1, it.qty - 1); cartChanged(); }
    if (t.closest("[data-rm]")) { state.cart.splice(i("data-rm"), 1); cartChanged(); }
    if (t.closest("#goCheckout")) openCheckout();

    // Enlaces de ancla del menú móvil
    if (t.closest("#menuDrawer a[href^='#']")) closeAll();
  });

  document.addEventListener("change", (e) => {
    const asm = e.target.closest("[data-asm]");
    if (asm) {
      state.cart[Number(asm.dataset.asm)].assembly = asm.checked;
      cartChanged();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  $("#openMenu").addEventListener("click", () => openDrawer("#menuDrawer"));
  $("#openCart").addEventListener("click", openCart);
  $("#openFavs").addEventListener("click", openFavs);

  $("#q").addEventListener("input", (e) => {
    state.q = e.target.value;
    state.cat = "";
    state.sub = "";
    renderCatalog();
  });
  $("#q").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#catalogo").scrollIntoView({ behavior: "smooth" });
  });
  $("#sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderCatalog();
  });

  $("#year").textContent = new Date().getFullYear();
}

function cartChanged() {
  save("mc_cart", state.cart);
  renderCounts();
  renderCart();
}

init();
