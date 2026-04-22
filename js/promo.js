/* ============================================================
   PROMO.JS — Mekar Wangi Indonesia
   ============================================================
   CARA EDIT:
   1. Buka file ini pakai Notepad / text editor
   2. Ubah "aktif: false" menjadi "aktif: true" kalau ada promo
   3. Ganti teks di bagian "teks:" sesuai promo yang berlaku
   4. Simpan file, upload ulang ke hosting
   5. Kalau promo selesai, ganti kembali ke "aktif: false"
   ============================================================ */

const PROMO_CONFIG = {
  aktif: true, // ← GANTI: true = tampilkan | false = sembunyikan

  teks: "🎁 Beli di atas Rp 50.000 gratis parfum 12ml pilihan! Berlaku di semua cabang.",
  // Contoh teks lain:
  // "🎉 Promo Lebaran! Diskon 20% semua produk — 25–30 April"
  // "✨ Promo Akhir Bulan! Beli 2 gratis 1 parfum laundry 12ml"

  warna: "pink", // ← GANTI: "pink" | "biru" | "gelap"
};

/* ============================================================
   JANGAN EDIT DI BAWAH INI
   ============================================================ */
(function () {
  if (!PROMO_CONFIG.aktif) return;

  const warnaPalette = {
    pink: { bg: "#EBB8CB", text: "#5C1A30", close: "rgba(92,26,48,0.4)" },
    biru: { bg: "#B8D4EC", text: "#1A3A5C", close: "rgba(26,58,92,0.4)" },
    gelap: { bg: "#1A2835", text: "#F0F6FB", close: "rgba(240,246,251,0.4)" },
  };

  const warna = warnaPalette[PROMO_CONFIG.warna] || warnaPalette.pink;

  // Buat bar
  const bar = document.createElement("div");
  bar.id = "announcement-bar";
  bar.style.cssText = `
    background: ${warna.bg};
    color: ${warna.text};
    text-align: center;
    padding: 0.55rem 3rem;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 999;
    font-family: 'Outfit', sans-serif;
    line-height: 1.5;
  `;
  bar.innerHTML = `
    <span>${PROMO_CONFIG.teks}</span>
    <button id="promo-close-btn" title="Tutup" style="
      position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      font-size: 1.1rem; color: ${warna.close};
      line-height: 1; padding: 0.2rem 0.4rem;
    ">✕</button>
  `;

  document.body.insertBefore(bar, document.body.firstChild);

  // Hitung tinggi bar lalu geser navbar dan hero
  function applyOffset() {
    const barH = bar.offsetHeight;
    const navbar = document.querySelector(".navbar");
    const navH = navbar ? navbar.offsetHeight : 64;
    if (navbar) navbar.style.top = barH + "px";
    document.body.style.paddingTop = barH + navH + "px";
  }

  applyOffset();
  window.addEventListener("resize", applyOffset);

  // Tombol tutup
  document
    .getElementById("promo-close-btn")
    .addEventListener("click", function () {
      bar.remove();
      const navbar = document.querySelector(".navbar");
      const navH = navbar ? navbar.offsetHeight : 64;
      if (navbar) navbar.style.top = "0";
      document.body.style.paddingTop = navH + "px";
    });
})();
