// Now-playing widget. Progressive: no JS means no widget, page is unaffected.
(function () {
  const root = document.getElementById("now-playing");
  if (!root) return;

  const art = root.querySelector(".np-art");
  const title = root.querySelector(".np-title");
  const artist = root.querySelector(".np-artist");
  const fill = root.querySelector(".np-progress span");

  let duration = 0;
  let progress = 0;
  let syncedAt = 0;

  function render() {
    if (!duration) return;
    const elapsed = progress + (Date.now() - syncedAt);
    const pct = Math.min(100, (elapsed / duration) * 100);
    fill.style.width = pct.toFixed(2) + "%";
  }

  async function poll() {
    try {
      const res = await fetch("/api/now-playing", { cache: "no-store" });
      const data = await res.json();

      if (!data.playing) {
        root.hidden = true;
        return;
      }

      title.textContent = data.title;
      title.href = data.url || "#";
      artist.textContent = data.artist;
      if (data.art && art.src !== data.art) art.src = data.art;

      duration = data.duration || 0;
      progress = data.progress || 0;
      syncedAt = Date.now();

      root.hidden = false;
      render();
    } catch {
      root.hidden = true;
    }
  }

  setInterval(render, 1000);
  poll();
  setInterval(poll, 30000);
})();
