import { ImageUploaderView } from "../view/image-uploader/ImageUploaderView";
import { ImageHolder } from '../../domains/ImageHolder';
import { ImageDetectionUseCase } from "../../interactors/ImageDetectionUseCase";
import { DetectSize } from "../../domains/DetectSize";
import { LoadDetectionModelsUseCase } from "../../interactors/LoadDetectionModelsUseCase";
import { CaptureImageUseCase } from "../../interactors/CaptureImageUseCase";
import { ImageUploadViewModal } from "../view-model/image-upload/ImageUploadViewModel";

const imageHolder = ImageHolder.getInstance();

const detectSize = new DetectSize({
    x: 160,
    y: 160,
    width: 320,
    height: 320,
    allowance: 50,
});

const faceDetectSize = new DetectSize({
    x: 90,
    y: 210,
    width: 140,
    height: 140,
    allowance: 40,
});

const _loadDetectionModelsUseCase = LoadDetectionModelsUseCase.getInstance();


const captureImageUseCase = new CaptureImageUseCase(document);
const imageDetectionUseCase = new ImageDetectionUseCase(faceDetectSize,detectSize,_loadDetectionModelsUseCase)
const imageUploadViewModal = new ImageUploadViewModal(imageDetectionUseCase,imageHolder,captureImageUseCase)

export function ImageUploadContainer({next}:any): JSX.Element {
    return <ImageUploaderView next={next} vm={imageUploadViewModal} />
} 