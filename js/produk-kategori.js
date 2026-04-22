/* ============================================================
   PRODUK-KATEGORI.JS — Mekar Wangi Indonesia
   ============================================================ */

(function () {
  const PER_PAGE = 12;
  let currentPage = 1;
  let allProduk = [];

  async function init() {
    const grid = document.getElementById("produk-grid");
    const countEl = document.getElementById("produk-count");
    if (!grid) return;

    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)">
        <div class="loading-spinner"></div>
        <p>Memuat produk...</p>
      </div>`;

    try {
      const res = await fetch(
        `${API_PRODUK_URL}?action=produk&kategori=${KATEGORI_HALAMAN}&semua=1&limit=500`,
      );
      const json = await res.json();

      if (!json.success || !json.data.length) {
        grid.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)">
            Belum ada produk untuk kategori ini.
          </div>`;
        if (countEl)
          countEl.innerHTML = `Menampilkan <strong>0</strong> produk`;
        return;
      }

      // Urutkan abjad di client juga (double safety)
      allProduk = json.data.sort((a, b) => a.nama.localeCompare(b.nama, "id"));

      renderPage(1);
    } catch (err) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)">
          Gagal memuat produk. Pastikan sistem toko aktif.<br>
          <small style="font-size:0.75rem">${err.message}</small>
        </div>`;
    }
  }

  function renderPage(page) {
    currentPage = page;

    const grid = document.getElementById("produk-grid");
    const countEl = document.getElementById("produk-count");
    if (!grid) return;

    const source = window._filteredProduk ?? allProduk;
    const total = source.length;
    const totalPages = Math.ceil(total / PER_PAGE);
    const start = (page - 1) * PER_PAGE;
    const end = Math.min(start + PER_PAGE, total);
    const pageProduk = source.slice(start, end);

    // Update counter
    if (countEl) {
      const isFiltered =
        window._filteredProduk !== null && window._filteredProduk !== undefined;
      countEl.innerHTML =
        total === 0
          ? `Tidak ada produk yang cocok`
          : `Menampilkan <strong>${start + 1}–${end}</strong> dari <strong>${total}</strong> produk ${LABEL_KATEGORI}${isFiltered ? " (hasil pencarian)" : ""}`;
    }

    // Render cards
    grid.innerHTML = pageProduk
      .map((p, i) => {
        const delay = [
          "",
          "delay-1",
          "delay-2",
          "delay-3",
          "delay-4",
          "delay-5",
        ][i % 6];
        const waText = encodeURIComponent(
          `Halo Mekar Wangi, saya mau pesan ${LABEL_KATEGORI}: ${p.nama}`,
        );
        const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

        const fotoHTML = p.foto_url
          ? `<img src="../parfum-stock/${p.foto_url}" alt="${p.nama}" loading="lazy"/>`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;background:linear-gradient(135deg,var(--blue-pale),var(--pink-pale))">🌸</div>`;

        const deskHTML = p.deskripsi
          ? `<div class="produk-desc-short">${p.deskripsi}</div>`
          : "";

        const stokBadge = !p.tersedia
          ? `<span style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.55);color:#fff;font-size:0.6rem;padding:0.15rem 0.5rem;border-radius:99px;font-weight:500">Stok Habis</span>`
          : "";

        return `
        <div class="produk-card-main anim ${delay}">
          <div class="produk-thumb">
            ${fotoHTML}
            ${stokBadge}
          </div>
          <div class="produk-info-main">
            <div class="produk-cat">${LABEL_KATEGORI}</div>
            <div class="produk-name">${p.nama}</div>
            ${deskHTML}
            <button class="produk-wa"
              ${!p.tersedia ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ""}
              onclick="window.open('${waUrl}','_blank')">
              💬 ${p.tersedia ? "Pesan via WA" : "Stok Habis"}
            </button>
          </div>
        </div>`;
      })
      .join("");

    // Animasi
    document.querySelectorAll(".produk-card-main.anim").forEach((el) => {
      animObserver.observe(el);
    });

    // Render pagination
    renderPagination(page, totalPages);

    // Scroll ke atas grid produk
    const produkSection = document.getElementById("produk-list");
    if (produkSection && page > 1) {
      produkSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderPagination(current, total) {
    // Hapus pagination lama kalau ada
    const old = document.getElementById("produk-pagination");
    if (old) old.remove();
    if (total <= 1) return;

    // Buat nomor halaman yang ditampilkan
    const pages = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("...");
      for (
        let i = Math.max(2, current - 1);
        i <= Math.min(total - 1, current + 1);
        i++
      ) {
        pages.push(i);
      }
      if (current < total - 2) pages.push("...");
      pages.push(total);
    }

    const btnStyle = `
      display:inline-flex;align-items:center;justify-content:center;
      min-width:40px;height:40px;padding:0 8px;
      border-radius:8px;border:1.5px solid var(--border);
      background:none;color:var(--mid);font-size:0.88rem;
      cursor:pointer;font-family:var(--ff-body);
      transition:var(--transition);text-decoration:none;
    `;
    const btnActiveStyle = `
      display:inline-flex;align-items:center;justify-content:center;
      min-width:40px;height:40px;padding:0 8px;
      border-radius:8px;border:1.5px solid var(--blue);
      background:var(--blue);color:#fff;font-size:0.88rem;
      cursor:pointer;font-family:var(--ff-body);font-weight:500;
    `;
    const btnDisabledStyle = `
      display:inline-flex;align-items:center;justify-content:center;
      min-width:40px;height:40px;padding:0 8px;
      border-radius:8px;border:1.5px solid var(--border);
      background:none;color:var(--border);font-size:0.88rem;
      cursor:not-allowed;font-family:var(--ff-body);
    `;

    const paginationHTML = `
      <div id="produk-pagination" style="
        display:flex;justify-content:center;align-items:center;
        gap:6px;margin-top:2.5rem;flex-wrap:wrap;padding:0 1rem;
      ">
        ${
          current > 1
            ? `<button onclick="window._gotoPage(${current - 1})" style="${btnStyle}">«</button>`
            : `<span style="${btnDisabledStyle}">«</span>`
        }

        ${pages
          .map((p) =>
            p === "..."
              ? `<span style="color:var(--muted);padding:0 4px;line-height:40px">...</span>`
              : p === current
                ? `<span style="${btnActiveStyle}">${p}</span>`
                : `<button onclick="window._gotoPage(${p})" style="${btnStyle}">${p}</button>`,
          )
          .join("")}

        ${
          current < total
            ? `<button onclick="window._gotoPage(${current + 1})" style="${btnStyle}">»</button>`
            : `<span style="${btnDisabledStyle}">»</span>`
        }
      </div>`;

    // Sisipkan setelah grid
    const grid = document.getElementById("produk-grid");
    if (grid) grid.insertAdjacentHTML("afterend", paginationHTML);
  }

  // Expose fungsi ganti halaman ke global
  window._gotoPage = function (page) {
    renderPage(page);
  };
  window._searchProduk = function (keyword) {
    const q = keyword.toLowerCase().trim();
    if (q === "") {
      // Reset ke semua produk
      window._filteredProduk = null;
    } else {
      window._filteredProduk = allProduk.filter((p) =>
        p.nama.toLowerCase().includes(q),
      );
    }
    renderPage(1);
  };
  // Jalankan
  document.addEventListener("DOMContentLoaded", init);
})();
