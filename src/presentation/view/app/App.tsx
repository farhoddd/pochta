import React, { useEffect, useState } from 'react';
import { ReactComponent as Logo } from '../../../assets/icons/logo.svg';
import './app.css';
import { Steps, Result, Spin } from 'antd';

import { AppViewModel } from '../../view-model/app/AppViewModel';
import { FaceScannerContainer } from '../../container/FaceScannerContainer';
import { DocumentScannerContainer } from '../../container/DocumentScannerContainer';
import { SendImagesContainer } from '../../container/SendImagesContainer';
import DataOfWorker from '../data-of-worker/DataOfWorker';
import { ApiService, CacheHalper } from '../../../data';
import { REACT_APP_COOKIE_NAME, REACT_APP_MOCK } from '../../../consts';
import { ClientMetadata } from '../../../data';

const { Step } = Steps;

type appProps = {
    vm: AppViewModel;
    apiService: ApiService;
};

type AppState = {
    current: number;
    modelsLoaded: boolean;
    cookieLoaded: boolean;
    clientData: ClientMetadata;
};

function App({ vm, apiService }: appProps): JSX.Element {
    const [state, setState] = useState<AppState>({
        current: 0,
        // current: 2,
        modelsLoaded: false,
        cookieLoaded: false,
        clientData: {
            token: '',
            wfmId: 0,
            iin: 0,
            username: '',
            timestamp: '',
            error: 'Создается соединение с сервером',
        },
    });

    const next = () => {
        setState((s) => ({ ...s, current: s.current + 1 }));
    };
    const reset = () => setState((s) => ({ ...s, current: 0 }));

    const loadSessionToken = async (): Promise<Boolean> => {
        const hasCookie = document.cookie?.split('; ').find((row) => row.startsWith(REACT_APP_COOKIE_NAME));
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const hasSessionToken = document.cookie?.split('; ').find((row) => row.startsWith('sessionToken'));
        const getCookie = (cname: string) => {
            let name = cname + '=';
            console.log(name.length);
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        };

        if (hasCookie || hasSessionToken || REACT_APP_MOCK === 'true') {
            const sessionToken = getCookie('sessionToken');
            return await apiService
                .getMetadata(sessionToken!)
                .then((data) => {
                    setState((s) => ({ ...s, cookieLoaded: true, clientData: { ...data, error: undefined } }));
                    return true;
                })
                .catch((error) => {
                    setState((s) => ({
                        ...s,
                        cookieLoaded: true,
                        clientData: { ...s.clientData, error: 'Ошибка соединения с сервером' },
                    }));
                    return false;
                });
        } else {
            setState((s) => ({
                ...s,
                cookieLoaded: true,
                clientData: { ...s.clientData, error: 'Отсуствует токен сессии' },
            }));
            return false;
        }
    };

    useEffect(() => {
        loadSessionToken()
            .then((isTokenLoaded) => {
                if (isTokenLoaded) {
                    vm.loadModels().then(() => {
                        setState((s) => ({
                            ...s,
                            modelsLoaded: true,
                        }));
                    });
                } else {
                    setState((s) => ({
                        ...s,
                        modelsLoaded: true,
                    }));
                }
            })
            .catch((error) => {});
    }, [vm]);

    const getCurrentComponent = () => {
        if (state.current === 0) {
            return <DataOfWorker clientData={state.clientData} next={next} />;
        } else if (state.current === 1) {
            return <FaceScannerContainer next={next} />;
        } else if (state.current === 2) {
            return <DocumentScannerContainer next={next} />;
        } else if (state.current === 3) {
            return <SendImagesContainer next={next} apiService={apiService} reset={reset} />;
        } else {
            new CacheHalper().resetLocalStore();
            return (
                <Result
                    className="result"
                    status="success"
                    title="Успешно отправлено!"
                    subTitle="Можете закрыть вкладку. Ожидайте результата."
                />
            );
        }
    };

    return (
        <div className="app">
            <div className="app__logo logo">
                <Logo />
            </div>
            <div className="app__content">
                <div className="progress-bar">
                    <Steps current={state.current}>
                        <Step
                            title="Данные сотрудника"
                            className="worker__item--indent" /* icon={<UserOutlined />} */
                        />
                        <Step title="Лицо" /* icon={<UserOutlined />} */ />
                        <Step title="Документ" /* icon={<SolutionOutlined />} */ />
                        <Step title="Отправка" /* icon={<CloudSyncOutlined />} */ />
                    </Steps>
                </div>

                <Spin spinning={!state.modelsLoaded || !state.cookieLoaded} tip="Загрузка моделей" size="large">
                    {getCurrentComponent()}
                </Spin>
            </div>
        </div>
    );
}

export default App;
