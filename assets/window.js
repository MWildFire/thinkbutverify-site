(function () {
"use strict";
var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var field = document.querySelector(".hero-noise");
if (field) {
var cs = getComputedStyle(field);
var restX = parseFloat(cs.getPropertyValue("--rest-x")) / 100 || 0.66;
var restY = parseFloat(cs.getPropertyValue("--rest-y")) / 100 || 0.58;
var x = 0, y = 0, tx = 0, ty = 0, raf = 0, sweeping = false;
var rest = function () { return [field.clientWidth * restX, field.clientHeight * restY]; };
var put = function (px, py) {
x = px; y = py;
field.style.setProperty("--wx", px.toFixed(1) + "px");
field.style.setProperty("--wy", py.toFixed(1) + "px");
};
var tick = function () {
raf = 0;
var nx = x + (tx - x) * 0.22, ny = y + (ty - y) * 0.22;
if (Math.abs(tx - nx) + Math.abs(ty - ny) < 0.4) { put(tx, ty); return; }
put(nx, ny);
raf = requestAnimationFrame(tick);
};
var go = function (px, py) {
tx = px; ty = py;
if (reduce) { put(px, py); return; }
if (!raf) { raf = requestAnimationFrame(tick); }
};
var home = function () { var r = rest(); go(r[0], r[1]); };
var local = function (e) { var b = field.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
field.addEventListener("pointermove", function (e) {
if (sweeping) { return; }
if (e.pointerType !== "mouse" && !e.buttons) { return; }
var p = local(e); go(p[0], p[1]);
});
field.addEventListener("pointerdown", function (e) {
if (e.pointerType === "mouse") { return; }
sweeping = false;
var p = local(e); go(p[0], p[1]);
});
field.addEventListener("pointerleave", home);
field.addEventListener("pointerup", function (e) { if (e.pointerType !== "mouse") { home(); } });
field.addEventListener("pointercancel", home);
window.addEventListener("resize", function () { if (!sweeping) { var r = rest(); put(r[0], r[1]); } });
field.classList.add("is-live");
var r0 = rest();
if (reduce) {
put(r0[0], r0[1]);
} else {
var sx = field.clientWidth * 0.24, sy = field.clientHeight * 0.46, t0 = 0, steps = 7, dur = 1400;
sweeping = true;
put(sx, sy);
var sweep = function (now) {
if (!t0) { t0 = now; }
var k = Math.min(steps, Math.floor((now - t0) / dur * steps));
var r = rest();
put(sx + (r[0] - sx) * k / steps, sy + (r[1] - sy) * k / steps);
if (k < steps && sweeping) { requestAnimationFrame(sweep); } else { sweeping = false; tx = x; ty = y; }
};
setTimeout(function () { requestAnimationFrame(sweep); }, 350);
}
}
})();
