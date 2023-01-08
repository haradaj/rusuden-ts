import Ari, { Channel } from 'ari-client';
import util = require('util');
import { url, username, password, appName, announceWav } from '../config';
import Debug from 'debug';
const debug = Debug(appName);

// TypeScript promises (async/await) version of the example published on project https://github.com/asterisk/node-ari-client.

export default async () => {
    try {
        const client = await Ari.connect(url, username, password);
        debug(`Connected to ${url}`);

        // Use once to start the application
        client.on('StasisStart', async (event, incoming) => {
            await incoming.answer();
            await play(incoming, announceWav);
            await incoming.hangup();
        });

        const play = (channel: Channel, sound: string) => {
            const playback = client.Playback();
            return new Promise((resolve, reject) => {
                playback.once('PlaybackFinished', (event, playback) => {
                    resolve(playback);
                });
                channel.play({ media: sound }, playback).catch(err => {
                    reject(err);
                });
            });
        };

        // can also use client.start(['app-name'...]) to start multiple applications
        client.start(appName);
    } catch (err) {
        debug(err);
    }
};