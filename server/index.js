const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8082 });

wss.on("connection", (ws) => {
  console.log("New Client connected");

  ws.on("message", (message) => {
    console.log("Received message:", message);
    const queueNumber = generateQueueNumber();
    ws.send(JSON.stringify({ queueNumber }));
  });

  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});

function generateQueueNumber() {
  let counter = 1;
  return "A" + counter.toString().padStart(2, "0");
}
