(function() {
// 1. CLEAN PREVIOUS INSTANCES
if (document.getElementById('scm-god-panel')) document.getElementById('scm-god-panel').remove();
if (document.getElementById('scm-mini-circle')) document.getElementById('scm-mini-circle').remove();

// 2. EXPANDED INTERNAL GLOBAL CONFIGURATION
let loopMarket = null;
let loopXp = null;
let config = { talento: 350, edad: 25, nivelMin: 80, precioMax: 50000000, posicion: "TODOS" };

// Shared position so panel and circle stay synchronized
let posX = 30;
let posY = 30;

// 3. CREATE MAIN FLOATING CONTAINER
const panel = document.createElement('div');
panel.id = 'scm-god-panel';
panel.style.cssText = `position:fixed; top:${posY}px; left:${posX}px; width:410px; background:#070000; color:#ffb3b3; padding:0; border-radius:12px; z-index:9999999; font-family:system-ui,-apple-system,sans-serif; border:2px solid #ff0033; box-shadow:0 0 20px #ff0033, 0 12px 40px rgba(0,0,0,0.9); box-sizing:border-box; user-select:none; font-size:14px; display:block;`;

// 4. INTERNAL UI STRUCTURE V2
panel.innerHTML = `
<div id="scm-god-header" style="background:#1a0003; padding:12px 14px; border-radius:10px 10px 0 0; cursor:move; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #3d000a;">
<span style="color:#ff0033; font-weight:bold; font-size:14px; text-shadow: 0 0 8px #ff0033;">🤖 SCM BOT ⚽️ v2.0</span>
<div style="display:flex; gap:10px; align-items:center;">
<button id="god-min-btn" style="background:transparent; color:#ff0033; border:none; font-size:14px; cursor:pointer; font-weight:bold;">➖</button>
<button id="god-close-btn" style="background:transparent; color:#ff4d4d; border:none; font-size:16px; cursor:pointer; font-weight:bold;">×</button>
</div>
</div>

<div id="scm-god-body" style="padding:14px;">
<!-- TAB SELECTOR -->
<div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:4px; margin-bottom:12px; background:#140002; padding:4px; border-radius:6px; border: 1px solid #3d000a;">
<button id="tab-mkt" style="background:#ff0033; color:#fff; border:none; padding:6px 0; font-size:10px; font-weight:bold; border-radius:4px; cursor:pointer; text-shadow: 0 0 4px #000;">MARKET</button>
<button id="tab-xp" style="background:transparent; color:#ffb3b3; border:none; padding:6px 0; font-size:10px; font-weight:bold; border-radius:4px; cursor:pointer;">XP</button>
<button id="tab-mej" style="background:transparent; color:#ffb3b3; border:none; padding:6px 0; font-size:10px; font-weight:bold; border-radius:4px; cursor:pointer;">UPGRADES</button>
<button id="tab-eqp" style="background:transparent; color:#ffb3b3; border:none; padding:6px 0; font-size:10px; font-weight:bold; border-radius:4px; cursor:pointer;">TEAM</button>
<button id="tab-acd" style="background:transparent; color:#ffb3b3; border:none; padding:6px 0; font-size:10px; font-weight:bold; border-radius:4px; cursor:pointer;">ACADEMY</button>
<button id="tab-cnj" style="background:transparent; color:#ffb3b3; border:none; padding:6px 0; font-size:10px; font-weight:bold; border-radius:4px; cursor:pointer;">TIPS</button>
</div>

<!-- DYNAMIC CONTENT CONTAINER -->
<div id="god-tab-content" style="min-height:150px;"></div>

<!-- NEON RED LOG TERMINAL -->
<div style="margin-top:14px;">
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
<span style="font-size:11px; color:#8a4f55; font-weight:bold;">ACTION LOGS:</span>
<span style="font-size:10px; color:#66111b; font-family:monospace;">made by PikaBot</span>
</div>
<div id="god-logs" style="background:#030000; border:1px solid #4a000c; height:150px; border-radius:6px; padding:10px; font-family:monospace; font-size:14px; color:#ffb3b3; overflow-y:auto; white-space:pre-wrap; line-height: 1.5;"><div><span style="color:#ff0033; text-shadow: 0 0 4px #ff0033;">[SCM BOT] v2.0 | Made by PikaBot</span></div></div>
</div>
</div>
`;

// 5. CREATE MINIMIZED CIRCULAR BUTTON
const miniCircle = document.createElement('div');
miniCircle.id = 'scm-mini-circle';
miniCircle.style.cssText = `position:fixed; top:${posY}px; left:${posX}px; width:55px; height:55px; background:#070000; border:2px solid #ff0033; border-radius:50%; display:none; justify-content:center; align-items:center; color:#ff0033; font-weight:bold; font-family:system-ui,-apple-system,sans-serif; font-size:12px; cursor:move; z-index:9999999; box-shadow:0 0 15px #ff0033, 0 4px 15px rgba(0,0,0,0.6); text-shadow: 0 0 4px #ff0033; user-select:none;`;
miniCircle.innerText = 'BOT';

document.body.appendChild(panel);
document.body.appendChild(miniCircle);

// LOG SYSTEM
function log(msg, color = "#ffb3b3") {
const c = document.getElementById('god-logs');
if (c) {
c.innerHTML += `<div><span style="color:${color};">> ${msg}</span></div>`;
c.scrollTop = c.scrollHeight;
}
}

// ==========================================
// SMOOTH AND PRECISE DRAG & DROP SYSTEM
// ==========================================
function registrarDrag(elementoActivador, elementoAMover, esCirculo = false) {
let active = false;
let currentX, currentY, initialX, initialY;

elementoActivador.addEventListener("mousedown", dragStart);
elementoActivador.addEventListener("touchstart", dragStart, { passive: false });

function dragStart(e) {
if (esCirculo) elementoAMover.setAttribute('data-dragged', 'false');

let clientX = e.touches ? e.touches[0].clientX : e.clientX;
let clientY = e.touches ? e.touches[0].clientY : e.clientY;

initialX = clientX - posX;
initialY = clientY - posY;

if (e.target === elementoActivador || elementoActivador.contains(e.target)) {
active = true;
if(e.cancelable) e.preventDefault();
}
}

document.addEventListener("mousemove", drag);
document.addEventListener("touchmove", drag, { passive: false });

function drag(e) {
if (!active) return;
if(e.cancelable) e.preventDefault();

let clientX = e.touches ? e.touches[0].clientX : e.clientX;
let clientY = e.touches ? e.touches[0].clientY : e.clientY;

currentX = clientX - initialX;
currentY = clientY - initialY;

posX = currentX;
posY = currentY;

panel.style.left = posX + "px";
panel.style.top = posY + "px";
miniCircle.style.left = posX + "px";
miniCircle.style.top = posY + "px";

if (esCirculo) elementoAMover.setAttribute('data-dragged', 'true');
}

document.addEventListener("mouseup", dragEnd);
document.addEventListener("touchend", dragEnd);

function dragEnd() {
active = false;
}
}

registrarDrag(document.getElementById('scm-god-header'), panel, false);
registrarDrag(miniCircle, miniCircle, true);

// MINIMIZED TOGGLE LOGIC
const minBtn = document.getElementById('god-min-btn');
minBtn.onclick = function(e) {
e.stopPropagation();
panel.style.display = 'none';
miniCircle.style.display = 'flex';
};

miniCircle.onclick = function(e) {
if (miniCircle.getAttribute('data-dragged') === 'true') return;
miniCircle.style.display = 'none';
panel.style.display = 'block';
};

// ==========================================
// INTERNAL SCM ALGORITHMS
// ==========================================
function ejecutarFichajes() {
let rows = document.querySelectorAll('tr');
let comprado = false;

rows.forEach(function(row) {
if (comprado) return;
let btn = row.querySelector('button, .btn, a.button');
if (!btn) return;
if (!(btn.innerText || "").toLowerCase().includes("buy")) return;

let rowTxt = row.innerText || "";
if (config.posicion !== "TODOS") {
let posTxt = config.posicion.toUpperCase();
let mapeo = { "POR": "Portero", "DEF": "Defensa", "MED": "Medio", "DEL": "Delantero" };
if (!rowTxt.toUpperCase().includes(posTxt) && !rowTxt.includes(mapeo[posTxt])) return;
}

let num = rowTxt.match(/\d+/g);
if (!num || num.length < 3) return;

let edad = parseInt(num[0]);
let nivel = parseInt(num[1]);
let talento = parseInt(num[2]);

let precio = 0;
let precioMatch = rowTxt.match(/([\d\.]+)\s*€/);
if (precioMatch) { precio = parseInt(precioMatch[1].replace(/\./g, '')); }

if (talento >= config.talento && edad <= config.edad && nivel >= config.nivelMin) {
if (config.precioMax && precio > config.precioMax) return;
btn.click(); comprado = true;
log(`🚀 <b>SIGNED:</b> <b>${talento} Tl</b> | <b>${nivel} Lv</b> | ${edad}y | <b>${precio.toLocaleString()}€</b>`, "#ff0033");
}
});
if (!comprado) log("No player meets the current criteria.", "#8a4f55");
}

function procesarVentas() {
let rows = document.querySelectorAll('tr');
let cont = 0;

rows.forEach(function(row) {
let rowTxt = row.innerText || "";
if (rowTxt.includes("Position") && rowTxt.includes("Market v")) return;
if (!rowTxt.includes("€")) return;

let cells = row.querySelectorAll('td');
if (cells.length < 3) return;

let nombre = "";
for (let i = 0; i < cells.length; i++) {
let cellTxt = cells[i].innerText.trim();
if (cellTxt.includes("\n")) cellTxt = cellTxt.split("\n")[0].trim();
if (cellTxt.length > 2 && !/^(portero|defensa|medio|delantero|pos|posici|nivel|edad|talento|firmar|despedir|vender|transferir)$/i.test(cellTxt) && !cellTxt.includes("€") && isNaN(cellTxt)) {
nombre = cellTxt;
break;
}
}
if (!nombre) nombre = "Player No. " + (cont + 1);

let preciosEncontrados = rowTxt.match(/([\d\.]+)\s*€/g);
if (!preciosEncontrados) return;

let strValor = preciosEncontrados[preciosEncontrados.length - 1];
let valorMercado = parseInt(strValor.replace(/\./g, ''));

if (valorMercado > 0) {
let precioRecomendado = Math.floor(valorMercado * 1.15);
cont++;
log(`📦 <b>${nombre}</b> ➡️ Sale: <b>${precioRecomendado.toLocaleString()} €</b>`, "#ff9900");
}
});
if (cont === 0) log("⚠️ No players were found in this window.", "#ff3333");
}

function ejecutarXp() {
let btns = document.querySelectorAll('button, .btn');
let clicks = 0;
btns.forEach(function(b) {
if (b.id.includes("god") || b.id.includes("tab") || b.id.includes("min")) return;
let t = b.innerText || "";
if (t.includes("+") || t.includes("XP") || t.toLowerCase().includes("train")) { b.click(); clicks++; }
});
if (clicks > 0) log(`🏋️‍♂️ Training distributed across <b>${clicks}</b> lines.`, "#ff0033");
else log("Players are at the fatigue limit today.", "#8a4f55");
}

function evaluarInstalaciones() {
let rows = document.querySelectorAll('tr');
let opciones = [];

rows.forEach(function(row) {
let txt = row.innerText || "";
if (!txt.includes("€") || txt.includes("Name")) return;

let costeMatch = txt.match(/([\d\.]+)\s*€/);
if (!costeMatch) return;
let coste = parseInt(costeMatch[1].replace(/\./g, ''));

let cells = row.querySelectorAll('td');
let nombre = cells.length > 0 ? cells[0].innerText.trim() : "Building";
let nums = txt.match(/\d+/g);
let nivel = nums ? parseInt(nums[0]) : 1;

let peso = 0.01;
if (/stadium infrastructure/i.test(nombre)) peso = 700;
if (/sponsorship money/i.test(nombre)) peso = 650;
if (/merchandise sales/i.test(nombre)) peso = 600;
if (/ticket price/i.test(nombre)) peso = 550;
if (/academy quality/i.test(nombre)) peso = 500;

let score = (peso * 100000000) / coste;
opciones.push({ nombre: nombre, coste: coste, nivel: nivel, roi: score });
});

if (opciones.length > 0) {
opciones.sort((a,b) => b.roi - a.roi);
log("🎯 PROFITABLE INVESTMENT DETECTED:", "#ff9900");
log(`👉 <b>${opciones[0].nombre}</b> (Lv: ${opciones[0].nivel})`, "#fff");
log(`💰 Cost: <b>${opciones[0].coste.toLocaleString()} €</b>`, "#ff0033");
} else {
log("⚠️ Open the 'Upgrades' window to scan.", "#ff3333");
}
}

function analizarPlantilla() {
let rows = document.querySelectorAll('tr');
let totalEdad = 0, totalNivel = 0, totalJugadores = 0;

rows.forEach(function(row) {
let txt = row.innerText || "";
if (txt.includes("Upgrade") || txt.includes("Name") || txt.length < 15) return;
let nums = txt.match(/\d+/g);
if (!nums || nums.length < 2) return;

let edad = parseInt(nums[0]); let nivel = parseInt(nums[1]);
if (edad < 15 || edad > 45 || nivel < 40 || nivel > 500) return;

totalEdad += edad; totalNivel += nivel; totalJugadores++;
});

if (totalJugadores > 0) {
log("📊 <b>TEAM DATA:</b>", "#ff9900");
log(`👥 Total players: <b>${totalJugadores}</b>`, "#fff");
log(`🎂 Average Age: <b>${(totalEdad / totalJugadores).toFixed(1)}</b> years`, "#fff");
log(`💪 Average Strength: <b>${(totalNivel / totalJugadores).toFixed(0)}</b>`, "#ff0033");
} else {
log("⚠️ Open your squad list first.", "#ff3333");
}
}

function analizarAcademia() {
let rows = document.querySelectorAll('table tr');
let contados = 0;

rows.forEach(function(row) {
let cells = row.querySelectorAll('td');
if (cells.length < 5) return;

let nombre = cells[1].innerText.trim();
if (nombre.includes("Dismiss") || nombre.includes("Name") || nombre.length < 3) return;

let edad = parseInt(cells[2].innerText.trim());
let nivel = parseInt(cells[3].innerText.trim());
let talento = parseInt(cells[4].innerText.trim());

if (isNaN(edad) || isNaN(nivel) || isNaN(talento) || edad < 10) return;
contados++;

let puntuacionPromesa = talento + (nivel * 1.5) - (edad * 8);
log(`👶 <b>${nombre}</b> (${edad}y): Tl ${talento} | Lv ${nivel}`, "#fff");
if (talento >= 260 && edad <= 18) log(`🔥 <b>GEM!</b> Promote now.`, "#ff0033");
else if (puntuacionPromesa > 280) log(`✅ <b>Acceptable:</b> Keep.`, "#ff9900");
else log(`❌ <b>Bad:</b> Dismiss recommended!`, "#ff3333");
});
if (contados === 0) log("⚠️ Go to 'Player Academy'.", "#ff3333");
}

function procesarConsejos() {
let obj = document.getElementById('sel-g-objetivo').value;
log("🧠 STRATEGY: " + obj.toUpperCase(), "#ff9900");
if (obj === "dinero") {
log("• Raise the ticket price until attendance drops below 93%.", "#ffb3b3");
log("• Buy and sell quickly with a 15% profit.", "#ffb3b3");
} else if (obj === "deportivo") {
log("• Ignore prospects and only buy high-rated players.", "#ffb3b3");
log("• Keep the XP loop active at all times.", "#ffb3b3");
} else {
log("• Prioritize Academy Quality to level 6.", "#ffb3b3");
log("• Dismiss deadweight to force resets at 00:00.", "#ffb3b3");
}
}

// ==========================================
// TAB RENDERING (UI)
// ==========================================
function showTabMarket() {
document.getElementById('god-tab-content').innerHTML = `
<div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:6px;">
<div>
<label style="font-size:10px; color:#ff0033; font-weight:bold;">⭐ MIN TALENT:</label>
<input type="number" id="inp-g-talento" value="${config.talento}" style="width:100%; background:#140002; color:#fff; border:1px solid #3d000a; padding:5px; border-radius:4px; box-sizing:border-box; font-size:12px;">
</div>
<div>
<label style="font-size:10px; color:#ff0033; font-weight:bold;">🎂 MAX AGE:</label>
<input type="number" id="inp-g-edad" value="${config.edad}" style="width:100%; background:#140002; color:#fff; border:1px solid #3d000a; padding:5px; border-radius:4px; box-sizing:border-box; font-size:12px;">
</div>
</div>
<div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:6px;">
<div>
<label style="font-size:10px; color:#ff0033; font-weight:bold;">⚡ MINIMUM LEVEL:</label>
<input type="number" id="inp-g-nivel" value="${config.nivelMin}" style="width:100%; background:#140002; color:#fff; border:1px solid #3d000a; padding:5px; border-radius:4px; box-sizing:border-box; font-size:12px;">
</div>
<div>
<label style="font-size:10px; color:#ff0033; font-weight:bold;">🏃‍♂️ POSITION:</label>
<select id="sel-g-pos" style="width:100%; background:#140002; color:#fff; border:1px solid #3d000a; padding:4px; border-radius:4px; box-sizing:border-box; height:27px; font-size:12px;">
<option value="TODOS" ${config.posicion === "TODOS" ? "selected" : ""}>Any</option>
<option value="POR" ${config.posicion === "POR" ? "selected" : ""}>Goalkeeper</option>
<option value="DEF" ${config.posicion === "DEF" ? "selected" : ""}>Defender</option>
<option value="MED" ${config.posicion === "MED" ? "selected" : ""}>Midfielder</option>
<option value="DEL" ${config.posicion === "DEL" ? "selected" : ""}>Forward</option>
</select>
</div>
</div>
<div style="margin-bottom:12px;">
<label style="font-size:10px; color:#ff0033; font-weight:bold;">💰 MAX BUDGET (€):</label>
<input type="number" id="inp-g-precio" value="${config.precioMax}" style="width:100%; background:#140002; color:#fff; border:1px solid #3d000a; padding:5px; border-radius:4px; box-sizing:border-box; font-size:12px;">
</div>
<div style="display:flex; gap:6px; margin-bottom:8px;">
<button id="btn-g-scan-mkt" style="flex:1; background:#ff0033; color:#fff; border:none; padding:8px; font-weight:bold; border-radius:6px; cursor:pointer; font-size:12px; text-shadow: 0 0 3px #000;">🔍 FILTER & BUY</button>
<button id="btn-g-sell-mkt" style="flex:1; background:#3d000a; color:#ffb3b3; border:1px solid #ff0033; padding:8px; font-weight:bold; border-radius:6px; cursor:pointer; font-size:12px;">📦 APPRAISE & SELL</button>
</div>
<label style="display:flex; align-items:center; gap:6px; font-size:12px; color:#ffb3b3; cursor:pointer;">
<input type="checkbox" id="chk-g-auto-mkt" ${loopMarket ? 'checked' : ''}> ⚡ Cyclic Auto-Signings (5s)
</label>
`;

const sync = function() {
config.talento = parseInt(document.getElementById('inp-g-talento').value) || 350;
config.edad = parseInt(document.getElementById('inp-g-edad').value) || 25;
config.nivelMin = parseInt(document.getElementById('inp-g-nivel').value) || 80;
config.precioMax = parseInt(document.getElementById('inp-g-precio').value) || 50000000;
config.posicion = document.getElementById('sel-g-pos').value;
};
['inp-g-talento', 'inp-g-edad', 'inp-g-nivel', 'inp-g-precio', 'sel-g-pos'].forEach(id => {
if(document.getElementById(id)) { document.getElementById(id).oninput = sync; document.getElementById(id).onchange = sync; }
});

document.getElementById('btn-g-scan-mkt').onclick = ejecutarFichajes;
document.getElementById('btn-g-sell-mkt').onclick = procesarVentas;
document.getElementById('chk-g-auto-mkt').onchange = function(e) {
if (e.target.checked) { log("Automatic scanner activated."); loopMarket = setInterval(ejecutarFichajes, 5000); }
else { log("Automatic scanner deactivated."); clearInterval(loopMarket); loopMarket = null; }
};
}

function showTabXp() {
document.getElementById('god-tab-content').innerHTML = `
<p style="margin:0 0 10px 0; color:#8a4f55; font-size:12px;">Burn the remaining physical loads to boost squad levels.</p>
<button id="btn-g-run-xp" style="width:100%; background:#ff0033; color:#fff; border:none; padding:10px; font-weight:bold; border-radius:6px; cursor:pointer; margin-bottom:6px; font-size:12px; text-shadow: 0 0 3px #000;">🏋️‍♂️ INJECT XP INTO SQUAD</button>
<label style="display:flex; align-items:center; gap:6px; font-size:12px; color:#ffb3b3; cursor:pointer;">
<input type="checkbox" id="chk-g-auto-xp" ${loopXp ? 'checked' : ''}> 🔄 Auto-train lines every 8s
</label>
`;
document.getElementById('btn-g-run-xp').onclick = ejecutarXp;
document.getElementById('chk-g-auto-xp').onchange = function(e) {
if (e.target.checked) { log("Loop trainer turned on."); loopXp = setInterval(ejecutarXp, 8000); }
else { log("Loop trainer turned off."); clearInterval(loopXp); loopXp = null; }
};
}

function showTabMejoras() {
document.getElementById('god-tab-content').innerHTML = `
<button id="btn-g-infra" style="width:100%; background:#ff0033; color:#fff; border:none; padding:10px; font-weight:bold; border-radius:6px; cursor:pointer; font-size:12px; text-shadow:0 0 3px #000;">📊 AUDIT BUILDING PROFITABILITY</button>
`;
document.getElementById('btn-g-infra').onclick = evaluarInstalaciones;
}

function showTabEquipo() {
document.getElementById('god-tab-content').innerHTML = `
<button id="btn-g-team" style="width:100%; background:#ff0033; color:#fff; border:none; padding:10px; font-weight:bold; border-radius:6px; cursor:pointer; font-size:12px; text-shadow:0 0 3px #000;">🔬 VIEW SQUAD AVERAGES</button>
`;
document.getElementById('btn-g-team').onclick = analizarPlantilla;
}

function showTabAcademia() {
document.getElementById('god-tab-content').innerHTML = `
<p style="margin:0 0 10px 0; color:#8a4f55; font-size:12px;">Advanced SCM BOT Audit: Filter by combining Talent, Age, and Base Level.</p>
<button id="btn-g-acd" style="width:100%; background:#ff0033; color:#fff; border:none; padding:10px; font-weight:bold; border-radius:6px; cursor:pointer; font-size:12px; text-shadow:0 0 3px #000;">👶 SCAN YOUTH PLAYERS</button>
`;
document.getElementById('btn-g-acd').onclick = analizarAcademia;
}

function showTabConsejos() {
document.getElementById('god-tab-content').innerHTML = `
<select id="sel-g-objetivo" style="width:100%; background:#140002; color:#fff; border:1px solid #3d000a; padding:6px; border-radius:4px; font-size:12px; margin-bottom:8px;">
<option value="dinero">💸 Finance & Income Strategy</option>
<option value="deportivo">🏆 Titles & Competition Strategy</option>
<option value="cantera">🌱 Star Factory Strategy</option>
</select>
<button id="btn-g-cnj" style="width:100%; background:#ff0033; color:#fff; border:none; padding:10px; font-weight:bold; border-radius:6px; cursor:pointer; font-size:12px; text-shadow:0 0 3px #000;">🧠 DEPLOY STRATEGIC MODULE</button>
`;
document.getElementById('btn-g-cnj').onclick = procesarConsejos;
}

const tMkt = document.getElementById('tab-mkt'); const tXp = document.getElementById('tab-xp');
const tMej = document.getElementById('tab-mej'); const tEqp = document.getElementById('tab-eqp');
const tAcd = document.getElementById('tab-acd'); const tCnj = document.getElementById('tab-cnj');

function resetTabs() {
[tMkt, tXp, tMej, tEqp, tAcd, tCnj].forEach(b => { b.style.background = 'transparent'; b.style.color = '#ffb3b3'; b.style.border = 'none'; });
}

tMkt.onclick = function() { resetTabs(); tMkt.style.background = '#ff0033'; tMkt.style.color = '#fff'; showTabMarket(); };
tXp.onclick = function() { resetTabs(); tXp.style.background = '#ff0033'; tXp.style.color = '#fff'; showTabXp(); };
tMej.onclick = function() { resetTabs(); tMej.style.background = '#ff0033'; tMej.style.color = '#fff'; showTabMejoras(); };
tEqp.onclick = function() { resetTabs(); tEqp.style.background = '#ff0033'; tEqp.style.color = '#fff'; showTabEquipo(); };
tAcd.onclick = function() { resetTabs(); tAcd.style.background = '#ff0033'; tAcd.style.color = '#fff'; showTabAcademia(); };
tCnj.onclick = function() { resetTabs(); tCnj.style.background = '#ff0033'; tCnj.style.color = '#fff'; showTabConsejos(); };

document.getElementById('god-close-btn').onclick = function() {
if (loopMarket) clearInterval(loopMarket); if (loopXp) clearInterval(loopXp); panel.remove(); miniCircle.remove();
};

showTabMarket();
})();
