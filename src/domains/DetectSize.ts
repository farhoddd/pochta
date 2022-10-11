import { DetectionBox } from './DetectionBox';

export class DetectSize {
    constructor(public readonly opts: { x: number; y: number; width: number; height: number; allowance: number }) {}
    match(matchOpts: DetectionBox): boolean {
        const [outer, inner] = this.sizesWithAllowance;

        if (!this.contains(outer, matchOpts)) {
            return false;
        }

        if (!this.contains(matchOpts, inner)) {
            return false;
        }

        return true;
    }

    private get fromXAllowance() {
        return [this.opts.x - this.opts.allowance, this.opts.x + this.opts.allowance];
    }

    private get toXAllowance() {
        return [this.opts.width - this.opts.allowance * 2, this.opts.width + this.opts.allowance * 2];
    }

    private get fromYAllowance() {
        return [this.opts.y - this.opts.allowance, this.opts.y + this.opts.allowance];
    }

    private get toYAllowance() {
        return [this.opts.height - this.opts.allowance * 2, this.opts.height + this.opts.allowance * 2];
    }

    get sizesWithAllowance() {
        const [startFromX, endFromX] = this.fromXAllowance;

        const [startToX, endToX] = this.toXAllowance;

        const [startFromY, endFromY] = this.fromYAllowance;

        const [startToY, endToY] = this.toYAllowance;
        return [
            new DetectionBox(startFromX, startFromY, endToX, endToY),
            new DetectionBox(endFromX, endFromY, startToX, startToY),
        ];
    }

    contains(outer: DetectionBox, inner: DetectionBox) {
        if (inner.width > outer.width) {
            return false;
        }

        if (inner.height > outer.height) {
            return false;
        }

        if (inner.x < outer.x) {
            return false;
        }

        if (inner.y < outer.y) {
            return false;
        }

        return true;
    }
}
