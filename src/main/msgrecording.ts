import {Storage} from '@google-cloud/storage';
import { projectid,
        keyFilename
} from '../config';
import Debug from 'debug';
const debug = Debug('MsgRecording');

export class MsgRecording {
    private strage: Storage;

    constructor() {
        this.strage = new Storage({
                                    projectId: projectid,
                                    keyFilename: keyFilename
                                });
    }

    public upload(fileName: string, binary: Buffer) {
        debug('data stored.')
        return this.strage.bucket('msg_recordings').file(fileName).save(binary);
    }
}