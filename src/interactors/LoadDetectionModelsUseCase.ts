import { nets } from 'face-api.js';
import '@tensorflow/tfjs-backend-wasm';
import { Nullable } from '../shared/typings';
import { GraphModel, loadGraphModel } from '@tensorflow/tfjs';
import { PUBLIC_URL } from '../consts';

export class LoadDetectionModelsUseCase {
    private static _instance: LoadDetectionModelsUseCase = new LoadDetectionModelsUseCase();

    private constructor() { }

    static getInstance() {
        if (LoadDetectionModelsUseCase._instance == null) {
            LoadDetectionModelsUseCase._instance = new LoadDetectionModelsUseCase();
        }

        return LoadDetectionModelsUseCase._instance;
    }

    private _modelsLoaded = false;
    private _uri = PUBLIC_URL + '/models';

    private _docModel: Nullable<GraphModel> = null;

    get docModel() {
        return this._docModel!;
    }

    async execute() {
        if (!this._modelsLoaded) {
            await nets.ssdMobilenetv1.loadFromUri(this._uri);
            await nets.faceLandmark68TinyNet.loadFromUri(this._uri);
            await nets.faceExpressionNet.loadFromUri(this._uri);
            this._docModel = await loadGraphModel('models/doc_ssd_mobilnet_v2/model.json',
                {
                    requestInit: {
                        cache: 'force-cache',
                        headers: { 'Cache-Control': 'public', 'Pragma': 'public' }
                    }
                });
            this._modelsLoaded = true;
        }
    }
}
