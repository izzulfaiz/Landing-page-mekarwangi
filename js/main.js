/* ============================================================
   MAIN.JS — Mekar Wangi Indonesia
   Script global yang dipakai di semua halaman.
   ============================================================ */

/* ── 1. NAVBAR: tambah shadow saat scroll ── */
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 30);
});

/* ── 2. SCROLL ANIMATION (pengganti AOS) ── */
const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        animObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".anim").forEach((el) => animObserver.observe(el));

/* ── 3. MOBILE MENU ── */
function toggleMenu() {
  const links = document.querySelector(".nav-links");
  const isOpen = links.getAttribute("data-open") === "true";
  if (isOpen) {
    links.removeAttribute("style");
    links.setAttribute("data-open", "false");
  } else {
    links.style.cssText = `
      display: flex; flex-direction: column;
      position: absolute; top: 100%; left: 0; right: 0;
      background: var(--white); padding: 1rem 5%;
      border-bottom: 1px solid var(--border);
      box-shadow: var(--shadow-md); gap: 1rem; z-index: 99;
    `;
    links.setAttribute("data-open", "true");
  }
}

/* ── 4. FAQ ACCORDION ── */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains("open");
  document
    .querySelectorAll(".faq-item.open")
    .forEach((i) => i.classList.remove("open"));
  if (!isOpen) item.classList.add("open");
}

/* ── 5. CARA PESAN TABS ── */
function switchTab(tab) {
  document
    .querySelectorAll(".cara-tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".cara-content")
    .forEach((c) => c.classList.remove("active"));
  event.currentTarget.classList.add("active");
  const target = document.getElementById("tab-" + tab);
  if (target) target.classList.add("active");
}

/* ── 6. FILTER PRODUK ── */
function filterProduk(kategori, btn) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const cards = document.querySelectorAll(".produk-card-main");
  let count = 0;
  cards.forEach((card) => {
    const match = kategori === "semua" || card.dataset.kategori === kategori;
    card.style.display = match ? "block" : "none";
    if (match) count++;
  });
  const countEl = document.getElementById("produk-count");
  if (countEl) {
    countEl.innerHTML = `Menampilkan <strong>${count}</strong> produk${kategori !== "semua" ? " — " + kategori : " unggulan"}`;
  }
}

