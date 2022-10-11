import * as tf from '@tensorflow/tfjs';
import { Tensor, Rank } from '@tensorflow/tfjs';
import { detectSingleFace, resizeResults, SsdMobilenetv1Options } from 'face-api.js';
import { DetectSize } from '../domains/DetectSize';
import { DetectionBox } from '../domains/DetectionBox';
import { Nullable } from '../shared/typings';
import { FrameValidation } from '../validation';
import { LoadDetectionModelsUseCase } from './LoadDetectionModelsUseCase';
import { CamDebug } from './CamDebug';
import * as faceapi from 'face-api.js';
import { REACT_APP_DEBUG } from '../consts';

export type DocDetection = { score: number; box: number[] };

// not used in image processing
export class ImageDetectionUseCase {
    private _detecting = false;
    private _reqId = 0;
    private _docPreThreshold = 0.9;
    private _camDebug: Nullable<CamDebug> = null;

    constructor(private readonly _faceDetectSize: DetectSize,
        private readonly _docDetectSize: DetectSize,
        private readonly _loadDetectionModelsUseCase: LoadDetectionModelsUseCase) {
        if (REACT_APP_DEBUG === 'true') {
            this._camDebug = new CamDebug();
        }
    }

    execute(imageFile: any, validations: FrameValidation[], cb: (faceBox: DetectionBox) => void) {
        const ssdMobilenetv1Options = new SsdMobilenetv1Options();
        // const tinyFaceDetectorOptions = new TinyFaceDetectorOptions();
        this._detecting = true;
        console.log('ImageDetectionUseCase');
        const doDetect = async () => {
            const image = await faceapi.bufferToImage(imageFile.files[0])

            if (this._detecting) {
                //   const result = await detectSingleFace(videoElement).withFaceLandmarks(true).withFaceExpressions()
                const docDetection = await this.singleDocDetect(image);
                const result = await detectSingleFace(image, ssdMobilenetv1Options)
                const resize_result = resizeResults(result, { width: 1280, height: 720 })
                if (resize_result) {

                    const isValid = validations.every((v) => v.validate(resize_result));

                    const faceBox = DetectionBox.fromBox(resize_result.box);
                    const docBox = DetectionBox.fromNumber(docDetection.box);
                    const faceWithinSize = this._docDetectSize.match(faceBox)
                    const docWithinSize = this._docDetectSize.match(docBox)
                    if (this._camDebug) {
                        this._camDebug.renderDebugRectangles(imageFile, result);
                        console.log('face valid: ', isValid);
                        console.log("faceWithinSize", faceWithinSize);
                    }
                    if (this._faceDetectSize.match(faceBox) && faceWithinSize && isValid) {
                        this.abort();
                        cb(faceBox);
                    }
                }


            }
        };


    }

    async singleDocDetect(fileImage: HTMLImageElement): Promise<DocDetection> {
        if (!this._loadDetectionModelsUseCase.docModel) {
            return { score: 0, box: [0, 0, 0, 0] };
        }

        let input = tf.browser.fromPixels(fileImage);
        input = input.expandDims(0);
        let [boxes, scores] = (await this._loadDetectionModelsUseCase.docModel.executeAsync({ image_tensor: input }, [
            'detection_boxes',
            'detection_scores',
            'detection_classes',
            'num_detections',
        ])) as Tensor<Rank>[];

        boxes = boxes.squeeze();
        scores = scores.squeeze();

        let foundBox: number[] = [0, 0, 0, 0];
        let foundScore: number = 0;

        let score = scores.dataSync()[0] as number;
        // score = (score * 100000) % 1;

        if (score > this._docPreThreshold) {
            foundBox = (boxes.arraySync() as number[])[0] as unknown as number[];
            foundScore = score;
        }

        input.dispose();
        return { score: foundScore, box: foundBox };
    }

    abort() {
        this._detecting = false;

        do {
            cancelAnimationFrame(this._reqId);
            this._reqId = 0;
        } while (this._reqId !== 0);
    }
}
