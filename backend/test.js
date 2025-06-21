const http = require("http");

http
  .get("http://localhost:5000/", (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.setEncoding("utf8");
    res.on("data", console.log);
  })
  .on("error", console.error);
