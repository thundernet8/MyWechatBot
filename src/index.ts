const Application = require("./app");
const { WX_USERNAME } = require("./env");
const redPacketMiddleware = require("./middleware/redPacket");

const app = new Application(WX_USERNAME);

app.use(redPacketMiddleware());
// app.use(async function(msg, next) {
//     console.log(msg);
//     console.log(1);
//     next();
//     console.log(2);
// });
// app.use(async function(msg, next) {
//     console.log(msg + msg);
//     console.log(3);
//     await next();
//     console.log(4);
// });
app.run();
