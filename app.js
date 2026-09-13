const API_BASE_URL = "https://bolo-ai-backend-cfft.onrender.com";

const $ = id => document.getElementById(id);

async function send() {
  const input = $("inputText");
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  input.value = "";

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    alert(data.reply || data.error || "कोई जवाब नहीं मिला।");

  } catch (error) {
    alert("Bolo AI Backend से connection नहीं हो पाया।");
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = $("sendBtn");

  if (sendBtn) {
    sendBtn.addEventListener("click", send);
  }
});
