import { Nullable } from '../../../shared/typings';
import { IBaseViewModel, UpdateView } from '../BaseViewModel';
import { CaptureImageUseCase } from '../../../interactors/CaptureImageUseCase';
import { StartVideoSettings, StartVideoUseCase } from '../../../interactors/StartVideoUseCase';
import { CapturedImage } from '../../../domains/CapturedImage';
import { sleep } from '../../../shared';
import { DocDetectionUseCase } from '../../../interactors/DocDetectionUseCase';
import { ImageHolder } from '../../../domains/ImageHolder';
import { FrameValidation, FaceOnDocValidation, DocSizeValidation } from '../../../validation';
import { DetectionBox } from '../../../domains/DetectionBox';
import { videoParam } from '../../../shared';
import { DetectSize } from '../../../domains/DetectSize';

export class DocumentScannerViewModel implements IBaseViewModel {
    private _videoElement: Nullable<HTMLVideoElement> = null;
    private _loading = false;
    private _errMessage = '';
    private _streaming = false;
    private _capturedImage: Nullable<CapturedImage> = null;

    private _updateView: Nullable<UpdateView> = null;

    constructor(
        private readonly _detectSize: DetectSize,
        private readonly _captureImageUseCase: CaptureImageUseCase,
        private readonly _startVideoUseCase: StartVideoUseCase,
        private readonly _docDetectionUseCase: DocDetectionUseCase,
        private readonly _imageHolder: ImageHolder
    ) { }

    get videoElement() {
        return this._videoElement;
    }

    set videoElement(elem: Nullable<HTMLVideoElement>) {
        this._videoElement = elem;
    }

    get loading() {
        return this._loading;
    }

    set loading(isLoading: boolean) {
        this._loading = isLoading;
        this.notifyViewAboutChanges();
    }

    get streaming() {
        return this._streaming;
    }

    set streaming(isStreaming: boolean) {
        this._streaming = isStreaming;
        this.notifyViewAboutChanges();
    }

    get errMessage() {
        return this._errMessage;
    }

    set errMessage(message: string) {
        this._errMessage = message;
        this.notifyViewAboutChanges();
    }

    get capturedImage() {
        return this._capturedImage;
    }

    startVideo = async () => {
        const params: StartVideoSettings = {
            video: {
                height: videoParam.height,
                width: videoParam.width,
                facingMode: 'user',
                noiseSuppression: true,
                frameRate: 30,
            },
            audio: false,
        };

        try {
            this.loading = true;
            this.streaming = true;
            this.errMessage = 'Отсканируйте или загрузите документ';

            this.resetCapturedImage();

            await this._startVideoUseCase.execute(this.videoElement!, params);
            this.startDocDetection();
        } catch (error) {
            console.error(error);
            this.loading = false;
            this.streaming = false;
            this.errMessage = 'Ошибка: Не удалось запустить камеру';
        }
    };

    private validations: FrameValidation[] = Array.of<FrameValidation>(
        new DocSizeValidation(this._detectSize),
        new FaceOnDocValidation()
    );

    startDocDetection() {
        this._docDetectionUseCase.execute(this.videoElement!, this.validations, (faceBox: DetectionBox) => {
            this.captureImage(faceBox); // TODO capture above , add outer box for cutting
            this.showFlashLight();
            this.showCapturedImage();
            this.stopStopVideo();
            this.errMessage = '';

            this.loading = false;
        });
    }

    captureImage = (faceBox: DetectionBox) => {
        this._capturedImage = this._captureImageUseCase.execute(this.videoElement!, faceBox);
        this._imageHolder.documentImage = this._capturedImage;
        this.notifyViewAboutChanges();
    };

    stopStopVideo() {
        if (this.videoElement && this.videoElement.srcObject) {
            (this.videoElement.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
            this.videoElement.srcObject = null;
            this.streaming = false;
        }
    }

    resetCapturedImage() {
        if (this._capturedImage) {
            this._capturedImage = null;
            const imgElement = this.videoElement?.parentElement?.querySelector('img');

            if (imgElement) {
                this.videoElement?.parentElement?.removeChild(imgElement);
            }
        }
    }

    showCapturedImage() {
        const imgElem = document.createElement('img');
        imgElem.src = this._capturedImage?.fullframe!;
        imgElem.width = this.videoElement!.offsetWidth;
        imgElem.height = this.videoElement!.offsetHeight;
        this.videoElement!.parentElement?.append(imgElem);
    }

    async showFlashLight() {
        const flashElement = document.createElement('div');
        flashElement.className = 'face__flash';
        this.videoElement!.parentElement?.append(flashElement);
        await sleep(500);
        this.videoElement!.parentElement?.removeChild(flashElement);
    }

    notifyViewAboutChanges() {
        if (typeof this._updateView === 'function') {
            this._updateView();
        }
    }

    attachView(fn: UpdateView) {
        this._updateView = fn;
    }

    detachView() {
        this._updateView = null;
    }
}
