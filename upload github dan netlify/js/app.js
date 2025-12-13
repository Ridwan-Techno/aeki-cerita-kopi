// ---------- WhatsApp Button Logic ----------
(function(){
  const WA_NUMBER = "6282164966635";
  const WA_BASE = "https://wa.me/" + WA_NUMBER + "?text=";

  function createDirectWAButton(prod){
    const target = document.querySelector('.meta-row');
    if(!target) return;
    if(!(prod.stok && parseInt(prod.stok) > 0)) return; // hanya tampil jika stok > 0

    const existing = document.getElementById('waContainerInjected');
    if(existing) existing.remove();

    const btn = document.createElement('a');
    btn.id = 'waContainerInjected';
    btn.href = '#';
    btn.innerHTML = 'Pesan via WhatsApp';
    btn.style.background = '#25D366';
    btn.style.color = '#fff';
    btn.style.padding = '8px 12px';
    btn.style.borderRadius = '8px';
    btn.style.display = 'inline-block';
    btn.style.marginTop = '8px';
    btn.style.fontWeight = '600';
    btn.style.textDecoration = 'none';
    btn.onclick = (e) => {
      e.preventDefault();
      const msg = `Halo AEKI, saya ingin memesan ${prod.nama} (jumlah: ${prod.stok}gram, harga: Rp ${prod.harga}).`;
      window.open(WA_BASE + encodeURIComponent(msg), '_blank');
    };

    target.insertAdjacentElement('afterend', btn);
  }

  // Expose to window
  window.placeWAButtonUnderHarga = createDirectWAButton;
})();

// ---------- Main App Logic ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, get, child, update, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKcH2BXe5c3RtieUdM2pZArRs_NiFgXt0",
  authDomain: "aeki-cerita-kopi.firebaseapp.com",
  databaseURL: "https://aeki-cerita-kopi-default-rtdb.firebaseio.com",
  projectId: "aeki-cerita-kopi",
  storageBucket: "aeki-cerita-kopi.firebasestorage.app",
  messagingSenderId: "67809009578",
  appId: "1:67809009578:web:888c79fd360972ee6655d3",
  measurementId: "G-FGVK46LSSF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const produkRef = ref(db, 'produk');

// Default seed data
const defaultData = [
  {
    nama: "Kopi Arabica Gayo",
    jenis: "Arabica",
    asal: "Aceh Tengah",
    harga: "120000",
    aroma: "Fruity",
    rasa: "Seimbang",
    keasaman: "Medium",
    body: "Full",
    grade: "Specialty",
    kadarAir: "12%",
    defect: "5",
    screen: "17-18",
    kategori: "Green Bean",
    deskripsi: "Rasa fruity dengan keasaman seimbang dan aroma khas.",
    gambar: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03",
    stok: 25
  },
  {
    nama: "Kopi Toraja Kalosi",
    jenis: "Arabica",
    asal: "Sulawesi Selatan",
    harga: "110000",
    aroma: "Cokelat",
    rasa: "Manis dan kompleks",
    keasaman: "Low",
    body: "Full",
    grade: "Premium",
    kadarAir: "11%",
    defect: "3",
    screen: "18",
    kategori: "Roasting",
    deskripsi: "Body penuh dengan aftertaste manis seperti cokelat.",
    gambar: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff",
    stok: 10
  },
  {
    nama: "Kopi Kintamani",
    jenis: "Arabica",
    asal: "Bali",
    harga: "95000",
    aroma: "Citrus",
    rasa: "Segar",
    keasaman: "Tinggi",
    body: "Light",
    grade: "Specialty",
    kadarAir: "12%",
    defect: "4",
    screen: "17",
    kategori: "Green Bean",
    deskripsi: "Cita rasa citrus segar dengan keasaman tinggi yang menyenangkan.",
    gambar: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb",
    stok: 0
  }
];

