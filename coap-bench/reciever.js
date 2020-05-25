const coap = require("coap");
const fs = require("fs");

const req = coap.request("coap://coap.me:5683");

req.on("response", function (res) {
  res.pipe(fs.createWriteStream("./a.txt"));
  res.on("end", function () {
    process.send({ time: Date.now() });
    process.exit(0);
  });
});

req.end();
