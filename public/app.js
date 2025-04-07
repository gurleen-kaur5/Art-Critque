
const imageInput = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const chatBox = document.getElementById("chatBox");

async function sendImageAndPrompt(prompt) {
  const file = imageInput.files[0];
  if (!file) return alert("Please upload an image first!");

  const formData = new FormData();
  formData.append("image", file);
  formData.append("prompt", prompt);

  const response = await fetch("http://localhost:3000/analyze", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  chatBox.innerHTML += `<p><strong>AI:</strong> ${data.reply}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (message === "") return;
  chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  input.value = "";

  sendImageAndPrompt(message);
}

imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imgTag = document.createElement("img");
    imgTag.src = e.target.result;
    imgTag.alt = "Uploaded Artwork";
    imgTag.style.maxWidth = "100%";
    imgTag.style.borderRadius = "10px";
    imgTag.style.margin = "10px 0";

    imagePreview.innerHTML = "";
    imagePreview.appendChild(imgTag);

    chatBox.innerHTML += "<p><strong>You uploaded an image.</strong></p>";
    chatBox.scrollTop = chatBox.scrollHeight;
  };
  reader.readAsDataURL(file);
});
function startChat() {
    document.getElementById("landing").style.display = "none";
    document.getElementById("chat").style.display = "block";
  }
  
  function goBack() {
    document.getElementById("chat").style.display = "none";
    document.getElementById("landing").style.display = "block";
  }
  

