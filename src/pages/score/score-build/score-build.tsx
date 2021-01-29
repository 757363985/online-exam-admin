import React, { useState, useEffect } from 'react';
// import Protable from '@ant-design/pro-table';
import { Button, message, Affix } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

// import BatchOperation from '@/components/batch-operation-dropdown/batch-operation';
// import usePagingProTable from '@/hooks/use-paging-pro-table/use-paging-pro-table';
// import { history } from 'umi';
import ScoreBuildInput from './components/score-build-input';
import { GetExamSubjective } from '../score-details/services';
import { PutCallScore } from './services';

import Style from './score-build.less';

type ExamInfoType = {
  /** 考试标题 */
  examineTitle: string;
  /** 考试标签/分类 */
  examineKeywords: string;
  /** 学生名称 */
  studentName: string;
  /** 开始/触发考试时间 */
  studentExamineStartTime: string;
  /** 考试持续时间 秒 */
  examineDuration: number;
  /** 成绩 */
  score: number;
};

type ExamDetailsListType = {
  id: number;
  /** 标题 */
  title: string;
  /** 类型1:单选;2:多选;3:判断;4:填空;5:主观 */
  type: 1 | 2 | 3 | 4 | 5;
  /** 学生答案 需要根据类型做数据转换 */
  studentAnswer: string;
  /** 正确答案 需要根据类型做数据转换 */
  rightAnswer: string;
  /** 状态;0:未参考;1:待批改;2:已完成 */
  status: 0 | 1 | 2;
  /** 答题结果0:错误;1:正确 */
  result: 0 | 1;
  /** 题目分数 */
  score: number;
  /** 题目序号 */
  sort: number;
  /** 学生分数 */
  studentScore: number;
}[];

const ScoreBuild: React.FC = (props: any) => {

  const examId = props.match.params.id;

  /** 考试信息 */
  const [examInfo, setExamInfo] = useState<ExamInfoType>({} as ExamInfoType);

  type ScoreArrayType = {
    id: number;
    score: number | string;
  }[];

  /** 教师打分数据 */
  const [scoreArray, setScoreArray] = useState<ScoreArrayType>([] as ScoreArrayType);

  /** 当前打分 */
  const [nowScore, setNowScore] = useState(0);

  /** 基础得分 */
  const [baseScore, setBaseScore] = useState(0);

  /** 是否已经完成打分 */
  const [compelete, setCompelete] = useState(false);

  /** 考试作答详细 */
  const [examDetailsList, setExamDetailsList] = useState<ExamDetailsListType>(
    [] as ExamDetailsListType,
  );

  useEffect(() => {
    GetExamSubjective({ id: examId }).then(({ data }) => {
      setExamInfo(data.info);
      setExamDetailsList(data.questions);
      setBaseScore(data.info.score || 0);
      setNowScore(data.info.score || 0);
    });
  }, [examId]);

  // 点击返回
  const onGoBackExam = () => {
    props.history.goBack();
  };

  // 点击确认提交
  const onSubmitScoreBuild = () => {
    if (scoreArray.length < examDetailsList.length) {
      message.warn('未完成所有题目打分');
    } else {
      PutCallScore({ id: examId, results: scoreArray }).then(() => {
        message.success('您已完成打分');
        setCompelete(true);
        // history.goBack()
      });
    }
  };

  /** 监听input输入框的变化 */
  const onListenInput = (params: { id: number; score: number | string }) => {
    let newScoreArray = [...scoreArray];

    if (scoreArray.some((item) => item.id === params.id)) {
      if (params.score === '') {
        newScoreArray = scoreArray.filter((item) => item.id !== params.id);
      } else {
        newScoreArray.forEach((newItem) => {
          if (newItem.id === params.id) {
            newItem.score = Number(params.score);
          }
        });
      }
    } else {
      const newParams = { ...params };
      newParams.score = Number(params.score)
      newScoreArray.push(newParams);
    }

    let newNowScore = baseScore;

    // 更新当前得分
    newScoreArray.forEach((item) => {
      newNowScore += Number(item.score);
    });

    setNowScore(newNowScore);
    // 更新教师打分数据
    setScoreArray([...newScoreArray]);
  };

  return (
    <>
      <div className={Style.headWarpper}>
        <div className={Style.link}>
          <span className={Style.arrow} onClick={onGoBackExam}>
            <ArrowLeftOutlined />
          </span>
          <span className={Style.title}>成绩详情</span>
        </div>

        {/** 
           *  暂时不需要导出       
        <div className={Style.exportBtn}>
          <Button>
            <ExportOutlined />
            导出
          </Button>
        </div>
          */}
      </div>

      <div className={Style.userInfo}>
        <div className={Style.userData}>
          <div className={Style.itemWarpper}>
            <span className={Style.infoTitle}>试卷标题：</span>
            <span className={Style.infoContent}>{examInfo.examineTitle}</span>
          </div>

          <div className={Style.itemWarpper}>
            <span className={Style.infoTitle}>考试分类：</span>
            <span className={Style.infoContent}>{examInfo.examineKeywords}</span>
          </div>

          <div className={Style.itemWarpper}>
            <span className={Style.infoTitle}>考生姓名：</span>
            <span className={Style.infoContent}>{examInfo.studentName}</span>
          </div>

          <div className={Style.itemWarpper}>
            <span className={Style.infoTitle}>考试时间：</span>
            <span className={Style.infoContent}>{examInfo.studentExamineStartTime}</span>
          </div>
        </div>

        <div className={Style.blockWarpper}>
          <Affix offsetTop={120}>
            <div className={Style.blickItem}>
              <div className={Style.score}>{nowScore}</div>{' '}
              <div className={Style.timeScore}>当前得分</div>
            </div>
          </Affix>
        </div>
      </div>

      {/** 教师打分 */}
      <div className={Style.callScoreWarpper}>
        {examDetailsList.map((item) => {
          if (item.type === 5) {
            return (
              <ScoreBuildInput
                disable={compelete}
                key={item.id}
                id={item.id}
                sort={item.sort}
                score={item.score}
                studentAnswer={item.studentAnswer}
                title={item.title}
                InputChange={onListenInput}
              />
            );
          }
          return '';
        })}
        {compelete || !examDetailsList || !examDetailsList.length  ? (
          ''
        ) : (
          <Button type="primary" onClick={onSubmitScoreBuild}>
            确定
          </Button>
        )}
      </div>
    </>
  );
};

export default ScoreBuild;