// DOM elements
const searchPublic = document.getElementById("searchPublic");
const filterJenisPublic = document.getElementById("filterJenisPublic");
const filterGradePublic = document.getElementById("filterGradePublic");
const filterKategoriPublic = document.getElementById("filterKategoriPublic");
const produkList = document.getElementById("produkList");
const detailView = document.getElementById("detailView");
const detailContent = document.getElementById("detailContent");
const backToList = document.getElementById("backToList");

const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const cancelLogin = document.getElementById("cancelLogin");
const loginSubmit = document.getElementById("loginSubmit");
const logoutBtn = document.getElementById("logoutBtn");

const adminPanel = document.getElementById("adminPanel");
const homeBtn = document.getElementById("homeBtn");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const logoutAdminBtn = document.getElementById("logoutAdminBtn");

const searchAdmin = document.getElementById("searchAdmin");
const filterJenisAdmin = document.getElementById("filterJenisAdmin");
const filterGradeAdmin = document.getElementById("filterGradeAdmin");
const filterKategoriAdmin = document.getElementById("filterKategoriAdmin");
const adminProdukList = document.getElementById("adminProdukList");

const formTitle = document.getElementById("formTitle");
const newNama = document.getElementById("newNama");
const newJenis = document.getElementById("newJenis");
const newAsal = document.getElementById("newAsal");
const newHarga = document.getElementById("newHarga");
const newStok = document.getElementById("newStok");
const newAroma = document.getElementById("newAroma");
const newRasa = document.getElementById("newRasa");
const newKeasaman = document.getElementById("newKeasaman");
const newBody = document.getElementById("newBody");
const newGrade = document.getElementById("newGrade");
const newKadarAir = document.getElementById("newKadarAir");
const newDefect = document.getElementById("newDefect");
const newScreen = document.getElementById("newScreen");
const newKategori = document.getElementById("newKategori");
const newDeskripsi = document.getElementById("newDeskripsi");
const newGambarFile = document.getElementById("newGambarFile");
const previewGambar = document.getElementById("previewGambar");
const addProduk = document.getElementById("addProduk");
const resetForm = document.getElementById("resetForm");

const navLinkHome = document.getElementById("navLinkHome");
const navLinkProduk = document.getElementById("navLinkProduk");
const navLinkTentang = document.getElementById("navLinkTentang");
const btnLihatProduk = document.getElementById("btnLihatProduk");

const pageDetail = document.getElementById('pageDetail');
const btnKembali = document.getElementById('btnKembali');

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const loginBtnMobile = document.getElementById('loginBtnMobile');

// App State
let produkData = []; 
let editId = null;   
let uploadedImage = ""; 
let radarChart = null;
let barChart = null;

// Helpers
function matchesFilter(item, q, jenis, grade, kategori) {
  const qLow = (q || '').trim().toLowerCase();
  const matchesQ = !qLow || (
    (item.nama || "").toLowerCase().includes(qLow) ||
    (item.asal || "").toLowerCase().includes(qLow) ||
    (item.jenis || "").toLowerCase().includes(qLow)
  );
  const matchesJenis = !jenis || (item.jenis === jenis);
  const matchesGrade = !grade || (item.grade === grade);
  const matchesKategori = !kategori || (item.kategori === kategori);
  return matchesQ && matchesJenis && matchesGrade && matchesKategori;
}

// Firebase: seed DB if empty
async function seedIfEmpty() {
  const snap = await get(produkRef);
  if (!snap.exists()) {
    defaultData.forEach(item => {
      const p = Object.assign({}, item, { createdAt: Date.now() });
      push(produkRef).then(r => set(r, p));
    });
  }
}

