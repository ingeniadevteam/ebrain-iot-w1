"use strict";

const { readFileSync } = require ( 'fs' );
const loadJsonFile = require('load-json-file');
const W1 = require('./lib');


module.exports = async (app) => {
    if (!app.w1.module) {
        // init the w1 module
        try {
            // load config
            const configFile = readFileSync(`${app.configDir}/w1.json`).toString();
            app.w1.config = JSON.parse(configFile);            
            // load and init the w1 module
            app.w1.module = new W1();
            await app.w1.module.init(app);
        } catch (error) {
            app.logger.error(`W1 ${error.message}`);
        }
    }
    
    if (process.env.NODE_ENV === 'development') {
        try {
            const devData = await loadJsonFile(`devdata/w1.json`);
            if (devData) app.w1.data = devData;
        } catch (error) {
            app.logger.error(`w1 devdata: ${error.message}`);
        }

        const devData = await loadJsonFile(`devdata/w1.json`);
        if (devData) app.w1.data = devData;
    } else {
        app.w1.data = {};
        const data = await app.w1.module.read(app);
        for (const id of Object.keys(data)) {
            if (app.w1.config.hasOwnProperty(id)) {
                app.w1.data[app.w1.config[id]] = data[id];
            }
        }
    }
};