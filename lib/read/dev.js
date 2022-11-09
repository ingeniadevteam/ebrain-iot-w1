"use strict";

module.exports = async function (app) {
  return await require('./raspberry-gpio')(app);
};
