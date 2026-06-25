import { useState } from "react";
import TextareaForm from "./components/TextareaForm";
import { predict } from "./api/client";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state

  const handleSubmit = async (e, text) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);  // Reset errors on new submission
    setResult(null); // Reset results while fetching

    try {
      const response = await predict(text);
      setResult(response);
    } catch (err) {
      console.error("API error:", err);
      
      // Smart Error Handling: Extract the exact message from FastAPI
      let errorMessage = "Koneksi ke server gagal. Periksa jaringan Anda.";
      
      // If using Axios, errors are inside err.response
      if (err.response) {
        if (err.response.status === 422) {
          errorMessage = "Teks terlalu panjang atau format tidak sesuai batas maksimum.";
        } else if (err.response.data && err.response.data.detail) {
          // Extracts the custom detail strings we set in app.py
          errorMessage = typeof err.response.data.detail === 'string' 
            ? err.response.data.detail 
            : "Data yang dikirim tidak valid."; 
        } else {
          errorMessage = `Error Server (${err.response.status}). Coba lagi nanti.`;
        }
      } else if (err.message) {
        // Fallback for network errors (e.g., server is completely down)
        errorMessage = err.message === "Network Error" 
          ? "Tidak dapat terhubung ke server. Pastikan server aktif." 
          : err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column align-items-center py-4 py-md-5">
      <div className="container my-auto w-100">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            
            <div className="card border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: "1.5rem" }}>
              <div className="text-center mb-4">
                <h1 className="fw-bold text-dark mb-2">Deteksi Kategori Berita</h1>
                <p className="text-secondary">
                  Tempel teks berita, klik Prediksi, dan lihat hasilnya secara instan.
                </p>
              </div>

              {/* Bootstrap Error Alert */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4 p-3 border-0 shadow-sm" style={{ borderRadius: "1rem" }} role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                  <div>
                    <strong>Gagal: </strong> {error}
                  </div>
                </div>
              )}

              <TextareaForm
                handleSubmit={handleSubmit}
                placeholder="Masukkan teks berita di sini..."
                loading={loading}
              />

              {/* Enhanced Results Section */}
              {result && !error && (
                <div className="mt-5">
                  <h5 className="fw-bold border-bottom pb-3 mb-4 text-dark">Hasil Prediksi</h5>
                  <div className="d-flex flex-column gap-3">
                    {result.map((data) => {
                      const percentage = (data.score * 100).toFixed(2);
                      return (
                        <div key={data.label}>
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold text-capitalize text-secondary">
                              {data.label}
                            </span>
                            <span className="text-primary fw-bold">{percentage}%</span>
                          </div>
                          <div className="progress" style={{ height: "10px", borderRadius: "10px" }}>
                            <div
                              className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
                              role="progressbar"
                              style={{ width: `${percentage}%` }}
                              aria-valuenow={percentage}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;