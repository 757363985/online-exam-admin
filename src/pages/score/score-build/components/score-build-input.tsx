import React, { useState } from 'react';
import { Tag, Input, message } from 'antd';

import Style from '../score-build.less';

type ScoreBuildInputProps = {
  id: number;
  InputChange: (Params: { id: number; score: number }) => void;
  sort: number;
  score: number;
  studentAnswer: string;
  title: string;
  disable: boolean
};

const ScoreBuildInput: React.FC<ScoreBuildInputProps> = (props: ScoreBuildInputProps) => {
  const { sort, id, score, title, studentAnswer, InputChange, disable } = props;

  const [InputNumber, setInputNumber] = useState('');

  // useEffect(() => {
  //   console.log(id);
  // }, [id]);

  // 监听input框打分的改变
  const onChangeCall = (e: any) => {
    if (e.target.value > score) {
      message.warn('分数不得大于题目总数');
      // setInputNumber('')
    } else {
      setInputNumber(e.target.value);
      InputChange({
        id,
        score: e.target.value,
      });
    }
  };

  return (
    <>
      <div className={Style['paper-exerciseItem']}>
        <div className={Style['paper-exerciseTitle']}>
          <span className={Style['paper-exerciseIndex']}>{sort >= 10 ? sort : `0${sort}`} </span>
          <span className={Style.title}>{title}</span>
          <span className={Style['paper-exerciseScore']}>{`(${score}分)`}</span>
          <Tag color="purple">主观题</Tag>
        </div>

        <div className={Style.examContent}>
          <div className={Style.studentAnswer}>{studentAnswer}</div>

          <Input
            onChange={(e) => {
              onChangeCall(e);
            }}
            value={InputNumber}
            type="number"
            placeholder="请输入分数"
            disabled={disable}
          />
        </div>
      </div>
    </>
  );
};

export default ScoreBuildInput;
