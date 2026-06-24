# Prediksi Topik Berita

# WARNING: Repo ini tidak memberikan model inference yang dibutuhkan untuk web ini. Harap meletakkan model inference dalam ./backend/model dengan format .safetensors.

Web app untuk memprediksi kategori/topik berita dari teks yang dimasukkan pengguna. Proyek ini terdiri dari:

- Backend FastAPI yang memuat model klasifikasi teks dari folder `backend/model`
- Frontend React + Vite untuk mengirim teks berita dan menampilkan hasil prediksi

## Struktur Proyek

```text
backend/
  app.py              # API FastAPI dan model inference
  requirements.txt    # Dependensi Python
  model/              # Model, tokenizer, dan file konfigurasi Hugging Face

frontend/
  package.json        # Dependensi dan script frontend
  vite.config.js      # Konfigurasi Vite, dev server di port 8080
  src/
    App.jsx           # UI utama
    api/client.js     # Client fetch ke backend
    components/
      TextareaForm.jsx
```

## Prasyarat

- Python 3.10 atau lebih baru
- Node.js 18 atau lebih baru
- npm

## Menjalankan Backend

Backend berada di folder `backend/` dan menggunakan FastAPI.

1. Masuk ke folder backend:

```bash
cd backend
```

2. Buat dan aktifkan virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

3. Install dependensi:

```bash
pip install -r requirements.txt
```

4. Jalankan server API:

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend akan tersedia di `http://localhost:8000`.

### Endpoint API

`POST /predict`

Contoh request body:

```json
{
  "text": "Isi teks berita di sini"
}
```

Contoh response:

```json
{
  "predictions": [
    {
      "label": "Politik",
      "score": 0.9321
    }
  ]
}
```

## Menjalankan Frontend

Frontend berada di folder `frontend/` dan memakai Vite + React.

1. Masuk ke folder frontend:

```bash
cd frontend
```

2. Install dependensi:

```bash
npm install
```

3. Jalankan development server:

```bash
npm run dev
```

Vite dikonfigurasi berjalan di `http://localhost:8080`.

## Alur Kerja Aplikasi

1. Pengguna mengetik atau menempel teks berita di form frontend.
2. Frontend mengirim teks ke backend melalui `POST http://localhost:8000/predict`.
3. Backend memproses teks menggunakan model di folder `backend/model`.
4. Hasil prediksi dikembalikan ke frontend dan ditampilkan sebagai daftar label beserta skor.

## Catatan Konfigurasi

- Backend mengizinkan CORS dari `http://localhost:8080`.
- Frontend secara langsung memanggil backend di `http://localhost:8000`.
- Folder `backend/model` harus tetap berada di lokasi yang sama karena dipakai langsung oleh `transformers.pipeline()`.

## CI/CD VPS

Push ke branch `main` akan menjalankan workflow GitHub Actions yang:

1. Build dan push image frontend/backend ke GHCR.
2. Mengirim `docker-compose.yml` ke `/opt/prediksi-berita/` di VPS.
3. Mengirim `nginx/nginx.conf` ke `/opt/prediksi-berita/nginx/` di VPS.
4. Menjalankan ulang stack Docker di VPS dengan config terbaru.

Pastikan secrets berikut sudah diatur di repository GitHub:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `GHCR_TOKEN`
- `GHCR_USER`

## Build Frontend

Untuk membuat build produksi frontend:

```bash
cd frontend
npm run build
```

Hasil build akan ditempatkan di folder `dist/` pada level root proyek.

## Troubleshooting

- Jika frontend gagal memanggil API, pastikan backend sudah berjalan di port `8000`.
- Jika Vite tidak bisa dibuka, pastikan port `8080` tidak sedang dipakai aplikasi lain.
- Jika model gagal dimuat, pastikan folder `backend/model` masih lengkap berisi file model dan tokenizer.
