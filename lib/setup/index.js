"use strict";

module.exports = async function (app) {
  // setup w1 module
  try {
    await require(`./pigeon`)(app);
  } catch (e) {
    throw e;
  }

  // return a true value
  return true;
};
