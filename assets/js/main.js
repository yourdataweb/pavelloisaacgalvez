/* Pavelló Isaac Galvez — progressive enhancement only.
   The page is fully usable without this file. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", function () { setOpen(nav.getAttribute("data-open") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (nav.getAttribute("data-open") !== "true") return;
      if (e.target.closest("#site-nav") || e.target.closest(".nav-toggle")) return;
      setOpen(false);
    });
  }

  /* ---------- sticky header shadow ---------- */
  var head = document.querySelector(".site-head");
  if (head) {
    var onScroll = function () {
      head.style.boxShadow = window.scrollY > 8 ? "0 6px 24px -20px rgba(6,32,46,.6)" : "none";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- reveal ---------- */
  var items = document.querySelectorAll(".reveal");
  if (items.length && !reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- cookie consent + map gate + analytics ---------- */
  var KEY = "cookie-consent-v1";
  var bar = document.getElementById("cookiebar");
  var shell = document.getElementById("map-shell");

  function stored() { try { return window.localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { window.localStorage.setItem(KEY, v); } catch (e) {} }

  function loadMap() {
    if (!shell || shell.getAttribute("data-map-loaded") === "true") return;
    var tpl = document.getElementById("map-template");
    if (!tpl) return;
    shell.appendChild(tpl.content.cloneNode(true));
    shell.setAttribute("data-map-loaded", "true");
  }

  function showBar() { if (bar) bar.setAttribute("data-visible", "true"); }
  function hideBar() { if (bar) bar.setAttribute("data-visible", "false"); }

  var choice = stored();
  if (!choice && bar) window.setTimeout(showBar, 1100);
  else if (choice === "accepted") loadMap();

  if (bar) {
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cookie]");
      if (!btn) return;
      var v = btn.getAttribute("data-cookie");
      store(v);
      hideBar();
      if (window.__analyticsConsent) window.__analyticsConsent(v === "accept");
      if (v === "accept") loadMap();
    });
  }

  var mapBtn = document.querySelector("[data-map-load]");
  if (mapBtn) {
    mapBtn.addEventListener("click", function () {
      store("accepted");
      hideBar();
      if (window.__analyticsConsent) window.__analyticsConsent(true);
      loadMap();
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
