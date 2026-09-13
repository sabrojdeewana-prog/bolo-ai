const API_BASE_URL = "https://bolo-ai-backend-cfft.onrender.com";

const $ = id => document.getElementById(id);

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

async function send() {
  const q = $("inputText");
  if (!q) return;

  const t = q.value.trim();
  if (!t) return;



  q.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = $("sendBtn");

  if (sendBtn) {
    sendBtn.addEventListener("click", send);
  }
});
