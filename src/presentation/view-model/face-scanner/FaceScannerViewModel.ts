import { CapturedImage } from '../../../domains/CapturedImage';
import { StartVideoSettings, StartVideoUseCase } from '../../../interactors/StartVideoUseCase';
import { Nullable } from '../../../shared/typings';
import { IBaseViewModel, UpdateView } from '../BaseViewModel';
import { CaptureImageUseCase } from '../../../interactors/CaptureImageUseCase';
import { sleep } from '../../../shared';
import { LiveDetectionUseCase } from '../../../interactors/LiveDetectionUseCase';
import { message } from 'antd';
import { ImageHolder } from '../../../domains/ImageHolder';
import { CaptureValidation, FaceSizeValidation, FaceLivenessValidation, FrameValidation } from '../../../validation';
import { DetectionBox } from '../../../domains/DetectionBox';
import { videoParam } from '../../../shared';
import { DetectSize } from '../../../domains/DetectSize';

export class FaceScannerViewModel implements IBaseViewModel {
    private _videoElement: Nullable<HTMLVideoElement> = null;
    private _loading = false;
    private _streaming = false;
    private _errMessage = 'Сделайте фото';
    private _capturedImage: Nullable<CapturedImage> = null;

    private _updateView: Nullable<UpdateView> = null;

    constructor(
        private readonly _detectSize: DetectSize,
        private readonly _captureImageUseCase: CaptureImageUseCase,
        private readonly _startVideoUseCase: StartVideoUseCase,
        private readonly _faceDetectionUseCase: LiveDetectionUseCase,
        private readonly _imageHolder: ImageHolder,
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

    set errMessage(m: string) {
        this._errMessage = m;
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
            // this.errMessage = 'Поместите лицо в овал';
            message.info('Поместите лицо в овал и улыбнитесь');

            this.resetCapturedImage();

            await this._startVideoUseCase.execute(this.videoElement!, params);
            this.startFaceDetection();

        } catch (error) {
            console.error(error);
            this.loading = false;
            this.streaming = false;
            message.error('Ошибка: Не удалось запустить камеру');
            this.abortFaceDetection();
        }
    };

    private _validations: FrameValidation[] = Array.of<FrameValidation>(
        new FaceSizeValidation(this._detectSize),
        new FaceLivenessValidation(),
        new CaptureValidation()
    );

    startFaceDetection() {
        this._faceDetectionUseCase.execute(this.videoElement!, this._validations, (faceBox: DetectionBox) => {
            this.captureImage(faceBox);
            this.showFlashLight();
            this.showCapturedImage();
            this.stopVideo();
            this.errMessage = '';
            this.loading = false;
        });
    }
    stopVideo() {
        if (this.videoElement && this.videoElement.srcObject) {
            (this.videoElement.srcObject! as MediaStream).getTracks().forEach((track) => track.stop());
            this.videoElement.srcObject = null;
            this.streaming = false;
        }
    }

    abortFaceDetection = () => {
        this._faceDetectionUseCase.abort();
    };

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
        this.videoElement!.parentElement?.append(imgElem);
    }

    async showFlashLight() {
        const flashElement = document.createElement('div');
        flashElement.className = 'face__flash';
        this.videoElement!.parentElement?.append(flashElement);
        await sleep(500);
        this.videoElement!.parentElement?.removeChild(flashElement);
    }

    captureImage = (faceBox: DetectionBox) => {
        this._capturedImage = this._captureImageUseCase.execute(this.videoElement!, faceBox);
        this._imageHolder.faceImage = this._capturedImage;
        this.notifyViewAboutChanges();
    };

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
