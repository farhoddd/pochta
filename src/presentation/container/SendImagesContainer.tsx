import { SendImages } from '../view/send-images/SendImages';
import { SendImageViewModel } from '../view-model/send-images/SendImageViewModel';
import { ApiService } from '../../data';
import { ImageHolder } from '../../domains/ImageHolder';

const imageHolder = ImageHolder.getInstance();
const sendImageViewModel = new SendImageViewModel(imageHolder);

export function SendImagesContainer({ next, apiService, reset }: { next: () => void, apiService: ApiService, reset: () => void }): JSX.Element {
    return <SendImages vm={sendImageViewModel} apiService={apiService} next={next} reset={reset} />;
}
