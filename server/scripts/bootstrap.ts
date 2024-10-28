if (process.env.NODE_ENV !== "test") {
  require("dotenv").config({
    silent: true,
  });
}

require("../storage/database");
require("../storage/redis");

export {};
