import { Nullable } from '../../../shared/typings';
import { IBaseViewModel, UpdateView } from '../BaseViewModel';
import { ImageHolder } from '../../../domains/ImageHolder';
import { Base64Image, CapturedImage } from '../../../domains/CapturedImage';
import { ImageDetectionUseCase } from '../../../interactors/ImageDetectionUseCase';
import { CaptureImageUseCase } from '../../../interactors/CaptureImageUseCase';
import { DetectionBox } from '../../../domains/DetectionBox';
import { FrameValidation, FaceOnDocValidation } from '../../../validation';

export class ImageUploadViewModal implements IBaseViewModel {
    private _imageElement: Nullable<HTMLInputElement> = null;
    
    private _loading = false;
    private _errMessage = '';
    private _capturedImage: Nullable<CapturedImage> = null;

    private _updateView: Nullable<UpdateView> = null;

    get imageElement() {
        return this._imageElement;
    }

    set imageElement(elem: Nullable<HTMLInputElement>) {
        this._imageElement = elem;
    }

    get capturedImage() {
        return this._capturedImage;
    }

    get errMessage() {
        return this._errMessage;
    }

    set errMessage(message: string) {
        this._errMessage = message;
        this.notifyViewAboutChanges();
    }

    get loading() {
        return this._loading;
    }

    set loading(isLoading: boolean) {
        this._loading = isLoading;
        this.notifyViewAboutChanges();
    }

    get images(): [Base64Image, Base64Image, Base64Image, Base64Image] {
        return [
            this._imageHolder.documentImage.fullframe,
            this._imageHolder.documentImage.preview,
            this._imageHolder.faceImage.fullframe,
            this._imageHolder.faceImage.preview,
        ];
    }

    constructor(private readonly _imageDetectionUseCase: ImageDetectionUseCase, private readonly _imageHolder: ImageHolder, private readonly _captureImageUseCase: CaptureImageUseCase) {}
    
    private validations: FrameValidation[] = Array.of(new FaceOnDocValidation());

  

    imageUpload = async () => {
        this._imageDetectionUseCase.execute(this._imageElement!, this.validations, (faceBox: DetectionBox) => {
            this.captureImage(faceBox);
            
            
          
            this.errMessage = '';

            this.loading = false;
        });
    }

    captureImage = (faceBox: DetectionBox) => {
        this._capturedImage = this._captureImageUseCase.execute(this.imageElement!, faceBox);
        this._imageHolder.documentImage = this._capturedImage;
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
