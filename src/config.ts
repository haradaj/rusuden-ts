import dotenv from 'dotenv';
dotenv.config(); // SET UP ENVIROMENTAL VARIABLES BEFORE IMPORTING MODULES.

// Set these variables in .env file.
export const url = <string>process.env.ARI_URL;
export const username = <string>process.env.ARI_USERNAME;
export const password = <string>process.env.ARI_PASSWORD;
export const appName = <string>process.env.ARI_APPNAME;
export const announceWav = <string>process.env.APP_ANNWAV;
export const waitTime = parseInt(<string>process.env.APP_WAITTIME);
export const projectid =<string>process.env.GCP_PROJECTID;
export const keyFilename = <string>process.env.GCP_KEYFILENAME;

export default {
    url,
    username,
    password,
    appName,
    announceWav,
    waitTime,
    projectid,
    keyFilename
};