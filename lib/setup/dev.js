"use strict";

module.exports = async function (app) {
  app.modules.logger.log('debug', `${app.config.w1.type} w1 module setup ok`);
};
