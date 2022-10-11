import * as tf from '@tensorflow/tfjs';
import { Tensor, Rank } from '@tensorflow/tfjs';
import { DetectionBox } from '../domains/DetectionBox';
import { DetectSize } from '../domains/DetectSize';
import { FrameValidation, ValidationState } from '../validation';
import { Nullable } from '../shared/typings';
import { CamDebug } from './CamDebug';
import { LoadDetectionModelsUseCase } from './LoadDetectionModelsUseCase';
import { videoParam } from '../shared';
import { REACT_APP_DEBUG } from '../consts';

export type DocDetection = {
    faceDetection: { score: number; box: number[] },
    docDetection: { score: number; box: number[] },
    gerbDetection: { score: number; box: number[] }
};

export class DocDetectionUseCase {
    private _detecting = false;
    private _reqId = 0;
    private _camDebug: Nullable<CamDebug> = null;
    private _state: ValidationState;

    constructor(
        private readonly _detectSize: DetectSize,
        private readonly _loadDetectionModelsUseCase: LoadDetectionModelsUseCase
    ) {
        this._state = ValidationState.getInstance()
        if (REACT_APP_DEBUG === 'true') {
            this._camDebug = new CamDebug();
        }
    }

    execute(videoElement: HTMLVideoElement, validations: FrameValidation[], cb: (faceBox: DetectionBox) => void): void {
        this._detecting = true;

        console.log('DocDetectionUseCase');
        const doDetect = async () => {
            console.log('doDetect');
            if (this._detecting) {
                const detection = await this.singleDocDetect(videoElement);

                if (detection) {
                    const isValid = validations.map((v) => v.validate(detection))
                        .reduce((l, r) => l && r);
                    const faceBox = DetectionBox.fromNumber(detection.faceDetection.box);
                    if (this._camDebug) {
                        this._camDebug.renderDebugRectangles(
                            videoElement,
                            undefined,
                            undefined,
                            undefined,
                            this._detectSize,
                            detection
                        );
                        console.log('doc valid', isValid);
                        console.log(this._state)
                    }
                    if (isValid) {
                        this.abort();
                        cb(faceBox);
                    }
                } else {
                    this._state.clean()
                }
                this._reqId = window.requestAnimationFrame(doDetect);
            } else {
                this.abort();
            }
        };

        doDetect()
    }

    abort() {
        this._detecting = false;

        do {
            cancelAnimationFrame(this._reqId);
            this._reqId = 0;
        } while (this._reqId !== 0);
    }

    async singleDocDetect(videoElement: HTMLVideoElement): Promise<DocDetection | undefined> {
        if (!this._loadDetectionModelsUseCase.docModel) {
            return undefined;
        }

        let input = tf.browser.fromPixels(videoElement).resizeBilinear([videoParam.width, videoParam.height]);
        input = input.expandDims(0);
        const result = (await this._loadDetectionModelsUseCase.docModel.executeAsync({ image_tensor: input }, [
            'detection_boxes',
            'detection_scores',
            'detection_classes',
            'num_detections',
        ])) as Tensor<Rank>[];
        let [boxes, scores, classes] = result;

        boxes = boxes.squeeze();
        scores = scores.squeeze();

        const syncedClasses = classes.squeeze().arraySync() as number[]

        const classToIndex = syncedClasses.map((value, index) => {
            return { "e": value, "i": index };
        })

        const face = this.extractResults(scores, boxes, classToIndex, 1);
        const doc = this.extractResults(scores, boxes, classToIndex, 2);
        const gerb = this.extractResults(scores, boxes, classToIndex, 3);

        input.dispose();
        return { faceDetection: face, docDetection: doc, gerbDetection: gerb };
    }

    private extractResults(scores: tf.Tensor<tf.Rank>, boxes: tf.Tensor<tf.Rank>, classToIndex: { e: number, i: number }[], classNum: number) {
        const indexes = classToIndex.filter((obj) => obj.e === classNum).map(obj => obj.i)
        let score = scores.dataSync()[indexes[0]] as number;
        if (!score) {
            score = 0;
        }
        let box = (boxes.arraySync() as number[])[indexes[0]] as unknown as number[];
        if (!box) {
            box = [0, 0, 0, 0]
        }
        return { score: score, box: box };
    }
}
