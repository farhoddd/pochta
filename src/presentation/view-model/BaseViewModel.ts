export type UpdateView = () => void;

export interface IBaseViewModel {
    attachView(updateView: UpdateView): void;
    detachView(): void;
}
