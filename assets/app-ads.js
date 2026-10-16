/* ASHA Shiksha web app: one small ad at the bottom of the home screen and module lesson lists only.
   Never on lessons, videos, picture activities, quizzes or certificates.
   Does nothing until window.ASHA_ADS has an AdSense client and slot (set by the site build). */
(function () {
  var LABEL = { gu: "જાહેરાત", hi: "विज्ञापन", mr: "जाहिरात" };
  var SHOW_ON = { home: 1, module: 1 };
  var loaded = false;
  function loadScript(client) {
    if (loaded) return;
    loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(client);
    document.head.appendChild(s);
  }
  window.__afterRender = function (view, lang) {
    var cfg = window.ASHA_ADS;
    if (!cfg || !cfg.client || !cfg.slot) return;
    if (!SHOW_ON[view] || navigator.onLine === false) return;
    var main = document.querySelector("#app main");
    if (!main || main.querySelector(".ad")) return;
    var box = document.createElement("div");
    box.className = "ad";
    var label = document.createElement("span");
    label.className = "ad-label";
    label.textContent = LABEL[lang] || "Advertisement";
    var ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", cfg.client);
    ins.setAttribute("data-ad-slot", cfg.slot);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    box.appendChild(label);
    box.appendChild(ins);
    main.appendChild(box);
    loadScript(cfg.client);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  };
})();
