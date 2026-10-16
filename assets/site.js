/* ASHA Shiksha website: register the offline helper (service worker) so pages and the app open without internet */
(function () {
  if (!("serviceWorker" in navigator)) return;
  var root = document.documentElement.getAttribute("data-root") || "";
  window.addEventListener("load", function () {
    navigator.serviceWorker.register(root + "sw.js").catch(function () {});
  });
})();
