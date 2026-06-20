import { useState } from "react";

function TextareaForm({ handleSubmit, placeholder }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, text)}>
      <textarea
        className="form-control"
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        rows={10}
      />
      <button type="submit" className="btn btn-primary mt-3">
        Prediksi
      </button>
    </form>
  );
}

export default TextareaForm;
