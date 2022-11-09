"use strict";

const fs = require('fs');

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

module.exports = async function (app) {
  let w1_data = {};

  // return all values of devices found
  // get files in path
  let files;
  try {
    files = await fs.readdirSync('/mnt/1wire');
  } catch (e) {
    throw e;
  }
  // for some reason the pigeon duplicates the directory names
  // sometimes when reading them
  const uniques = files.filter(onlyUnique);

  const reqs = uniques.map(async f => {
    // for (const f in uniques) {
    // the id is the name of the file
    // const identifier = f.replace(new RegExp(".", "g"), "-");
    const identifier = f.toString().replace(".", "-");
    // 1-wire identifier must start by 28-
    if (identifier.indexOf('28-') >= 0) {
      const filename = `${'/mnt/1wire'}/${f}/temperature`;
      // get the time for debug pourposes
      let time = process.hrtime();

      // get the file content
      let content, value;
      try {
        content = await fs.readFileSync(filename, 'utf8');
        value = parseFloat(content);
      } catch (e) {
        throw e;
      }
      if (value) {
        // this.logger.log('debug', filename, identifier, test[1])
        // fix first bat reads = 85000 (85ºC)
        // limit to 80ºC
        if (content < 80) {
          // setup state vars
          w1_data[identifier] = value;
        }
        // debug benchmark
        const diff = process.hrtime(time);
        const ms = Math.floor((diff[0] * 1e9 + diff[1]) / 1000000);
        app.logger.debug(`${identifier} took ${ms} ms ${w1_data[identifier]}ºC`);
      } else {
        throw new Error(`failed to unpack temp from ${identifier}`);
      }
    }
    // }
  });

  await Promise.all(reqs);

  return w1_data;

};
