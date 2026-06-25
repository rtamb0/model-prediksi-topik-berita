import { useState } from "react";

function TextareaForm({ handleSubmit, placeholder, loading }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, text)} className="w-100">
      <div className="form-group mb-4">
        <textarea
          className="form-control bg-light border-0 px-4 py-3 shadow-sm"
          style={{ borderRadius: "1rem", resize: "vertical" }}
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          rows={8}
          disabled={loading} // Disables text area while fetching
        />
      </div>
      <button 
        type="submit" 
        className="btn btn-primary w-100 py-3 fw-bold shadow-sm"
        style={{ borderRadius: "1rem", transition: "all 0.3s" }}
        disabled={loading || text.trim() === ""}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Menganalisis...
          </>
        ) : (
          "Prediksi Sekarang"
        )}
      </button>
    </form>
  );
}

export default TextareaForm;