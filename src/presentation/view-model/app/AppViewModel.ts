import { Nullable } from '../../../shared/typings';
import { IBaseViewModel, UpdateView } from '../BaseViewModel';
import { LoadDetectionModelsUseCase } from '../../../interactors/LoadDetectionModelsUseCase';

export class AppViewModel implements IBaseViewModel {
    private _updateView: Nullable<UpdateView> = null;

    constructor(private readonly _loadFaceDetectionModelsUseCase: LoadDetectionModelsUseCase) {}

    loadModels() {
        return this._loadFaceDetectionModelsUseCase.execute();
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
