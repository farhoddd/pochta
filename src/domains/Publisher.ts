import { IListener } from './Listener';

export interface IPublisher {
    subscribe(listener: IListener): () => void;
    unsubscribe(listener: IListener): void;
}

export class Publisher implements IPublisher {
    listeners: IListener[] = [];

    subscribe(listener: IListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    unsubscribe(listener: IListener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    notifyListeners() {
        for (const listener of this.listeners) {
            listener.notify();
        }
    }
}
