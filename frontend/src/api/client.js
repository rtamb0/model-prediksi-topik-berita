const BASE_URL = "http://localhost:8000"; // FastAPI server

export async function predict(text) {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  const result = await response.json();
  return result.predictions;
}
