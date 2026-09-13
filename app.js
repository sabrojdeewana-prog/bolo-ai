
const API_BASE_URL = "https://bolo-ai-backend-cfft.onrender.com";

const $ = id => document.getElementById(id);


/* ==============================
   PAGE START / HOME POSITION
============================== */

window.history.scrollRestoration = "manual";

window.addEventListener("load", () => {

  if (window.location.hash === "#premium") {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  });

});


/* ==============================
   LOGIN CHECK
============================== */

function isLoggedIn() {
  return localStorage.getItem("boloLoggedIn") === "true";
}


function requireLogin() {

  if (isLoggedIn()) {
    return true;
  }

  alert("Please log in to use Bolo AI.");

  const loginModal = $("loginModal");

  if (loginModal) {
    loginModal.classList.add("show");
    loginModal.setAttribute("aria-hidden", "false");
  }

  return false;

}


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

    const inputSection =
      document.querySelector(".input-section");

    if (inputSection) {

      inputSection.parentNode.insertBefore(
        chatBox,
        inputSection.nextSibling
      );

    }

  }


  const message =
    document.createElement("div");

  message.style.cssText = `
    padding: 12px 16px;
    margin: 10px 0;
    border-radius: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    background: ${type === "user" ? "#e8f0fe" : "#f1f1f1"};
    color: #222;
  `;


  const label =
    document.createElement("strong");

  label.textContent =
    type === "user"
      ? "You:"
      : "Bolo AI:";


  const content =
    document.createElement("div");

  content.textContent = text;


  message.appendChild(label);
  message.appendChild(content);

  chatBox.appendChild(message);

  chatBox.scrollTop =
    chatBox.scrollHeight;

}


/* ==============================
   IMAGE MESSAGE
============================== */

function addImageMessage(imageData, prompt) {

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
      max-height: 700px;
      overflow-y: auto;
    `;

    const inputSection =
      document.querySelector(".input-section");

    if (inputSection) {

      inputSection.parentNode.insertBefore(
        chatBox,
        inputSection.nextSibling
      );

    }

  }


  const message =
    document.createElement("div");

  message.style.cssText = `
    padding: 14px;
    margin: 12px 0;
    border-radius: 16px;
    background: #f5f5f5;
    color: #222;
    box-sizing: border-box;
  `;


  const title =
    document.createElement("strong");

  title.textContent =
    "🎨 Bolo AI Image:";


  const description =
    document.createElement("div");

  description.textContent =
    prompt;

  description.style.cssText = `
    margin: 8px 0 12px;
    line-height: 1.5;
  `;


  const image =
    document.createElement("img");

  image.src =
    imageData;

  image.alt =
    prompt || "Generated image";

  image.style.cssText = `
    display: block;
    width: 100%;
    max-width: 700px;
    height: auto;
    margin: 0 auto;
    border-radius: 14px;
    box-shadow: 0 6px 25px rgba(0,0,0,0.15);
  `;


  const downloadBtn =
    document.createElement("button");

  downloadBtn.type =
    "button";

  downloadBtn.textContent =
    "⬇️ Download Image";

  downloadBtn.style.cssText = `
    display: block;
    margin: 14px auto 0;
    padding: 10px 18px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
  `;


  downloadBtn.addEventListener(
    "click",
    () => {

      const link =
        document.createElement("a");

      link.href =
        imageData;

      link.download =
        "bolo-ai-image.png";

      document.body.appendChild(link);

      link.click();

      link.remove();

    }
  );


  message.appendChild(title);
  message.appendChild(description);
  message.appendChild(image);
  message.appendChild(downloadBtn);

  chatBox.appendChild(message);

  chatBox.scrollTop =
    chatBox.scrollHeight;

}


/* ==============================
   SEND MESSAGE TO AI
============================== */

async function send() {

  if (!requireLogin()) {
    return;
  }


  const input =
    $("inputText");

  if (!input) {
    return;
  }


  const message =
    input.value.trim();

  if (!message) {
    return;
  }


  input.value = "";


  addChatMessage(
    message,
    "user"
  );


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/api/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: message
          })
        }
      );


    const data =
      await response.json();


    if (data.reply) {

      addChatMessage(
        data.reply,
        "ai"
      );

      speakText(
        data.reply
      );

    } else {

      addChatMessage(
        data.error ||
        "No response received.",
        "ai"
      );

    }


  } catch (error) {

    console.error(
      "Bolo AI Backend Error:",
      error
    );

    addChatMessage(
      "Could not connect to the Bolo AI backend.",
      "ai"
    );

  }

}


/* ==============================
   IMAGE GENERATION
============================== */

async function generateImage(prompt) {

  if (!requireLogin()) {
    return;
  }


  prompt =
    String(prompt || "").trim();


  if (!prompt) {

    addChatMessage(
      "🎨 Please enter a description for the image you want.",
      "ai"
    );

    return;

  }


  addChatMessage(
    "🎨 Image request: " + prompt,
    "user"
  );


  addChatMessage(
    "⏳ Bolo AI image बना रहा है... थोड़ा इंतज़ार करें.",
    "ai"
  );


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/api/generate-image`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            prompt: prompt
          })
        }
      );


    const data =
      await response.json();


    if (!response.ok || !data.ok) {

      console.error(
        "Image generation error:",
        data
      );

      addChatMessage(
        data.error ||
        "Image generate नहीं हो पाई.",
        "ai"
      );

      return;

    }


    if (!data.image) {

      addChatMessage(
        "Image server से image नहीं मिली.",
        "ai"
      );

      return;

    }


    addImageMessage(
      data.image,
      prompt
    );


  } catch (error) {

    console.error(
      "Image Generation Error:",
      error
    );

    addChatMessage(
      "🎨 Image AI से connection नहीं हो पाया.",
      "ai"
    );

  }

}


