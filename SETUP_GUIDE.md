# 🚀 Panduan Setup Supabase + Deploy ke cPanel
## Sonic Bandung — sonicbandung.id

---

## BAGIAN 1 — SETUP SUPABASE

### 1.1 Buat Akun & Project
1. Buka https://supabase.com → Sign Up (gratis)
2. Klik **New Project**
3. Isi:
   - **Name**: `sonic-bandung`
   - **Database Password**: buat password kuat (simpan!)
   - **Region**: Southeast Asia (Singapore)
4. Tunggu ~2 menit sampai project aktif

---

### 1.2 Buat Tabel Database

Buka **SQL Editor** di sidebar Supabase, lalu jalankan query berikut satu per satu:

#### Tabel: watch_parties
```sql
create table watch_parties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  location text not null,
  date date not null,
  time time not null,
  created_at timestamp with time zone default now()
);

-- Aktifkan Row Level Security
alter table watch_parties enable row level security;

-- Semua orang bisa baca, hanya user login yang bisa tambah/hapus
create policy "Public read" on watch_parties for select using (true);
create policy "Auth insert" on watch_parties for insert with check (auth.role() = 'authenticated');
create policy "Auth delete" on watch_parties for delete using (auth.role() = 'authenticated');
```

#### Tabel: events
```sql
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  desc text not null,
  date date not null,
  day int not null,
  month text not null,
  created_at timestamp with time zone default now()
);

alter table events enable row level security;

create policy "Public read" on events for select using (true);
create policy "Auth insert" on events for insert with check (auth.role() = 'authenticated');
create policy "Auth delete" on events for delete using (auth.role() = 'authenticated');
```

#### Tabel: gallery
```sql
create table gallery (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  caption text,
  file_path text not null,
  created_at timestamp with time zone default now()
);

alter table gallery enable row level security;

create policy "Public read" on gallery for select using (true);
create policy "Auth insert" on gallery for insert with check (auth.role() = 'authenticated');
create policy "Auth delete" on gallery for delete using (auth.role() = 'authenticated');
```

#### Tabel: members (untuk form registrasi)
```sql
create table members (
  id uuid default gen_random_uuid() primary key,
  nama_lengkap text not null,
  instagram text,
  whatsapp text not null,
  area text not null,
  created_at timestamp with time zone default now()
);

alter table members enable row level security;

-- Member bisa daftar tanpa login, tapi hanya admin yang bisa baca
create policy "Public insert" on members for insert with check (true);
create policy "Auth read" on members for select using (auth.role() = 'authenticated');
```

---

### 1.3 Buat Storage Bucket untuk Foto

1. Di sidebar Supabase → **Storage** → **New Bucket**
2. Nama: `gallery`
3. ✅ Centang **Public bucket**
4. Klik **Create bucket**

Kemudian atur policy storage via SQL Editor:
```sql
-- Allow authenticated users to upload
create policy "Auth upload" on storage.objects
  for insert with check (
    bucket_id = 'gallery' and auth.role() = 'authenticated'
  );

-- Allow public to view
create policy "Public view" on storage.objects
  for select using (bucket_id = 'gallery');

-- Allow authenticated to delete
create policy "Auth delete" on storage.objects
  for delete using (
    bucket_id = 'gallery' and auth.role() = 'authenticated'
  );
```

---

### 1.4 Buat Akun Admin

1. Di sidebar → **Authentication** → **Users** → **Add User**
2. Isi email dan password untuk admin kamu
3. Klik **Create User**

> ⚠️ **Penting**: Jangan aktifkan "Confirm email" dulu di Settings → Auth → Email
> supaya bisa langsung login tanpa verifikasi.

---

### 1.5 Ambil API Keys

1. Di sidebar → **Settings** → **API**
2. Copy:
   - **Project URL** → `https://xxxxxxxx.supabase.co`
   - **anon public** key (bukan service_role!)

---

## BAGIAN 2 — SETUP PROJECT LOKAL

### 2.1 Install Supabase package
```bash
npm install @supabase/supabase-js
```

### 2.2 Buat file .env
Buat file `.env` di root project (sejajar package.json):
```
VITE_SUPABASE_URL=https://XXXXXXXXXXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

> ⚠️ File `.env` jangan di-commit ke git! Sudah aman karena ada di .gitignore.

### 2.3 Test di lokal
```bash
npm run dev
```

Coba scroll ke bagian Admin → seharusnya muncul form login.
Login dengan akun admin yang sudah dibuat di Supabase.

---

## BAGIAN 3 — BUILD & DEPLOY KE CPANEL

### 3.1 Build project
```bash
npm run build
```

Ini akan menghasilkan folder `dist/` berisi file statis (HTML, CSS, JS).

### 3.2 Upload ke cPanel

**Cara 1 — Via File Manager (recommended):**
1. Buka cPanel → **File Manager**
2. Masuk ke folder `public_html`
3. Hapus semua isi `public_html` (backup dulu kalau ada)
4. Upload semua isi folder `dist/` ke `public_html`
   - `index.html`
   - `assets/` folder
   - Semua file lainnya

**Cara 2 — Via FTP (FileZilla):**
1. Buka FileZilla
2. Connect ke hosting dengan kredensial FTP dari cPanel
3. Drag & drop isi folder `dist/` ke `public_html/`

### 3.3 Fix routing React (WAJIB!)

Karena ini React SPA, kalau user refresh halaman atau akses URL langsung, akan 404.
Buat file `.htaccess` di `public_html/`:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QR,L]
```

**Cara buat di cPanel:**
1. File Manager → `public_html`
2. Klik **+ File** → nama file `.htaccess`
3. Klik kanan → **Edit** → paste kode di atas → **Save**

---

## BAGIAN 4 — SETELAH DEPLOY

### Checklist final:
- [ ] Buka domain kamu → website muncul
- [ ] Scroll ke Admin Panel → muncul form login
- [ ] Login dengan akun admin
- [ ] Test tambah watch party → cek di Supabase table
- [ ] Test upload foto → cek di Supabase Storage
- [ ] Coba logout → tombol logout berfungsi
- [ ] Refresh halaman → tetap login (session tersimpan)

### Kalau ada error CORS di Supabase:
1. Supabase → Settings → API
2. Scroll ke **Allowed Origins**
3. Tambah: `https://sonicbandung.id` dan `https://www.sonicbandung.id`

---

## RINGKASAN STRUKTUR FILE BARU

```
src/
├── context/
│   └── AuthContext.jsx    ← State login global
├── lib/
│   └── supabase.js        ← Koneksi Supabase
├── components/
│   └── sections/
│       ├── AdminLogin.jsx  ← Halaman login admin
│       └── AdminPanel.jsx  ← Panel admin (sudah terintegrasi Supabase)
├── App.jsx                 ← Dibungkus AuthProvider
.env                        ← API keys (JANGAN diupload ke git)
.env.example               ← Template .env (aman di-commit)
```

---

*#SONICBANDUNG ⚡ Racing to Victory*
