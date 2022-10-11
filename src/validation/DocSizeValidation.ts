import { DetectionBox } from '../domains/DetectionBox';
import { DetectSize } from '../domains/DetectSize';
import { DocDetection } from '../interactors/DocDetectionUseCase';
import { FrameValidation, ValidationState } from '.';

export class DocSizeValidation implements FrameValidation {
    constructor(
        private readonly _detectSize: DetectSize,
        private readonly state: ValidationState = ValidationState.getInstance()
    ) { }

    validate(detection: DocDetection): boolean {
        const box = DetectionBox.fromNumber(detection.docDetection.box)
        const withinSize = this._detectSize.match(box)
        this.state.docInSize = withinSize
        return withinSize
    }
}
