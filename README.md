# 🎮 Sonic Bandung — Komunitas Fans Onic Esports Regional Bandung

Website komunitas **Sonic Bandung** dibangun dengan React + Vite + Tailwind CSS.

---

## 📁 Struktur Folder

```
sonic-bandung/
├── public/                        # Aset statis (favicon, gambar publik)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx         # Header hero utama
│   │   │   ├── Navbar.jsx         # Navigasi sticky
│   │   │   └── Footer.jsx         # Footer
│   │   └── sections/
│   │       ├── CountdownSection.jsx   # Timer hitung mundur
│   │       ├── MatchSchedule.jsx      # Jadwal pertandingan Onic
│   │       ├── WatchParty.jsx         # Info watch party
│   │       ├── Gallery.jsx            # Galeri foto kegiatan
│   │       ├── EventCalendar.jsx      # Kalender kegiatan
│   │       ├── VideoHighlights.jsx    # Video highlights
│   │       ├── SocialMedia.jsx        # Link sosial media
│   │       ├── MemberRegistration.jsx # Form daftar member
│   │       └── AdminPanel.jsx         # Panel admin (tambah event, upload foto)
│   ├── data/
│   │   └── mockData.js            # Semua data dummy (mudah diganti API)
│   ├── hooks/
│   │   └── useCountdown.js        # Custom hook countdown timer
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point React
│   └── index.css                  # Global styles + Tailwind + animasi
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Jalankan development server
```bash
npm run dev
```

### 3. Build untuk production
```bash
npm run build
```

---

## ✏️ Cara Kustomisasi

### Ganti data (jadwal, event, watch party)
Edit file `src/data/mockData.js` — semua data dummy ada di sini, mudah diganti dengan API call.

### Ganti target countdown
Di `src/data/mockData.js`, ubah nilai `COUNTDOWN_TARGET`:
```js
export const COUNTDOWN_TARGET = '2026-03-31T19:00:00'
```

### Tambah section baru
1. Buat file baru di `src/components/sections/NamaSection.jsx`
2. Import dan tambahkan di `src/App.jsx`

### Ganti warna tema
Warna utama ada di `tailwind.config.js` di bagian `colors.sonic`.

---

## 🛠️ Tech Stack

- **React 18** — UI library
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icon library
- **Google Fonts** — Rajdhani + Bebas Neue

---

## 📌 TODO (Next Steps)

- [ done] Integrasi backend / Supabase untuk simpan data member
- [ done] Auth admin panel (login sebelum akses admin)
- [ done] Upload foto ke cloud storage (Cloudinary / Supabase Storage)
- [ ongoing] Notifikasi WhatsApp/Telegram untuk member baru
- [ ongoing] Halaman detail watch party

---

*#SONICBANDUNG #ONICESPORTS #RACINGTOVICTORY* ⚡🏆