/* ==============================
   IMAGE GENERATOR UI
============================== */

function createImageGeneratorUI() {

  if ($("boloImageGenerator")) {
    return;
  }


  const inputSection =
    document.querySelector(".input-section");


  if (!inputSection) {
    return;
  }


  const wrapper =
    document.createElement("div");

  wrapper.id =
    "boloImageGenerator";


  wrapper.style.cssText = `
    width: 100%;
    max-width: 900px;
    margin: 18px auto;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 16px;
    background: #f7f7f7;
    border: 1px solid #e5e5e5;
  `;


  const title =
    document.createElement("div");

  title.textContent =
    "🎨 Bolo AI Image Generator";

  title.style.cssText = `
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
  `;


  const description =
    document.createElement("div");

  description.textContent =
    "अपनी image का description लिखें और Bolo AI से image बनवाएँ।";

  description.style.cssText = `
    font-size: 14px;
    margin-bottom: 12px;
    opacity: 0.8;
  `;


  const textarea =
    document.createElement("textarea");

  textarea.id =
    "boloImagePrompt";

  textarea.placeholder =
    "Example: A cinematic romantic Hindi song poster, young Indian singer in rain, beautiful woman in background, realistic photography...";

  textarea.rows =
    4;

  textarea.style.cssText = `
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #ccc;
    resize: vertical;
    font-family: inherit;
    font-size: 14px;
    margin-bottom: 10px;
  `;


  const button =
    document.createElement("button");

  button.type =
    "button";

  button.id =
    "boloGenerateImageBtn";

  button.textContent =
    "🎨 Generate Image";

  button.style.cssText = `
    width: 100%;
    padding: 12px 18px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
  `;


  button.addEventListener(
    "click",
    () => {

      const prompt =
        textarea.value.trim();


      if (!prompt) {

        alert(
          "पहले image का description लिखें."
        );

        textarea.focus();

        return;

      }


      generateImage(prompt);

    }
  );


  textarea.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" &&
        (event.ctrlKey || event.metaKey)
      ) {

        event.preventDefault();

        const prompt =
          textarea.value.trim();

        if (prompt) {
          generateImage(prompt);
        }

      }

    }
  );


  wrapper.appendChild(title);
  wrapper.appendChild(description);
  wrapper.appendChild(textarea);
  wrapper.appendChild(button);


  inputSection.parentNode.insertBefore(
    wrapper,
    inputSection.nextSibling
  );

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
      "Voice Command is not supported in your browser. Please use Chrome."
    );

    return null;

  }


  const recognizer =
    new SpeechRecognition();


  recognizer.lang =
    "hi-IN";

  recognizer.continuous =
    false;

  recognizer.interimResults =
    false;

  recognizer.maxAlternatives =
    1;


  recognizer.onstart =
    function () {

      isListening =
        true;


      const micBtn =
        $("micBtn");


      if (micBtn) {

        micBtn.innerHTML =
          "🔴";

        micBtn.title =
          "Listening...";

      }


      addChatMessage(
        "🎙️ Bolo AI is listening... Please speak.",
        "ai"
      );

    };


  recognizer.onresult =
    function (event) {

      const spokenText =
        event.results[0][0]
          .transcript
          .trim();


      const input =
        $("inputText");


      if (input) {

        input.value =
          spokenText;

      }


      if (spokenText) {

        send();

      }

    };


  recognizer.onerror =
    function (event) {

      console.error(
        "Voice recognition error:",
        event.error
      );


      if (
        event.error ===
        "not-allowed"
      ) {

        addChatMessage(
          "🎙️ Please allow microphone permission.",
          "ai"
        );

      } else {

        addChatMessage(
          "🎙️ I could not understand your voice. Please try again.",
          "ai"
        );

      }

    };


  recognizer.onend =
    function () {

      isListening =
        false;


      const micBtn =
        $("micBtn");


      if (micBtn) {

        micBtn.innerHTML = `
          <span class="mic-icon">🎙️</span>
        `;

        micBtn.title =
          "Microphone";

      }

    };


  return recognizer;

}


