const path = require("path");

// Init process.env
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

exports.WX_USERNAME = process.env.WX_USERNAME || "";

exports.RED_PACKET_API = "http://101.132.113.122:3007/hongbao";
