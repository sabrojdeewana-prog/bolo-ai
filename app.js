const API_BASE_URL = "https://bolo-ai-backend-cfft.onrender.com";

const $ = id => document.getElementById(id);

/* ==============================
   CHAT MESSAGE
============================== */

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
      max-height: 500px;
      overflow-y: auto;
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

  const label = document.createElement("strong");
  label.textContent = type === "user" ? "आप:" : "Bolo AI:";

  const content = document.createElement("div");
  content.textContent = text;

  message.appendChild(label);
  message.appendChild(content);

  chatBox.appendChild(message);

  chatBox.scrollTop = chatBox.scrollHeight;
}


/* ==============================
   SEND MESSAGE TO AI
============================== */

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

      /* AI का जवाब आवाज़ में भी बोले */
      speakText(data.reply);

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


/* ==============================
   VOICE COMMAND
============================== */

let recognition = null;
let isListening = false;

function setupVoiceRecognition() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    alert(
      "आपके browser में Voice Command support नहीं है। Chrome browser इस्तेमाल करें।"
    );

    return null;
  }

  const recognizer = new SpeechRecognition();

  recognizer.lang = "hi-IN";

  recognizer.continuous = false;

  recognizer.interimResults = false;

  recognizer.maxAlternatives = 1;


  recognizer.onstart = function () {

    isListening = true;

    const micBtn = $("micBtn");

    if (micBtn) {

      micBtn.innerHTML = "🔴";

      micBtn.title = "सुन रहा हूँ...";
    }

    addChatMessage(
      "🎙️ Bolo AI सुन रहा है... बोलिए।",
      "ai"
    );
  };


  recognizer.onresult = function (event) {

    const spokenText =
      event.results[0][0].transcript.trim();

    const input = $("inputText");

    if (input) {

      input.value = spokenText;
    }

    if (spokenText) {

      send();
    }
  };


  recognizer.onerror = function (event) {

    console.error(
      "Voice recognition error:",
      event.error
    );

    if (event.error === "not-allowed") {

      addChatMessage(
        "🎙️ Microphone permission allow करें।",
        "ai"
      );

    } else {

      addChatMessage(
        "🎙️ आवाज़ समझ नहीं आई। फिर से बोलिए।",
        "ai"
      );
    }
  };


  recognizer.onend = function () {

    isListening = false;

    const micBtn = $("micBtn");

    if (micBtn) {

      micBtn.innerHTML = `
        <span class="mic-icon">🎙️</span>
      `;

      micBtn.title = "माइक्रोफोन";
    }
  };


  return recognizer;
}


/* ==============================
   ACTIVATE MICROPHONE
============================== */

function activateMicrophone() {

  if (!recognition) {

    recognition = setupVoiceRecognition();
  }

  if (!recognition) return;


  if (isListening) {

    recognition.stop();

    return;
  }


  try {

    recognition.start();

  } catch (error) {

    console.error(error);
  }
}


/* ==============================
   AI TEXT TO SPEECH
============================== */

function speakText(text) {

  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "hi-IN";

  speech.rate = 1;

  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}


/* ==============================
   QUICK ACTIONS
============================== */

function scrollToInput(text) {

  const input = $("inputText");

  if (!input) return;

  input.value = text;

  input.focus();

  input.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


/* ==============================
   CONTACT FORM
============================== */

function handleContactForm(event) {

  event.preventDefault();

  const name =
    $("contactName")?.value.trim() || "";

  const email =
    $("contactEmail")?.value.trim() || "";

  const message =
    $("contactMessage")?.value.trim() || "";

  const subject =
    encodeURIComponent(
      "Bolo AI Contact - " + name
    );

  const body =
    encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

  window.location.href =
    `mailto:Sabrojalam8454@gmail.com?subject=${subject}&body=${body}`;
}


/* ==============================
   THUMBNAIL GENERATOR
============================== */

function openThumbnailGenerator() {

  const modal = $("thumbnailModal");

  if (modal) {

    modal.style.display = "flex";
  }
}


function closeThumbnailGenerator() {

  const modal = $("thumbnailModal");

  if (modal) {

    modal.style.display = "none";
  }
}


function generateThumbnail() {

  const title =
    $("videoTitle")?.value.trim() ||
    "Video Title";

  const channel =
    $("channelName")?.value.trim() ||
    "Channel Name";

  const text =
    $("thumbnailText")?.value.trim() ||
    title;

  const background =
    $("backgroundColor")?.value ||
    "#333333";

  const canvas =
    $("thumbnailCanvas");

  if (!canvas) return;

  canvas.style.background =
    background;

  const mainText =
    canvas.querySelector(
      ".thumbnail-main-text"
    );

  const subText =
    canvas.querySelector(
      ".thumbnail-sub-text"
    );

  if (mainText) {

    mainText.textContent =
      text;
  }

  if (subText) {

    subText.textContent =
      channel;
  }

  addChatMessage(
    "🎨 Thumbnail preview तैयार है।",
    "ai"
  );
}


function downloadThumbnail() {

  const canvas =
    $("thumbnailCanvas");

  if (!canvas) return;

  alert(
    "Thumbnail download feature अगला upgrade है।"
  );
}


/* ==============================
   DOM READY
============================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* Send Button */

    const sendBtn =
      $("sendBtn");

    if (sendBtn) {

      sendBtn.addEventListener(
        "click",
        send
      );
    }


    /* Enter Key */

    const input =
      $("inputText");

    if (input) {

      input.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter" &&
            !event.shiftKey
          ) {

            event.preventDefault();

            send();
          }

        }
      );
    }


    /* Microphone Button */

    const micBtn =
      $("micBtn");

    if (micBtn) {

      micBtn.addEventListener(
        "click",
        activateMicrophone
      );
    }


    /* Quick Action Buttons */

    const quickButtons =
      document.querySelectorAll(
        ".quick-btn"
      );

    quickButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const action =
              button.dataset.action;

            let prompt = "";

            switch (action) {

              case "application":
                prompt =
                  "मेरे लिए एक professional application लिखो";
                break;

              case "whatsapp":
                prompt =
                  "मेरे लिए एक अच्छा WhatsApp message लिखो";
                break;

              case "translate":
                prompt =
                  "इस text को translate करो: ";
                break;

              case "resume":
                prompt =
                  "मेरे लिए एक professional resume बनाने में मदद करो";
                break;

              case "youtube":
                prompt =
                  "मेरे YouTube video के लिए एक अच्छा title बनाओ";
                break;

              case "social":
                prompt =
                  "मेरे लिए Instagram और Facebook के लिए अच्छा social media content बनाओ";
                break;

              case "thumbnail":
                openThumbnailGenerator();
                return;
            }

            scrollToInput(prompt);
          }
        );
      });


    /* Voice Tool Button */

    const voiceToolBtn =
      $("voiceToolBtn");

    if (voiceToolBtn) {

      voiceToolBtn.addEventListener(
        "click",
        () => {

          activateMicrophone();

          const input =
            $("inputText");

          if (input) {

            input.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }

        }
      );
    }

  }
);
