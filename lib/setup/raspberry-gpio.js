"use strict";

module.exports = async function (app) {
  // setup boot params using the app core util for raspberry platform
  await app.modules.utils.raspberry.bootparam(app, [
    `dtoverlay=w1-gpio,gpiopin=${app.config.w1.gpio}`
  ]);
};
