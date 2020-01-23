const app = require("./app");

let port = process.env.PORT;
if (port == null || port == "") {
  port = 9090;
}
server.listen(port, () => console.log(`Listening on ${PORT}...`));
