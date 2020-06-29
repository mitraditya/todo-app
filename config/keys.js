//figure out which set of credentials to use
if (process.env.NODE_ENV === "production") {
    //app in production
    module.exports = require("./prod");
  } else {
    //app in development
    module.exports = require("./dev");
  }