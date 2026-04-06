/* ============================================================
   PROMO.JS — Mekar Wangi Indonesia
   ============================================================
   File ini untuk mengatur Announcement Bar di bagian atas website.

   CARA EDIT:
   1. Buka file ini pakai Notepad / text editor
   2. Ubah "aktif: false" menjadi "aktif: true" kalau ada promo
   3. Ganti teks di bagian "teks:" sesuai promo yang berlaku
   4. Simpan file, upload ulang ke hosting
   5. Kalau promo selesai, ganti kembali "aktif: true" → "aktif: false"
   ============================================================ */

const PROMO_CONFIG = {
  aktif: false, // ← GANTI: true = tampilkan bar | false = sembunyikan bar

  teks: "🎁 Beli di atas Rp 50.000 gratis parfum 12ml pilihan! Berlaku di semua cabang.",
  // ↑ GANTI teks promo sesuai kebutuhan. Contoh lain:
  // "🎉 Promo Lebaran! Diskon 20% semua produk — 25–30 April"
  // "✨ Promo Akhir Bulan! Beli 2 gratis 1 parfum laundry 12ml"
  // "🛍️ Flash Sale Sabtu ini! Parfum baju mulai Rp 25.000"

  warna: "pink", // ← GANTI: "pink" atau "biru" atau "gelap"
};

/* ============================================================
   JANGAN EDIT DI BAWAH INI
   ============================================================ */
(function () {
  if (!PROMO_CONFIG.aktif) return;

  const warnaPalette = {
    pink: { bg: "#EBB8CB", text: "#5C1A30", close: "rgba(92,26,48,0.5)" },
    biru: { bg: "#B8D4EC", text: "#1A3A5C", close: "rgba(26,58,92,0.5)" },
    gelap: { bg: "#1A2835", text: "#F0F6FB", close: "rgba(240,246,251,0.5)" },
  };

  const warna = warnaPalette[PROMO_CONFIG.warna] || warnaPalette.pink;

  const bar = document.createElement("div");
  bar.id = "announcement-bar";
  bar.style.cssText = `
    background: ${warna.bg};
    color: ${warna.text};
    text-align: center;
    padding: 0.6rem 3rem;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    position: relative;
    z-index: 200;
    font-family: 'Outfit', sans-serif;
    line-height: 1.5;
  `;
  bar.innerHTML = `
    <span>${PROMO_CONFIG.teks}</span>
    <button onclick="document.getElementById('announcement-bar').remove(); document.querySelector('.navbar').style.top='0';"
      style="
        position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
        background: none; border: none; cursor: pointer;
        font-size: 1.1rem; color: ${warna.close};
        line-height: 1; padding: 0.2rem 0.4rem;
      " title="Tutup">✕</button>
  `;

  // Pasang bar sebelum navbar dan geser navbar ke bawah
  document.body.insertBefore(bar, document.body.firstChild);
  const barHeight = bar.offsetHeight;
  const navbar = document.querySelector(".navbar");
  if (navbar) navbar.style.top = barHeight + "px";

  // Update posisi navbar saat bar ditutup
  window.addEventListener("scroll", () => {
    const currentBar = document.getElementById("announcement-bar");
    if (navbar)
      navbar.style.top = currentBar ? currentBar.offsetHeight + "px" : "0";
  });
})();
