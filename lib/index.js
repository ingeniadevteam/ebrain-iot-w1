"use strict";

const W1 = function () { };

W1.prototype.init = async function (app) {
  // run setup
  try {
    this.setup = await require("./setup")(app);
  } catch (e) {
    throw e;
  }
};


W1.prototype.read = async function (app) {
  let temperatures;
  try {
    temperatures = await require(`./read/pigeon`)(app);
  } catch (e) {
    throw e;
  }
  return temperatures;
};


module.exports = W1;
