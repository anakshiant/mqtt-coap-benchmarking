const mqtt = require("mqtt");
const cp = require("child_process");

const client = mqtt.connect('mqtt://broker.hivemq.com')

const child_forks = {};

client.on("connect", function () {
  for (let i = 0; i < 9; i++) {
    const fork = cp.fork("./mqtt-benchmark/reciever.js");
    fork.on("message", (message) => {
      if (message.connected) {
        const id = i;
        child_forks[fork.pid] = { startTime: Date.now(), endTime: undefined };
        client.publish(`presence`, String(id));
      }
      if (message.time) {
        child_forks[fork.pid].endTime = message.time;
        if (Object.values(child_forks).every((item) => item.endTime)) {
          printResult();
          process.exit(0);
        }
      }
    });
  }
});

function printResult() {
  console.log(
    "--------------------------------- MQTT results -------------------------------"
  );
  Object.values(child_forks).forEach((item, index) => {
    console.log(
      `latency for node ${index + 1} is ${item.endTime - item.startTime} ms`
    );
  });
}
