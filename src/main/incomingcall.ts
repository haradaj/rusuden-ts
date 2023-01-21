import { Firestore } from '@google-cloud/firestore';
import { projectid,
         keyFilename
} from '../config';
import Debug from 'debug';
const debug = Debug('incomingCall');

export class IncomingCall {
    private   db:           Firestore;
    protected _uniqueId:     string;
    protected _callerId:     string;
    protected _callerIdName: string;
    protected _datetime:     Date;
    protected _duration:     number | undefined;
    protected _recording:    string | undefined;
    
    constructor(uniqueId: string, callerId: string, callerIdName: string, datetime: Date) {
        this._uniqueId = uniqueId;
        this._callerId = callerId;
        this._callerIdName = callerIdName;
        this._datetime = datetime;
        this.db = new Firestore({
                        projectId: projectid,
                        keyFilename: keyFilename
                       });
    }

    
    public get uniqueId() : string {
        return this._uniqueId;
    }
    
    public set duration(duration: number) {
        this._duration = duration;
    }

    public set recording(recording: string) {
        this._recording = recording;
    }

    public callSave() {
        const docRef = this.db.collection('/incoming').doc(this._uniqueId);
        return docRef.set({
                        "uniqueId": this._uniqueId,
                        "callerId": this._callerId,
                        "callerIdName": this._callerIdName,
                        "datetime": this._datetime
                    })
                    .then(async() => {
                        debug('incomingCall entity created.');
                    });

    }

    public recordingSave() {
        const docRef = this.db.collection('/incoming').doc(this._uniqueId);
        return docRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        docRef.update({
                            recording: this._recording,
                            duration: this._duration
                        });
                    }
                })
                .catch((err) => {
                    debug('recording save error.', err);
                });
    }
}
