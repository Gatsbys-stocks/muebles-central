// Dibujos de línea para cada tipo de mueble. Se usan como imagen de un
// producto mientras la tienda no le haya subido una foto, y en las
// categorías de la portada.
(function () {
  const S = (d) =>
    `<svg class="ill" viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  const ILL = {
    sofa: S('<path d="M18 42V32a6 6 0 0 1 6-6h72a6 6 0 0 1 6 6v10"/><rect x="10" y="42" width="14" height="24" rx="5"/><rect x="96" y="42" width="14" height="24" rx="5"/><path d="M24 54h72v12H24zM60 54v12M24 54a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6M60 54a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6"/><path d="M16 66v6M104 66v6"/>'),
    chaise: S('<path d="M12 44V30a5 5 0 0 1 5-5h54a5 5 0 0 1 5 5v14"/><path d="M8 44h72v18H8zM80 50h32v12H80z"/><path d="M12 62v6M76 62v6M108 62v6M44 44v18"/>'),
    corner: S('<path d="M10 30h60v14H10zM70 30h40v44H70z"/><path d="M10 44h60v14H10zM10 58v6M106 74v4M72 74v4"/>'),
    sofabed: S('<path d="M16 40V28a5 5 0 0 1 5-5h78a5 5 0 0 1 5 5v12"/><rect x="10" y="40" width="100" height="16" rx="4"/><path d="M14 56h92v8H14zM18 64v6M102 64v6"/><path d="M26 47h68" stroke-dasharray="3 5"/>'),
    bed: S('<path d="M14 72V30a4 4 0 0 1 4-4h84a4 4 0 0 1 4 4v42"/><path d="M14 52h92M14 60h92"/><rect x="24" y="38" width="30" height="12" rx="5"/><rect x="66" y="38" width="30" height="12" rx="5"/><path d="M14 72v4M106 72v4"/>'),
    mattress: S('<path d="M12 44l20-14h76L88 44z"/><path d="M12 44v14h76V44M88 58l20-14V30"/><path d="M24 51h52" stroke-dasharray="2 4"/>'),
    vanity: S('<rect x="36" y="8" width="48" height="40" rx="8"/><circle cx="36" cy="16" r="2.5"/><circle cx="36" cy="28" r="2.5"/><circle cx="36" cy="40" r="2.5"/><circle cx="84" cy="16" r="2.5"/><circle cx="84" cy="28" r="2.5"/><circle cx="84" cy="40" r="2.5"/><path d="M22 52h76v10H22zM26 62v22M94 62v22M58 57h4"/>'),
    dresser: S('<rect x="26" y="18" width="68" height="58" rx="2"/><path d="M26 37h68M26 56h68M56 27h8M56 46h8M56 65h8M30 76v6M90 76v6"/>'),
    nightstand: S('<rect x="38" y="30" width="44" height="44" rx="2"/><path d="M38 52h44M56 41h8M56 63h8M42 74v6M78 74v6"/><path d="M52 30v-8h16v8" /><path d="M48 22h24"/>'),
    wardrobe: S('<rect x="30" y="6" width="60" height="76" rx="2"/><path d="M60 6v76M55 40v8M65 40v8M34 82v4M86 82v4"/>'),
    shoes: S('<rect x="28" y="16" width="64" height="62" rx="2"/><path d="M28 36h64M28 57h64M50 26h20M50 46h20M50 67h20"/>'),
    mirror: S('<rect x="42" y="6" width="36" height="72" rx="18"/><path d="M50 22l10-8M52 34l18-14"/><path d="M52 78l-6 8M68 78l6 8"/>'),
    deco: S('<path d="M50 80h20l4-30H46z"/><path d="M60 50c0-16-14-18-18-30M60 50c0-18 12-22 20-34M60 50V14"/><circle cx="42" cy="20" r="4"/><circle cx="80" cy="16" r="4"/><circle cx="60" cy="12" r="4"/>'),
    table: S('<ellipse cx="60" cy="34" rx="44" ry="10"/><path d="M28 40l-8 40M92 40l8 40M44 42l-4 32M76 42l4 32"/>'),
    coffee: S('<rect x="14" y="44" width="92" height="10" rx="3"/><path d="M26 54l-4 22M94 54l4 22M40 54v14h40V54"/>'),
    chair: S('<path d="M40 10h36v34H40zM36 44h44v10H36zM40 54l-4 30M76 54l4 30M44 18h28M44 26h28"/>'),
    dining: S('<rect x="12" y="20" width="96" height="58" rx="2"/><path d="M60 20v58M12 48h96M34 30v8M86 30v8M34 60v8M86 60v8"/>'),
    tvunit: S('<rect x="10" y="48" width="100" height="24" rx="2"/><path d="M43 48v24M77 48v24M16 72v6M104 72v6"/><rect x="30" y="8" width="60" height="34" rx="2"/><path d="M56 42v6M64 42v6"/>'),
    shelf: S('<path d="M30 6v78M90 6v78M30 26h60M30 46h60M30 66h60"/><rect x="38" y="14" width="8" height="12"/><rect x="48" y="16" width="6" height="10"/><circle cx="76" cy="58" r="6"/>'),
    suitcase: S('<rect x="36" y="22" width="48" height="58" rx="6"/><path d="M50 22v-10h20v10M48 34v36M60 34v36M72 34v36M44 80v4M76 80v4"/>'),
    fridge: S('<rect x="38" y="4" width="44" height="82" rx="4"/><path d="M38 32h44M46 14v10M46 40v14"/>'),
    washer: S('<rect x="30" y="8" width="60" height="74" rx="4"/><path d="M30 22h60"/><circle cx="60" cy="52" r="18"/><circle cx="60" cy="52" r="11"/><circle cx="40" cy="15" r="2"/><path d="M70 15h12"/>'),
    micro: S('<rect x="14" y="22" width="92" height="48" rx="4"/><rect x="22" y="30" width="58" height="32" rx="2"/><path d="M92 32v4M92 44v4M88 56h8"/>'),
    oven: S('<rect x="28" y="6" width="64" height="80" rx="3"/><path d="M28 24h64"/><circle cx="40" cy="15" r="3"/><circle cx="54" cy="15" r="3"/><circle cx="68" cy="15" r="3"/><rect x="38" y="36" width="44" height="34" rx="2"/><path d="M44 30h32"/>'),
    hob: S('<path d="M8 40l14-20h76l14 20z"/><path d="M8 40v8h104v-8"/><ellipse cx="40" cy="27" rx="10" ry="4"/><ellipse cx="78" cy="27" rx="10" ry="4"/><ellipse cx="46" cy="35" rx="7" ry="2.5"/><ellipse cx="80" cy="35" rx="7" ry="2.5"/>'),
    blender: S('<path d="M46 8h30l-4 44H50z"/><path d="M42 8h38M76 18h8v20h-6"/><path d="M44 52h34l4 26H40z"/><circle cx="61" cy="65" r="4"/>'),
  };

  // Tipo de producto (campo "sub" del backend) → dibujo
  const BY_SUB = {
    "Sofás": "sofa", "Sofás cama": "sofabed", "Chaise longue": "chaise", "Rinconeras": "corner",
    "Camas": "bed", "Colchones": "mattress", "Cómodas / Cajoneras": "dresser", "Tocadores": "vanity", "Mesitas de noche": "nightstand",
    "Mesas": "table", "Sillas": "chair", "Muebles de comedor": "dining",
    "Muebles de TV": "tvunit", "Mesas de centro": "coffee", "Estanterías": "shelf",
    "Armarios": "wardrobe", "Zapateros": "shoes", "Maletas": "suitcase",
    "Espejos": "mirror", "Decoración": "deco",
    "Neveras": "fridge", "Lavadoras": "washer", "Cocinas": "oven", "Hornos": "oven", "Placas vitrocerámica": "hob", "Microondas": "micro", "Batidoras": "blender",
  };

  // Categoría → dibujo de su tarjeta en la portada
  const BY_CAT = { sofas: "sofa", dormitorio: "bed", comedor: "table", salon: "tvunit", almacenaje: "wardrobe", deco: "mirror", electro: "fridge" };

  window.ILL = {
    forProduct: (p) => ILL[BY_SUB[p.sub]] || ILL[BY_CAT[p.cat]] || ILL.sofa,
    forCategory: (id) => ILL[BY_CAT[id]] || ILL.sofa,
    get: (name) => ILL[name],
  };
})();
