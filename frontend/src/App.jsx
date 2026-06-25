import { useState } from "react";
import TextareaForm from "./components/TextareaForm";
import { predict } from "./api/client";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state for better UX

  const handleSubmit = async (e, text) => {
    e.preventDefault(); 
    if (!text.trim()) return; // Prevents empty submissions

    setLoading(true);
    try {
      const response = await predict(text);
      setResult(response);
      console.log(response);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Removed justify-content-center from the outer div
    <div className="min-vh-100 bg-light d-flex flex-column align-items-center py-4 py-md-5">
      
      {/* 2. Added my-auto and w-100 here to safely center vertically */}
      <div className="container my-auto w-100">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            
            {/* Main Figma-like Card */}
            <div className="card border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: "1.5rem" }}>
              <div className="text-center mb-4">
                <h1 className="fw-bold text-dark mb-2">Deteksi Kategori Berita</h1>
                <p className="text-secondary">
                  Tempel teks berita, klik Prediksi, dan lihat hasilnya secara instan.
                </p>
              </div>

              <TextareaForm
                handleSubmit={handleSubmit}
                placeholder="Masukkan teks berita di sini..."
                loading={loading}
              />

              {/* Enhanced Results Section */}
              {result && (
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
                          {/* Bootstrap Progress Bar */}
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