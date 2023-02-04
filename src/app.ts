import dotenv from 'dotenv';
dotenv.config(); // SET UP ENVIROMENTAL VARIABLES BEFORE IMPORTING MODULES.

import Debug from 'debug';
const debug = Debug('app.ts');

const main = async () => {
    try {
        const app = require('./main/main');
        debug(`Running main...`);
        await app.default();
    } catch (err) {
        debug(err);
    }
};

main();