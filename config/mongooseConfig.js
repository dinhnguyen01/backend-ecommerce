// mongooseConfig.js
const mongoose = require("mongoose");
const moment = require("moment-timezone");

// Thiết lập múi giờ mặc định cho toàn bộ ứng dụng
moment.tz.setDefault("Asia/Ho_Chi_Minh");

module.exports = mongoose;