// Firebase: load produk realtime
function bindProdukRealtime() {
  onValue(produkRef, (snapshot) => {
    const raw = snapshot.val() || {};
    produkData = Object.keys(raw).map(k => {
      return Object.assign({ id: k }, raw[k]);
    }).sort((a,b)=> (b.createdAt||0) - (a.createdAt||0)); // newest first
    renderProdukPublic();
    renderProdukAdmin();
    // if URL hash matches key, open detail
    if (window.location.hash.startsWith('#detail=')) {
      const id = window.location.hash.split('=')[1];
      const found = produkData.findIndex(p => p.id === id);
      if (found !== -1) openPremiumDetailById(id);
    }
  });
}

// Render Public
function renderProdukPublic() {
  const q = searchPublic.value || "";
  const jenis = filterJenisPublic.value;
  const grade = filterGradePublic.value;
  const kategori = filterKategoriPublic.value;
  produkList.innerHTML = "";
  const filtered = produkData.filter(p => matchesFilter(p, q, jenis, grade, kategori));
  if (filtered.length === 0) {
    produkList.innerHTML = `<p class="text-center col-span-3 text-stone-500">Tidak ada produk ditemukan.</p>`;
    return;
  }
  filtered.forEach((kopi) => {
    const cardBtn = document.createElement('button');
    cardBtn.className = "bg-stone-50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition hover:-translate-y-1 cursor-pointer text-left";
    cardBtn.setAttribute('type','button');
    cardBtn.dataset.id = kopi.id;
    cardBtn.innerHTML = `
      <img src="${kopi.gambar || 'https://via.placeholder.com/600x400?text=No+Image'}" alt="${kopi.nama}" class="h-52 w-full object-cover">
      <div class="p-5">
        <h3 class="text-xl font-semibold mb-1">${kopi.nama}</h3>
        <p class="text-sm text-stone-500 mb-1">Grade: ${kopi.grade || '-'}</p>
        <p class="text-sm text-stone-500 mb-1">Kategori: ${kopi.kategori || '-'}</p>
        <p class="text-sm text-stone-500 mb-1">Stok: ${typeof kopi.stok !== 'undefined' ? kopi.stok : 0}</p>
        
      </div>`;
    cardBtn.addEventListener('click', () => openPremiumDetailById(kopi.id));
    produkList.appendChild(cardBtn);
  });
}

