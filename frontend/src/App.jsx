import { useState } from "react";
import TextareaForm from "./components/TextareaForm";
import { predict } from "./api/client";

function App() {
  const [result, setResult] = useState(null);
  const handleSubmit = async (e, text) => {
    e.preventDefault(); // stops page reload

    try {
      const response = await predict(text);
      setResult(response);
      console.log(response);
    } catch (err) {
      console.error("API error:", err);
    }
  };
  return (
    <>
      <section className="d-flex flex-column align-items-center justify-content-center">
        <div>
          <h1 className="text-center">Deteksi Kategori Berita</h1>
          <p className="text-center">
            Tempel teks berita, klik Prediksi, dan lihat hasilnya secara instan.
          </p>
        </div>
        <TextareaForm
          handleSubmit={handleSubmit}
          placeholder="Masukkan teks berita di sini..."
        />
        {result && (
          <div className="mt-4">
            <h2>Hasil Prediksi:</h2>
            <ul>
              {result.map((data) => (
                <li key={data.label}>
                  <strong>{data.label}:</strong> {(data.score * 100).toFixed(2)}
                  %
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}

export default App;
