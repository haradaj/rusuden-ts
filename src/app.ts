import dotenv from 'dotenv';
dotenv.config(); // SET UP ENVIROMENTAL VARIABLES BEFORE IMPORTING MODULES.

import Debug from 'debug';
const debug = Debug('app.ts');

import app from './main/main'; // import を使用

const main = async () => {
    try {
        debug(`Running main...`);
        await app();
    } catch (err) {
        debug(err);
    }
};

main();