import React, { useEffect, useState } from 'react'
import { List } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import "./data-of-worker.css"
import { DataOfState } from '../face-scanner/FaceScanner';

type ValidationMapping = {
  step: string
  status: boolean
}

export function FaceValidations({ state }: { state: DataOfState }): JSX.Element {

  const [checkList, setCheckList] = useState<ValidationMapping[]>()

  useEffect(() => {
    setCheckList(() => [
      {
        step: 'Улыбка',
        status: state._smiling
      },
      {
        step: 'Лицо в области сканирования',
        status: state._faceInSize
      },
      {
        step: 'Лицо найдено',
        status: state._faceValid
      }
    ])
  }, [state])

  return (
    <div className="validator">
      <List
        itemLayout="horizontal"
        dataSource={checkList}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={item.status ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#c41a1a" />}
              title={<a href="https://ant.design">{item.step}</a>}
            />
          </List.Item>
        )}
      />
    </div>);
}
