const API_BASE_URL = "https://bolo-ai-backend-cfft.onrender.com";

const $ = id => document.getElementById(id);

function addChatMessage(text, type) {
  let chatBox = $("chatBox");

  if (!chatBox) {
    chatBox = document.createElement("div");
    chatBox.id = "chatBox";

    chatBox.style.cssText = `
      width: 100%;
      max-width: 900px;
      margin: 20px auto;
      padding: 10px;
      box-sizing: border-box;
    `;

    const inputSection = document.querySelector(".input-section");

    if (inputSection) {
      inputSection.parentNode.insertBefore(
        chatBox,
        inputSection.nextSibling
      );
    }
  }

  const message = document.createElement("div");

  message.style.cssText = `
    padding: 12px 16px;
    margin: 10px 0;
    border-radius: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    background: ${type === "user" ? "#e8f0fe" : "#f1f1f1"};
    color: #222;
  `;

  message.innerHTML =
    `<strong>${type === "user" ? "आप" : "Bolo AI"}:</strong><br>` +
    document.createTextNode(text).textContent;

  chatBox.appendChild(message);

  message.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

async function send() {
  const input = $("inputText");

  if (!input) return;

  const message = input.value.trim();

  if (!message) return;

  input.value = "";

  addChatMessage(message, "user");

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message
      })
    });

    const data = await response.json();

    if (data.reply) {
      addChatMessage(data.reply, "ai");
    } else {
      addChatMessage(
        data.error || "कोई जवाब नहीं मिला।",
        "ai"
      );
    }

  } catch (error) {
    console.error(error);

    addChatMessage(
      "Bolo AI Backend से connection नहीं हो पाया।",
      "ai"
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = $("sendBtn");

  if (sendBtn) {
    sendBtn.addEventListener("click", send);
  }

  const input = $("inputText");

  if (input) {
    input.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        send();
      }
    });
  }
});
