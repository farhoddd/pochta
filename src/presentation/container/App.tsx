import App from '../view/app/App';
import { AppViewModel } from '../view-model/app/AppViewModel';
import { LoadDetectionModelsUseCase } from '../../interactors/LoadDetectionModelsUseCase';
import { ApiService } from '../../data';

const apiService = new ApiService();
const loadFaceDetectionModelsUseCase = LoadDetectionModelsUseCase.getInstance();
const appViewModel = new AppViewModel(loadFaceDetectionModelsUseCase);

export function AppContainer() {
    return <App vm={appViewModel} apiService={apiService}/>;
}
