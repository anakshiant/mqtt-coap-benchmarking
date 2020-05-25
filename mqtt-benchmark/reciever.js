const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://broker.hivemq.com");
let connected = false;

client.on("connect", function () {
  if (!connected) {
    process.send({ type: "ack", connected: true });
    client.subscribe("presence");
    connected = true;
  }
});

client.on("message", () => {
  process.send({ type: "time", time: Date.now(), id: process.pid });
  process.exit(0);
});
