const API_BASE_URL = "https://bolo-ai-backend-cfft.onrender.com";

const $ = id => document.getElementById(id);

async function send() {
  const q = $("q");
  const t = q.value.trim();

  if (!t) return;

  const m = $("messages");
  m.innerHTML += `<div class="bubble user">${esc(t)}</div>`;
  q.value = "";

  try {
    const token = localStorage.getItem("bolo_token");

    if (!token) {
      m.innerHTML += `<div class="bubble ai">पहले Login करें।</div>`;
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ message: t })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    m.innerHTML += `<div class="bubble ai">${esc(data.reply || "कोई जवाब नहीं मिला।")}</div>`;
    m.scrollTop = m.scrollHeight;

  } catch (error) {
    m.innerHTML += `<div class="bubble ai">अभी जवाब नहीं मिल पाया। कृपया थोड़ी देर बाद कोशिश करें।</div>`;
    console.error(error);
  }
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

function showPlans() {
  document.querySelector("#plans")?.scrollIntoView({ behavior: "smooth" });
}

function openAdmin() {
  location.href = "admin.html";
}

function pay() {
  alert("Payment जल्द उपलब्ध होगा।");
}

function voiceInput() {
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    alert("इस browser में voice recognition उपलब्ध नहीं है।");
    return;
  }

  const R = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new R();

  r.lang = "hi-IN";
  r.onresult = e => {
    $("q").value = e.results[0][0].transcript;
    send();
  };

  r.start();
}
