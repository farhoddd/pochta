import { CaptureImageUseCase } from '../../interactors/CaptureImageUseCase';
import { StartVideoUseCase } from '../../interactors/StartVideoUseCase';
import { LiveDetectionUseCase } from '../../interactors/LiveDetectionUseCase';
import { DetectSize } from '../../domains/DetectSize';
import { FaceScannerViewModel } from '../view-model/face-scanner/FaceScannerViewModel';
import { FaceScanner } from '../view/face-scanner/FaceScanner';
import { ImageHolder } from '../../domains/ImageHolder';

// x: 660,
// y: 200,
// width: 620,
// height: 800,
// allowance: 50,
const imageHolder = ImageHolder.getInstance();
const detectSize = new DetectSize({
    x: 480,
    y: 190,
    width: 310,
    height: 380,
    allowance: 50,
});
// x: 850,
//     y: 400,
//     width: 220,
//     height: 300,
//     allowance: 50,

const faceDetectionUseCase = new LiveDetectionUseCase(detectSize);
const startVideoUseCase = new StartVideoUseCase(navigator);
const captureImageUseCase = new CaptureImageUseCase(document);
const faceScannerViewModel = new FaceScannerViewModel(
    detectSize,
    captureImageUseCase,
    startVideoUseCase,
    faceDetectionUseCase,
    imageHolder
);


export function FaceScannerContainer({ next }: { next: () => void }): JSX.Element {
    return <FaceScanner vm={faceScannerViewModel} next={next} />;
}
