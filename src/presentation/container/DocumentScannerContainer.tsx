import { DocumentScannerViewModel } from '../view-model/document-scanner/DocumentScannerViewModel';
import { DocumentScanner } from '../view/document-scanner/DocumentScanner';
import { CaptureImageUseCase } from '../../interactors/CaptureImageUseCase';
import { StartVideoUseCase } from '../../interactors/StartVideoUseCase';
import { DocDetectionUseCase } from '../../interactors/DocDetectionUseCase';
import { DetectSize } from '../../domains/DetectSize';
import { ImageHolder } from '../../domains/ImageHolder';
import { LoadDetectionModelsUseCase } from '../../interactors/LoadDetectionModelsUseCase';

const imageHolder = ImageHolder.getInstance();

const docDetectSize = new DetectSize({
    x: 240,
    y: 180,
    width: 800,
    height: 355,
    allowance: 120,
});

const loadDetectionModelsUseCase = LoadDetectionModelsUseCase.getInstance();

const docDetectionUseCase = new DocDetectionUseCase(docDetectSize, loadDetectionModelsUseCase);
const startVideoUseCase = new StartVideoUseCase(navigator);
const captureImageUseCase = new CaptureImageUseCase(document);
const documentScannerViewModel = new DocumentScannerViewModel(
    docDetectSize,
    captureImageUseCase,
    startVideoUseCase,
    docDetectionUseCase,
    imageHolder
);


export function DocumentScannerContainer({ next }: { next: () => void }): JSX.Element {
    return <DocumentScanner vm={documentScannerViewModel} next={next} />;
}