/* ==============================
   ACTIVATE MICROPHONE
============================== */

function activateMicrophone() {

  if (!requireLogin()) {
    return;
  }


  if (!recognition) {

    recognition =
      setupVoiceRecognition();

  }


  if (!recognition) {
    return;
  }


  if (isListening) {

    recognition.stop();

    return;

  }


  try {

    recognition.start();

  } catch (error) {

    console.error(
      "Microphone error:",
      error
    );

  }

}


/* ==============================
   AI TEXT TO SPEECH
============================== */

function speakText(text) {

  if (
    !("speechSynthesis" in window)
  ) {

    return;

  }


  window.speechSynthesis.cancel();


  const speech =
    new SpeechSynthesisUtterance(
      text
    );


  speech.lang =
    "hi-IN";

  speech.rate =
    1;

  speech.pitch =
    1;


  window.speechSynthesis.speak(
    speech
  );

}


/* ==============================
   QUICK ACTIONS
============================== */

function scrollToInput(text) {

  const input =
    $("inputText");


  if (!input) {
    return;
  }


  input.value =
    text;


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
    $("contactName")?.value.trim() ||
    "";


  const email =
    $("contactEmail")?.value.trim() ||
    "";


  const message =
    $("contactMessage")?.value.trim() ||
    "";


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

  const modal =
    $("thumbnailModal");


  if (modal) {

    modal.style.display =
      "flex";

  }

}


function closeThumbnailGenerator() {

  const modal =
    $("thumbnailModal");


  if (modal) {

    modal.style.display =
      "none";

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


  if (!canvas) {
    return;
  }


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
    "🎨 Thumbnail preview is ready.",
    "ai"
  );

}


function downloadThumbnail() {

  const canvas =
    $("thumbnailCanvas");


  if (!canvas) {
    return;
  }


  alert(
    "Thumbnail download feature is coming in the next upgrade."
  );

}


/* ==============================
   PREMIUM BUTTON
============================== */

function handlePremiumClick() {

  if (!requireLogin()) {
    return;
  }


  alert(
    "🌟 Bolo AI Premium\n\n" +
    "Plan: ₹149/month\n" +
    "🔥 50% OFF\n\n" +
    "Premium payment system is being prepared.\n" +
    "You will be able to purchase Premium soon."
  );

}


/* ==============================
   DOM READY
============================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {


    /* ==========================
       SEND BUTTON
    ========================== */

    const sendBtn =
      $("sendBtn");


    if (sendBtn) {

      sendBtn.addEventListener(
        "click",
        send
      );

    }


    /* ==========================
       ENTER KEY
    ========================== */

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


    /* ==========================
       MICROPHONE BUTTON
    ========================== */

    const micBtn =
      $("micBtn");


    if (micBtn) {

      micBtn.addEventListener(
        "click",
        activateMicrophone
      );

    }


    /* ==========================
       QUICK ACTION BUTTONS
    ========================== */

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


            let prompt =
              "";


            switch (action) {


              case "application":

                prompt =
                  "Write a professional application for me";

                break;


              case "whatsapp":

                prompt =
                  "Write a good WhatsApp message for me";

                break;


              case "translate":

                prompt =
                  "Translate this text: ";

                break;


              case "resume":

                prompt =
                  "Help me create a professional resume";

                break;


              case "youtube":

                prompt =
                  "Create a good title for my YouTube video";

                break;


              case "social":

                prompt =
                  "Create good social media content for Instagram and Facebook";

                break;


              case "thumbnail":

                openThumbnailGenerator();

                return;


              case "image":

                createImageGeneratorUI();

                const imagePrompt =
                  $("boloImagePrompt");

                if (imagePrompt) {

                  imagePrompt.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                  });

                  imagePrompt.focus();

                }

                return;

            }


            scrollToInput(
              prompt
            );

          }
        );

      }
    );


    /* ==========================
       VOICE TOOL BUTTON
    ========================== */

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


    /* ==========================
       CREATE IMAGE GENERATOR
       AUTOMATICALLY
    ========================== */

    createImageGeneratorUI();

  }
);
