
import React, { useEffect, useState } from 'react'
import { List, Button } from 'antd';
import "./data-of-worker.css"
import { ClientMetadata } from '../../../data';

function DataOfWorker({ clientData, next }: { clientData: ClientMetadata, next: () => void }): JSX.Element {
    const [error, setError] = useState(false)

    const [data, setData] = useState([
        'Идентификатор верификации:',
        'ИИН:',
        'Имя оператора:',
        'Дата запроса верификации:',
    ]);

    useEffect(() => {
        if (!clientData.error) {
            setError(false)
            setData(() => {
                return [
                    `Идентификатор верификации: ${clientData.wfmId}`,
                    `ИИН: ${clientData.iin}`,
                    `Имя оператора: ${clientData.username}`,
                    `Дата запроса верификации: ${clientData.timestamp} UTC`,
                ]
            })
        } else {
            setError(true)
            setData(() => {
                return [clientData.error!]
            })
        }
    }, [clientData])

    return (<div className="data">
        <div className="data__inner">
            <List
                bordered
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        {item}
                    </List.Item>
                )}
            />
            <div className="data__button">
                <Button disabled={error} type="primary" block shape="round" size="middle" onClick={next} >
                    Начать
                </Button>
            </div>
        </div>

    </div>);
}
export default DataOfWorker;