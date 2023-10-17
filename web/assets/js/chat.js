const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const webSocket = new WebSocket("ws://127.0.0.1:8181/chat"); // Ganti dengan URL WebSocket server Anda

// Fungsi untuk menambahkan pesan ke kotak obrolan
function addMessage(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = sender + ": " + message;
  chatBox.appendChild(messageDiv);
}

// Fungsi untuk mengirim pesan melalui WebSocket
function sendMessage() {
  const message = messageInput.value;
  const name = document.getElementById("name").innerText;
  if (message) {
    webSocket.send(
      JSON.stringify({
        name: name,
        message: message,
      })
    );
    messageInput.value = "";
  }
}

// Event listener untuk menerima pesan dari WebSocket server
webSocket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  addMessage(data.message, data.name);
});

// Event listener untuk menangani koneksi ke server
webSocket.addEventListener("open", (event) => {
  addMessage("Connected to server", "Server");
});

// Event listener untuk menangani kesalahan
webSocket.addEventListener("error", (event) => {
  addMessage("Connection error", "Server");
});

// Event listener untuk menangani penutupan koneksi
webSocket.addEventListener("close", (event) => {
  addMessage("Connection closed", "Server");
});