/* ── 7. ORDER WHATSAPP ── */
function orderWA(namaProduk, kategori) {
  const kat = kategori || "produk";
  const pesan = `Halo Mekar Wangi, saya mau pesan ${kat}: ${namaProduk}`;
  window.open(
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`,
    "_blank",
  );
}

/* ── 8. WA WIDGET INTERAKTIF ── */
const WA_NUMBER = "6285738894427"; // ← GANTI dengan nomor WA toko utama
const WA_GREETING =
  "Halo! Ada yang bisa kami bantu? 😊\nKami siap melayani pesanan parfum baju & laundry Anda.";

(function buildWAWidget() {
  const widget = document.createElement("div");
  widget.id = "wa-widget";
  widget.innerHTML = `
    <div id="wa-popup" style="display:none;">
      <div id="wa-popup-header">
        <div id="wa-popup-avatar">🌸</div>
        <div id="wa-popup-info">
          <strong>Mekar Wangi Indonesia</strong>
          <span>● Online — Respon Cepat</span>
        </div>
        <button id="wa-popup-close" onclick="closeWAWidget()" title="Tutup">✕</button>
      </div>
      <div id="wa-popup-body">
        <div id="wa-popup-bubble">
          <p>${WA_GREETING.replace(/\n/g, "<br>")}</p>
          <span id="wa-popup-time">${getTime()}</span>
        </div>
      </div>
      <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Mekar Wangi, saya mau tanya produk")}"
        id="wa-popup-btn" target="_blank">
        💬 Mulai Chat WhatsApp
      </a>
    </div>
    <button id="wa-float-btn" onclick="toggleWAWidget()" title="Chat WhatsApp">
      <span id="wa-float-icon">💬</span>
      <span id="wa-float-badge">1</span>
    </button>
  `;
  document.body.appendChild(widget);

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    #wa-widget { position: fixed; bottom: 1.8rem; right: 1.8rem; z-index: 300; font-family: 'Outfit', sans-serif; }

    #wa-float-btn {
      width: 56px; height: 56px; border-radius: 50%;
      background: #25D366; color: #fff; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; box-shadow: 0 6px 24px rgba(37,211,102,0.45);
      transition: transform 0.25s, box-shadow 0.25s; position: relative;
    }
    #wa-float-btn:hover { transform: scale(1.08); box-shadow: 0 10px 32px rgba(37,211,102,0.55); }

    #wa-float-badge {
      position: absolute; top: -4px; right: -4px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #E84393; color: #fff;
      font-size: 0.65rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #fff; animation: pulse-badge 2s infinite;
    }
    @keyframes pulse-badge {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    #wa-popup {
      position: absolute; bottom: 70px; right: 0;
      width: 300px; background: #fff;
      border-radius: 16px; overflow: hidden;
      box-shadow: 0 12px 48px rgba(0,0,0,0.18);
      animation: popupIn 0.28s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes popupIn {
      from { opacity: 0; transform: translateY(12px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    #wa-popup-header {
      background: #075E54;
      padding: 1rem 1.2rem;
      display: flex; align-items: center; gap: 0.8rem;
    }
    #wa-popup-avatar {
      width: 42px; height: 42px; border-radius: 50%;
      background: #128C7E;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; flex-shrink: 0;
    }
    #wa-popup-info { flex: 1; }
    #wa-popup-info strong { display: block; color: #fff; font-size: 0.9rem; }
    #wa-popup-info span { font-size: 0.72rem; color: #9de3d8; }
    #wa-popup-close {
      background: none; border: none; color: rgba(255,255,255,0.6);
      font-size: 1rem; cursor: pointer; padding: 0.2rem 0.4rem;
      transition: color 0.2s;
    }
    #wa-popup-close:hover { color: #fff; }

    #wa-popup-body {
      padding: 1.2rem;
      background: #ECE5DD url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c5b8ab' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    #wa-popup-bubble {
      background: #fff;
      border-radius: 0 12px 12px 12px;
      padding: 0.8rem 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      position: relative; max-width: 90%;
    }
    #wa-popup-bubble::before {
      content: '';
      position: absolute; top: 0; left: -8px;
      border: 8px solid transparent;
      border-top-color: #fff; border-left: none;
    }
    #wa-popup-bubble p { font-size: 0.85rem; color: #303030; line-height: 1.6; margin: 0; font-weight: 400; }
    #wa-popup-time { font-size: 0.68rem; color: #8696A0; display: block; text-align: right; margin-top: 0.4rem; }

    #wa-popup-btn {
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      background: #25D366; color: #fff;
      padding: 0.9rem; font-size: 0.88rem; font-weight: 600;
      text-decoration: none; transition: background 0.2s;
    }
    #wa-popup-btn:hover { background: #128C4E; }

    @media (max-width: 400px) {
      #wa-popup { width: 260px; right: -10px; }
    }
  `;
  document.head.appendChild(style);

  // Auto show popup setelah 4 detik
  setTimeout(() => {
    const popup = document.getElementById("wa-popup");
    const badge = document.getElementById("wa-float-badge");
    if (popup && !sessionStorage.getItem("wa-popup-seen")) {
      popup.style.display = "block";
      if (badge) badge.style.display = "none";
    }
  }, 4000);
})();

function toggleWAWidget() {
  const popup = document.getElementById("wa-popup");
  const badge = document.getElementById("wa-float-badge");
  if (!popup) return;
  const isOpen = popup.style.display !== "none";
  popup.style.display = isOpen ? "none" : "block";
  if (!isOpen && badge) badge.style.display = "none";
  sessionStorage.setItem("wa-popup-seen", "true");
}

function closeWAWidget() {
  const popup = document.getElementById("wa-popup");
  if (popup) popup.style.display = "none";
  sessionStorage.setItem("wa-popup-seen", "true");
}

function getTime() {
  const now = new Date();
  return (
    now.getHours().toString().padStart(2, "0") +
    "." +
    now.getMinutes().toString().padStart(2, "0")
  );
}
