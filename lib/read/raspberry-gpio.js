"use strict";

const fs = require('fs');

module.exports = async function (app) {
  let w1_data = {};

  // return all values of devices found
  // get files in path
  let files;
  try {
    files = await fs.readdirSync(app.config.w1.path);
  } catch (e) {
    throw e;
  }

  for (const f in files) {
    // the id is the name of the file
    const identifier = files[f].replace(".", "-");
    // 1-wire identifier must start by 28-
    if (identifier.indexOf('28-') >= 0) {
      const filename = `${app.config.w1.path}/${identifier}/w1_slave`;
      // get the time for debug pourposes
      let time = process.hrtime();

      // get the file content
      let content;
      try {
        content = await fs.readFileSync(filename, 'utf8');
      } catch (e) {
        throw e;
      }

      const test = content.match(/t=(\d*)/);
      if (test) {
        // this.logger.log('debug', filename, identifier, test[1])
        // fix first bat reads = 85000 (85ºC)
        // limit to 80ºC
        if (test[1] < 80000) {
          // setup state vars
          w1_data[identifier] = test[1] / 1000;
          // debug benchmark
          if (app.modules.env.logger.level === 'debug') {
            const diff = process.hrtime(time);
            const ms = Math.floor((diff[0] * 1e9 + diff[1]) / 1000000);
            app.modules.logger.log('debug', `${identifier} took ${ms} ms ${w1_data[identifier]}ºC`);
          }
        }
      } else {
        throw new Error(`failed to unpack temp from ${identifier}`);
      }

    }
  }

  return w1_data;

};
