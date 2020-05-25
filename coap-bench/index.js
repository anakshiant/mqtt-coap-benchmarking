const cp = require("child_process");

const child_forks = {};

for (let i = 0; i < 10; i++) {
  const fork = cp.fork("./coap-bench/reciever.js");
  child_forks[fork.pid] = { startTime: Date.now(), endTime: undefined };
  fork.on("message", (message) => {
    if (message.time) {
      child_forks[fork.pid].endTime = message.time;
      fork.kill();
      if (Object.values(child_forks).every((item) => item.endTime)) {
        printResult();
        process.exit(0)
      }
    }
  });
}

function printResult() {
  console.log(
    "--------------------------------- COAP results -------------------------------"
  );
  Object.values(child_forks).forEach((item, index) => {
    console.log(
      `latency for node ${index + 1} is ${item.endTime - item.startTime} ms`
    );
  });
}
