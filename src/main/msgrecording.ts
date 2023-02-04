import {Storage} from '@google-cloud/storage';
import { projectId,
        keyFilename
} from '../config';
import Debug from 'debug';
const debug = Debug(process.argv[1].replace(/^.*[\\\/]/, ''));

export class MsgRecording {
    private strage: Storage;

    constructor() {
        this.strage = new Storage({
                                    projectId: projectId,
                                    keyFilename: keyFilename
                                });
    }

    public upload(fileName: string, binary: Buffer) {
        debug('data stored.')
        return this.strage.bucket('msg_recordings').file(fileName).save(binary);
    }
}