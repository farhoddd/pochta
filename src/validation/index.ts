import { CaptureValidation } from "./CaptureValidation"
import { FaceSizeValidation } from  "./FaceSizeValidation"
import { DocSizeValidation } from  "./DocSizeValidation"
import { FaceLivenessValidation } from  "./FaceLivenessValidation"
import { FaceOnDocValidation } from  "./FaceOnDocValidation"
import { ValidationState } from  "./ValidationState"

export interface FrameValidation {
    validate(object: any): boolean;
}

export { ValidationState, CaptureValidation , FaceSizeValidation, FaceLivenessValidation, FaceOnDocValidation, DocSizeValidation }
