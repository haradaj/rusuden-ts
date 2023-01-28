import Ari, { Channel } from 'ari-client';
import { url,
    username,
    password,
    appName,
    announceWav,
    waitTime
} from '../config';
import Debug from 'debug';
const debug = Debug(appName);
import { IncomingCall } from './incomingcall';
import { MsgRecording } from './msgrecording';

// TypeScript promises (async/await) version of the example published on project https://github.com/asterisk/node-ari-client.

export default async () => {
    try {
        const client = await Ari.connect(url, username, password);
        debug(`Connected to ${url}`);
        var incomingCall: IncomingCall;

        // Stasis start when a call is incoming
        client.on('StasisStart', async (event, incoming) => {
            await new Promise(resolve => setTimeout(resolve, waitTime)) // wait configured sec
            await incoming.answer()
                .then(async () => saveIncoming(incoming))
                .then(async () => play(incoming, announceWav))
                .then(async () => recordingMsg(incoming))
                .finally(async () => incoming.hangup())
                .catch((err) => debug('session ended.'));
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

        const saveIncoming = (channel: Channel) => {
            incomingCall = new IncomingCall(
                                        channel.id,
                                        channel.caller.number,
                                        channel.caller.name,
                                        channel.creationtime);
            return new Promise((resolve, reject) => {
                const res = incomingCall.callSave()
                .then(() => {
                    debug('incoming call saved.');
                    resolve(res);
                })
                .catch((err) => {
                    debug('incoming call save failed.');
                    reject(err);
                });
            });
        }

        const recordingMsg = (channel: Channel) => {
            return new Promise<void>(async (resolve, reject) => {
                debug('recordingMsg entered.');

                const messageOptions = {
                    name: channel.id,
                    format: 'wav',
                    beep: true,
                    ifExists: 'overwrite',
                    maxDurationSeconds: 300
                };
                const message = client.LiveRecording();
                
                // Record message
                await channel.record(messageOptions, message)
                .then((newRecording) => {
                    debug('message.once RecordingFinished newRecording:', newRecording);
    
                    var duration: number = 0;
                    if (newRecording.duration != null) {
                        duration = newRecording.duration;
                    };
    
                    incomingCall.recording = newRecording.name;
                    incomingCall.duration = duration;
                    incomingCall.recordingSave();
    
                    const msgRecording = new MsgRecording();
                    const StoredMessageOption = {
                        "recordingName": newRecording.name
                    };
    
                    client.recordings.getStoredFile(StoredMessageOption)
                    .then((binary) => {
                        msgRecording.upload(newRecording.name, binary);
                        resolve();
                    })
                    .catch((err) => {
                        debug('error in getStoredFile', err);
                        reject(err);
                    });                    
                })
                .catch((err) => {
                    debug('hungup befor recoding started.');
                    resolve();
                });
            });
        }

        // can also use client.start(['app-name'...]) to start multiple applications
        client.start(appName);
    } catch (err) {
        debug(err);
    }
}