export class ValidationState {

    private static _instance = new ValidationState();

    private constructor() { }

    static getInstance() {
        if (ValidationState._instance == null) {
            ValidationState._instance = new ValidationState();
        }
        return ValidationState._instance;
    }

    private _smiling = false;
    private _blinking = false;
    private _glasses = false;
    private _faceInSize = false;
    private _faceValid = false;
    private _docInSize = false;
    private _docValid = false;

    clean() {
        this._smiling = false
        this._blinking = false
        this._glasses = false
        this._faceInSize = false
        this._faceValid = false
        this._docInSize = false
        this._docValid = false
    }

    public get smiling(): boolean {
        return this._smiling;
    }

    public get blinking(): boolean {
        return this._blinking;
    }

    public get glasses(): boolean {
        return this._glasses;
    }

    public get faceInSize(): boolean {
        return this._faceInSize;
    }

    public get faceValid(): boolean {
        return this._faceValid;
    }

    public get docInSize(): boolean {
        return this._docInSize;
    }

    public get docValid(): boolean {
        return this._docValid;
    }

    public set smiling(v: boolean) {
        this._smiling = v;
    }

    public set blinking(v: boolean) {
        this._blinking = v;
    }

    public set glasses(v: boolean) {
        this._glasses = v;
    }

    public set faceInSize(v: boolean) {
        this._faceInSize = v;
    }

    public set faceValid(v: boolean) {
        this._faceValid = v;
    }

    public set docInSize(v: boolean) {
        this._docInSize = v;
    }

    public set docValid(v: boolean) {
        this._docValid = v;
    }
}
