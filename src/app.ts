import dotenv from 'dotenv';
dotenv.config(); // SET UP ENVIROMENTAL VARIABLES BEFORE IMPORTING MODULES.

import Debug from 'debug';
const debug = Debug('rusuden-app');

const main = async () => {
    try {
        const filePath = './main/main';
        const app = require(filePath);
        debug(`Running ${filePath}...`);
        await app.default();
    } catch (err) {
        debug(err);
    }
};

main();