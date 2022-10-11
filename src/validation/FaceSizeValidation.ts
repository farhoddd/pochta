import { FaceDetection } from 'face-api.js';
import { DetectionBox } from '../domains/DetectionBox';
import { DetectSize } from '../domains/DetectSize';
import { FrameValidation, ValidationState } from '.';

export class FaceSizeValidation implements FrameValidation {
    constructor(
        private readonly _detectSize: DetectSize,
        private readonly state: ValidationState = ValidationState.getInstance()
    ) { }

    validate({ detection }: { detection: FaceDetection }): boolean {
        const box = DetectionBox.fromBox(detection.box)
        const withinSize = this._detectSize.match(box)
        this.state.faceInSize = withinSize
        return withinSize
    }
}
