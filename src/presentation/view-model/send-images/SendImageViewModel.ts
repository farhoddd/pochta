import { Nullable } from '../../../shared/typings';
import { IBaseViewModel, UpdateView } from '../BaseViewModel';
import { ApiService } from '../../../data';
import { ImageHolder } from '../../../domains/ImageHolder';
import { message } from 'antd';
import { Base64Image } from '../../../domains/CapturedImage';

export class SendImageViewModel implements IBaseViewModel {
    private _loading = false;
    private _errorOccured = false;

    private _updateView: Nullable<UpdateView> = null;

    get errorOccured() {
        return this._errorOccured;
    }

    set errorOccured(isLoading: boolean) {
        this._errorOccured = isLoading;
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

    constructor(private readonly _imageHolder: ImageHolder) {}

    sendImages = async (apiService: ApiService) => {
        if (this.loading) return;
        this.loading = true;

        try {
            const metadata = await apiService.getSessionMetadata()
            this.errorOccured = false;
            await apiService.addFullframe(
                metadata,
                this._imageHolder.faceImage.fullframe,
                this._imageHolder.documentImage.fullframe
            );
            await apiService.addPreview(
                metadata,
                this._imageHolder.faceImage.preview,
                this._imageHolder.documentImage.preview
            );
        } catch (error) {
            console.error(error);
            message.error('Ошибка: не удалось отправить данные');

            this.errorOccured = true;

            throw error;
        } finally {
            this.loading = false;
        }
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
