import { SyncOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useEffect, useState } from 'react';
import { ApiService } from '../../../data';
import { SendImageViewModel } from '../../view-model/send-images/SendImageViewModel';

export function SendImages({ vm, apiService, next, reset }: { vm: SendImageViewModel; apiService: ApiService; next: () => void; reset: () => void }) {
    const [errorOccured, setErrorOccured] = useState(false);
    const [wasErrorMade, setWasErrorMade] = useState(false);
    useEffect(() => {
        vm.attachView(() => {
            setErrorOccured(vm.errorOccured);
        });

        vm.sendImages(apiService)
            .then(() => {
                next();
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            vm.detachView();
        };
    }, [vm, setErrorOccured]);

    return (
        <div className="loading">
            {errorOccured ? (
                <Result
                    status="error"
                    title="Ошибка"
                    subTitle="Пожалуйста попробуйте позже."
                    extra={[
                        <Button key="buy" type="primary" onClick={reset}>
                            Начать заново
                        </Button>,
                    ]}
                />
            ) : (
                <SyncOutlined size={55} spin={true} />
            )}
        </div>
    );
}
