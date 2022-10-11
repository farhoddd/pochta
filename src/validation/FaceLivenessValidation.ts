import { FaceDetection, FaceExpressions, FaceLandmarks68 } from 'face-api.js';
import { EyeBlink } from './EyeBlink';
import { FrameValidation, ValidationState } from '.';

export class FaceLivenessValidation implements FrameValidation {
    constructor(
        private readonly _threshold: number = 0.8,
        private readonly _exprThreshold: number = 0.8,
        private _success: boolean = false,
        private _leftBlinkCounter: number = 0,
        private _rightBlinkCounter: number = 0,
        private eyeBlinkFun: EyeBlink = new EyeBlink(),
        private readonly state: ValidationState = ValidationState.getInstance()
    ) { }

    validate({ detection, expressions, landmarks }: { detection: FaceDetection; expressions: FaceExpressions, landmarks: FaceLandmarks68 }): boolean {
        if (this.eyeBlinkFun.isblink(landmarks.getLeftEye())) {
            this._leftBlinkCounter += 1
        }
        if (this.eyeBlinkFun.isblink(landmarks.getRightEye())) {
            this._rightBlinkCounter += 1
        }

        const blinkValid = this._leftBlinkCounter > 0 && this._rightBlinkCounter > 0
        if (blinkValid) {
            this.state.blinking = true
        }

        const expressionsValid = expressions.happy > this._exprThreshold
        if (expressionsValid) {
            this.state.smiling = true
        }

        const faceValid = detection.score > this._threshold
        this.state.faceValid = faceValid

        if (this._success) {
            return this._success;
        } else {
            if (faceValid
                && expressionsValid
                && blinkValid) {
                this._success = true;
            }
            return false;
        }
    }
}
