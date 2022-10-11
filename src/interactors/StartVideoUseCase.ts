export type StartVideoSettings = {
    video: {
        width: number;
        height: number;
        facingMode: 'user';
        noiseSuppression: boolean;
        frameRate: number;
    };
    audio: boolean;
};

export class StartVideoUseCase {
    constructor(private _navigator: Navigator) {}

    async execute(videoElement: HTMLVideoElement, params: StartVideoSettings) {
        videoElement.srcObject = await this._navigator.mediaDevices.getUserMedia(params);
        videoElement.height = videoElement.videoHeight;
        videoElement.width = videoElement.videoWidth;
        await videoElement.play();
    }
}
