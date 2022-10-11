import { DocDetection } from '../interactors/DocDetectionUseCase';
import { FrameValidation, ValidationState } from '.';

export class FaceOnDocValidation implements FrameValidation {
    constructor(
        private readonly _faceThreshold: number = 0.8,
        private readonly _docThreshold: number = 0.8,
        private readonly _gerbThreshold: number = 0.8,
        private readonly state: ValidationState = ValidationState.getInstance()
    ) { }

    validate(detection: DocDetection): boolean {
        const valid = detection.docDetection.score > this._docThreshold
            && detection.faceDetection.score > this._faceThreshold
            && detection.gerbDetection.score > this._gerbThreshold
        this.state.docValid = valid
        return valid;
    }
}