// Open Premium Detail by id (full page)
function openPremiumDetailById(id) {
  const p = produkData.find(x => x.id === id);
  if (!p) return alert("Produk tidak ditemukan.");

  // populate hero
  document.getElementById('detailImgHero').src = p.gambar || '';
  document.getElementById('detailBadge').textContent = `${p.kategori || 'Produk'} • ${p.jenis || '-'}`;
  document.getElementById('detailNama').textContent = p.nama || '-';
  document.getElementById('detailSub').textContent = (p.rasa ? p.rasa + ' • ' : '') + (p.aroma ? p.aroma : '');
  document.getElementById('pillAsal').textContent = p.asal || '-';
  document.getElementById('pillHarga').textContent = p.harga ? 'Rp ' + p.harga : '-';
  document.getElementById('pillJenis').textContent = p.jenis || '-';

  // Deskripsi & aside
  document.getElementById('detailRingkasan').textContent = p.deskripsi || '-';
  document.getElementById('asideNama').textContent = p.nama || '-';
  document.getElementById('asideAsal').textContent = p.asal || '-';
  document.getElementById('asideHarga').textContent = p.harga ? 'Rp ' + p.harga : '-';
  document.getElementById('asideStok').textContent = typeof p.stok !== 'undefined' ? p.stok : 0;

  // Specs
  document.getElementById('dlGrade').textContent = p.grade || '-';
  document.getElementById('dlMoisture').textContent = p.kadarAir || '-';
  document.getElementById('dlDefect').textContent = p.defect || '-';
  document.getElementById('dlScreen').textContent = p.screen || '-';
  document.getElementById('dlJenis').textContent = p.jenis || '-';
  document.getElementById('dlKategori').textContent = p.kategori || '-';
  document.getElementById('dlAroma').textContent = p.aroma || '-';
  document.getElementById('dlStok').textContent = typeof p.stok !== 'undefined' ? p.stok : 0;

  // Taste pills
  const tasteEl = document.getElementById('tastePills');
  tasteEl.innerHTML = '';
  const tastes = (p.rasa || '').split(/[,;\/•]/).map(s=>s.trim()).filter(Boolean);
  if(tastes.length===0 && p.aroma) tastes.push(p.aroma);
  tastes.forEach(t => {
    const d = document.createElement('div');
    d.className = 'taste-pill';
    d.textContent = t;
    tasteEl.appendChild(d);
  });

  // tags
  const tagBox = document.getElementById('tagList');
  tagBox.innerHTML = '';
  const tags = [p.kategori, p.jenis, p.grade, p.aroma].filter(Boolean);
  tags.forEach(t => {
    const el = document.createElement('div');
    el.style.background = 'rgba(255,255,255,0.04)';
    el.style.padding = '6px 10px';
    el.style.borderRadius = '999px';
    el.style.fontSize = '13px';
    el.textContent = t;
    tagBox.appendChild(el);
  });

  // QR code
  const qrContainer = document.getElementById('qrContainer');
  qrContainer.innerHTML = '';
  try {
    const qrcode = new QRCode(qrContainer, {
      text: window.location.origin + window.location.pathname + '#detail=' + id,
      width: 120,
      height: 120
    });
  } catch(e){}

  // Charts
  const radarCtx = document.getElementById('radarTaste').getContext('2d');
  const barCtx = document.getElementById('barRoast').getContext('2d');

  const getScore = (key) => {
    const v = (p[key] || '').toString().toLowerCase();
    if(!v) return 5;
    if(key === 'keasaman'){
      if(v.includes('low') || v.includes('rendah')) return 3;
      if(v.includes('high') || v.includes('tinggi')) return 8;
      if(v.includes('medium') || v.includes('sedang')|| v.includes('medium')) return 6;
      return 5;
    }
    if(key === 'body'){
      if(v.includes('full')) return 8;
      if(v.includes('light')) return 4;
      return 6;
    }
    if(key === 'grade'){
      if(v.toLowerCase().includes('special')) return 9;
      if(v.toLowerCase().includes('premium')) return 7;
      return 5;
    }
    return 5;
  };

  const aromaScore = 7;
  const acidityScore = getScore('keasaman');
  const bodyScore = getScore('body');
  const sweetnessScore = p.rasa && p.rasa.toLowerCase().includes('manis') ? 7 : 4;
  const aftertasteScore = 6;

  const radarLabels = ['Aroma','Acidity','Body','Sweetness','Aftertaste'];
  const radarData = [aromaScore, acidityScore, bodyScore, sweetnessScore, aftertasteScore];

  if (radarChart) { radarChart.destroy(); radarChart = null; }
  if (barChart) { barChart.destroy(); barChart = null; }

  // Radar Chart Config
  radarChart = new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: radarLabels,
      datasets: [{
        label: 'Profil Rasa',
        data: radarData,
        borderWidth: 2,
        borderColor: '#c99a6b', // Coffee-500
        backgroundColor: 'rgba(201, 154, 107, 0.2)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#c99a6b',
        pointHoverBackgroundColor: '#fff'
      }]
    },
    options: {
      plugins:{ legend:{ display:false } },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 10,
          grid: { color: 'rgba(255,255,255,0.1)' },
          angleLines: { color: 'rgba(255,255,255,0.05)' },
          pointLabels: { 
            color: 'rgba(255,255,255,0.7)',
            font: { size: 11, family: 'Poppins' }
          },
          ticks: { display:false }
        }
      }
    }
  });

  // Bar Chart Config
  const roastLabels = ['Roast Level'];
  const roastVal = (p.kategori && p.kategori.toLowerCase().includes('roast')) ? 7 : 4;
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: roastLabels,
      datasets: [{
        label: 'Roast Intensity',
        data: [roastVal],
        borderRadius: 4,
        borderWidth: 0,
        backgroundColor: ['#8b5e4f'] // Coffee-600
      }]
    },
    options: {
      indexAxis: 'y',
      plugins:{ legend:{ display:false } },
      scales: {
        x: { 
          display:false, 
          min:0, 
          max:10 
        },
        y: { 
          display:false 
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // show/hide sections
  document.getElementById('mainNav').classList.add('hidden');
  document.getElementById('home').classList.add('hidden');
  document.getElementById('produk').classList.add('hidden');
  document.getElementById('tentang').classList.add('hidden');
  document.querySelector('footer').classList.add('hidden');

  // Inject WA Button
  try {
    if (typeof placeWAButtonUnderHarga === 'function') {
      placeWAButtonUnderHarga(p);
    }
  } catch(e) {
    console.warn('WA button injection error:', e);
  }

  pageDetail.classList.remove('hidden');
  pageDetail.setAttribute('aria-hidden','false');
  window.location.hash = `detail=${id}`;
}

// back from premium detail
btnKembali.addEventListener('click', () => {
  pageDetail.classList.add('hidden');
  pageDetail.setAttribute('aria-hidden','true');
  document.getElementById('mainNav').classList.remove('hidden');
  document.getElementById('home').classList.remove('hidden');
  document.getElementById('produk').classList.remove('hidden');
  document.getElementById('tentang').classList.remove('hidden');
  document.querySelector('footer').classList.remove('hidden');
  if (window.location.hash.startsWith('#detail')) history.replaceState(null, '', window.location.pathname + window.location.search);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Filters events
[searchPublic, filterJenisPublic, filterGradePublic, filterKategoriPublic].forEach(el => {
  el && el.addEventListener('input', renderProdukPublic);
  el && el.addEventListener('change', renderProdukPublic);
});

// Login modal
const openLoginModal = () => loginModal.classList.remove('hidden');
loginBtn.onclick = openLoginModal;
if(loginBtnMobile) loginBtnMobile.onclick = openLoginModal;

cancelLogin.onclick = () => loginModal.classList.add('hidden');
loginSubmit.onclick = () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (user === "admin" && pass === "12345") {
    loginModal.classList.add('hidden');
    document.getElementById('mainNav').classList.add('hidden');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('produk').classList.add('hidden');
    document.getElementById('tentang').classList.add('hidden');
    document.querySelector('footer').classList.add('hidden');
    adminPanel.classList.remove('hidden');
    localStorage.setItem("isAdminLogin", "true");
    try { logoutBtn.classList.remove('hidden'); } catch(e){}
    renderProdukAdmin();
  } else {
    alert("Username atau password salah!");
  }
};

// File upload
newGambarFile.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    uploadedImage = ev.target.result;
    previewGambar.src = uploadedImage;
    previewGambar.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
};

// Add / Update produk (Firebase)
addProduk.onclick = async () => {
  const stokVal = parseInt(newStok.value, 10);
  const obj = {
    nama: newNama.value.trim(),
    jenis: newJenis.value.trim(),
    asal: newAsal.value.trim(),
    harga: newHarga.value.trim(),
    stok: isNaN(stokVal) ? 0 : stokVal,
    aroma: newAroma.value.trim(),
    rasa: newRasa.value.trim(),
    keasaman: newKeasaman.value.trim(),
    body: newBody.value.trim(),
    grade: newGrade.value.trim(),
    kadarAir: newKadarAir.value.trim(),
    defect: newDefect.value.trim(),
    screen: newScreen.value.trim(),
    kategori: newKategori.value,
    deskripsi: newDeskripsi.value.trim(),
    gambar: uploadedImage || '',
    updatedAt: Date.now()
  };
  if (!obj.nama || !obj.asal || !obj.jenis || !obj.harga || !obj.deskripsi) {
    return alert("Lengkapi field wajib: Nama, Asal, Jenis, Harga, Deskripsi.");
  }

  try {
    if (!editId) {
      // create new
      await push(produkRef).then(r => set(r, Object.assign({}, obj, { createdAt: Date.now() })));
    } else {
      // update existing
      await update(ref(db, 'produk/' + editId), obj);
      editId = null;
      formTitle.textContent = "Tambah Produk Baru";
      addProduk.textContent = "Tambah Produk";
    }
    fillFormClear();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat menyimpan ke Firebase.");
  }
};

// Reset form
resetForm.onclick = fillFormClear;
function fillFormClear() {
  formTitle.textContent = "Tambah Produk Baru";
  addProduk.textContent = "Tambah Produk";
  editId = null;
  uploadedImage = "";
  previewGambar.classList.add('hidden');
  previewGambar.src = '';
  [newNama, newJenis, newAsal, newHarga, newStok, newAroma, newRasa, newKeasaman, newBody, newGrade, newKadarAir, newDefect, newScreen, newKategori, newDeskripsi].forEach(i => {
    if (i) i.value = '';
  });
  newGambarFile.value = '';
}

// Fill form from product
function fillFormFromProduct(p) {
  newNama.value = p.nama || '';
  newJenis.value = p.jenis || '';
  newAsal.value = p.asal || '';
  newHarga.value = p.harga || '';
  newStok.value = typeof p.stok !== 'undefined' ? p.stok : '';
  newAroma.value = p.aroma || '';
  newRasa.value = p.rasa || '';
  newKeasaman.value = p.keasaman || '';
  newBody.value = p.body || '';
  newGrade.value = p.grade || '';
  newKadarAir.value = p.kadarAir || '';
  newDefect.value = p.defect || '';
  newScreen.value = p.screen || '';
  newKategori.value = p.kategori || '';
  newDeskripsi.value = p.deskripsi || '';
  uploadedImage = p.gambar || '';
  if (uploadedImage) {
    previewGambar.src = uploadedImage;
    previewGambar.classList.remove('hidden');
  } else {
    previewGambar.classList.add('hidden');
  }
}

// Edit & Delete (global)
window.editProduk = (id) => {
  const p = produkData.find(x => x.id === id);
  if (!p) return alert("Produk tidak ditemukan.");
  editId = id;
  formTitle.textContent = "Edit Produk";
  addProduk.textContent = "Simpan Perubahan";
  fillFormFromProduct(p);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.hapusProduk = async (id) => {
  if (!confirm("Yakin ingin menghapus produk ini?")) return;
  try {
    await remove(ref(db, 'produk/' + id));
  } catch(e) {
    console.error(e);
    alert("Gagal menghapus produk.");
  }
};

// Export JSON / CSV
exportJsonBtn.onclick = () => {
  const arr = produkData.map(x => {
    const { id, ...rest } = x;
    return rest;
  });
  const blob = new Blob([JSON.stringify(arr, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data-produk-kopi.json';
  a.click();
  URL.revokeObjectURL(url);
};

function toCsv(arr) {
  if (!arr.length) return '';
  const keys = Object.keys(arr[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  };
  const header = keys.map(k => escape(k)).join(',');
  const rows = arr.map(obj => keys.map(k => escape(obj[k])).join(','));
  return [header].concat(rows).join('\n');
}

exportCsvBtn.onclick = () => {
  const arr = produkData.map(x => {
    const { id, ...rest } = x;
    return rest;
  });
  const csv = toCsv(arr);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data-produk-kopi.csv';
  a.click();
  URL.revokeObjectURL(url);
};

// Admin nav
homeBtn.onclick = () => {
  document.getElementById('mainNav').classList.remove('hidden');
  document.getElementById('home').classList.remove('hidden');
  document.getElementById('produk').classList.remove('hidden');
  document.getElementById('tentang').classList.remove('hidden');
  document.querySelector('footer').classList.remove('hidden');
  adminPanel.classList.add('hidden');
  localStorage.setItem("isAdminLogin", "true");
  renderProdukAdmin();
  renderProdukPublic();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

logoutAdminBtn.onclick = () => {
  alert("Anda telah keluar dari panel admin.");
  localStorage.removeItem("isAdminLogin");
  window.location.reload();
};

logoutBtn.onclick = () => {
  localStorage.removeItem("isAdminLogin");
  logoutBtn.classList.add('hidden');
  alert("Anda telah logout.");
  renderProdukPublic();
};

// Render Admin
function renderProdukAdmin() {
  adminProdukList.innerHTML = "";
  const q = searchAdmin.value || "";
  const jenis = filterJenisAdmin.value;
  const grade = filterGradeAdmin.value;
  const kategori = filterKategoriAdmin.value;
  const filtered = produkData.filter((p) => matchesFilter(p, q, jenis, grade, kategori));
  if (filtered.length === 0) {
    adminProdukList.innerHTML = `<p class="text-center col-span-3 text-stone-500">Tidak ada produk ditemukan.</p>`;
    return;
  }
  filtered.forEach((kopi) => {
    const index = produkData.indexOf(kopi);
    adminProdukList.innerHTML += `
      <div class="bg-white shadow rounded-xl p-4">
        <img src="${kopi.gambar || 'https://via.placeholder.com/600x400?text=No+Image'}" class="h-40 w-full object-cover rounded mb-3">
        <h3 class="font-semibold">${kopi.nama}</h3>
        <p class="text-sm text-stone-500">Asal: ${kopi.asal}</p>
        <p class="text-sm text-stone-500">Jenis: ${kopi.jenis}</p>
        <p class="text-sm text-stone-500">Grade: ${kopi.grade}</p>
        <p class="text-sm text-stone-500">Kategori: ${kopi.kategori}</p>
        <p class="text-sm text-stone-500">Harga: Rp${kopi.harga || '-'}</p>
        <p class="text-sm text-stone-500">Stok: ${typeof kopi.stok !== 'undefined' ? kopi.stok : 0}</p>
        <div class="flex justify-between mt-3">
          <button onclick="editProduk('${kopi.id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">✏️ Edit</button>
          <button onclick="hapusProduk('${kopi.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">🗑️ Hapus</button>
        </div>
      </div>`;
  });
}

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    if (!adminPanel.classList.contains('hidden')) {
      searchAdmin.focus();
    } else {
      searchPublic.focus();
    }
  }
});

// Helpers
function openAdminPanel() {
  document.getElementById('mainNav').classList.add('hidden');
  document.getElementById('home').classList.add('hidden');
  document.getElementById('produk').classList.add('hidden');
  document.getElementById('tentang').classList.add('hidden');
  document.querySelector('footer').classList.add('hidden');
  adminPanel.classList.remove('hidden');
  localStorage.setItem("isAdminLogin", "true");
  renderProdukAdmin();
}
window.openAdminPanel = openAdminPanel;

[searchAdmin, filterJenisAdmin, filterGradeAdmin, filterKategoriAdmin].forEach(el => {
  el && el.addEventListener('input', renderProdukAdmin);
});

navLinkHome.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
});
navLinkProduk.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
});
navLinkTentang.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('tentang').scrollIntoView({ behavior: 'smooth' });
});
btnLihatProduk.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
});

// Initialisation
(async () => {
  try {
    await seedIfEmpty();
  } catch(e){ console.warn('Seed error', e); }
  bindProdukRealtime();
  if (localStorage.getItem("isAdminLogin") === "true") {
    try { logoutBtn.classList.remove('hidden'); } catch(e){}
    renderProdukAdmin();
  }
})();

// Responsive Navbar Logic
if(mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close menu when clicking a link
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });
}
