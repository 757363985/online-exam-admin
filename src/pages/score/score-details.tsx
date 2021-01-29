import React, { useEffect, useState } from 'react';
import Protable, { ProColumns } from '@ant-design/pro-table';
import { Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getStrAZ } from '@scf/helpers/es/index';

import { GetExamDetails } from './score-details/services';

import Style from './score-details.less';

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
  studentAnswer: string[];
  /** 正确答案 需要根据类型做数据转换 */
  rightAnswer: string[];
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

type scoreDetailsItem = {
  title: string;
  type: 1 | 2 | 3 | 4 | 5;
  studentAnswer: string[];
  rightAnswer: string[];
  status: 0 | 1 | 2;
  result: 0 | 1;
  studentScore: number;
}

/** tag标签设置 */
const typeTagStyle = [
  { color: 'green', text: '单选' },
  { color: 'orange', text: '多选' },
  { color: 'red', text: '判断' },
  { color: 'blue', text: '填空' },
  { color: 'purple', text: '主观' },
];

const statusTagStyle = [
  { color: 'red', text: '未答题' },
  { color: 'orange', text: '待批改' },
  { color: 'green', text: '已完成' },
];

const resultTagStyle = [
  { color: 'red', text: '错误' },
  { color: 'green', text: '正确' },
];

/** 选择题前缀 */
// const selectIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
/** 判断题前缀 */
const TFIndex = ['正确', '错误'];

const ScoreDetails: React.FC = (props: any) => {
  const examId = props.match.params.id;

  /** 考试信息 */
  const [examInfo, setExamInfo] = useState<ExamInfoType>({} as ExamInfoType);

  /** 考试作答详细 */
  const [examDetailsList, setExamDetailsList] = useState<ExamDetailsListType>(
    [] as ExamDetailsListType,
  );

  useEffect(() => {
    GetExamDetails({ id: examId }).then(({ data }) => {
      setExamInfo(data.info);
      setExamDetailsList(data.questions);
    });
  }, [examId]);

  const columnsData:ProColumns<scoreDetailsItem>[] = [
    /** tab表展示的部分 */
    { title: '题目标题', dataIndex: 'title' },
    {
      title: '题型',
      dataIndex: 'type',
      render: (_, item) => {
        return (
          <div>
            <Tag color={typeTagStyle[item.type - 1].color || 'red'}>
              {typeTagStyle[item.type - 1].text || ''}
            </Tag>
          </div>
        );
      },
    },
    {
      title: '考生答案',
      dataIndex: 'studentAnswer',
      render: (_, item) => {
        return (
          <div style={{minWidth:'80px', maxWidth:'500px'}}>
            {/** 选择题 */}
            {item.type === 1 || item.type === 2 ? (
              <span className={Style.rightOptions}>
                {item.studentAnswer
                  ? item.studentAnswer
                      .map((answer: string) => {
                        // return selectIndex[Number(answer)];
                        return getStrAZ(Number(answer));
                      })
                      .join('、')
                  : ''}
              </span>
            ) : (
              ''
            )}
            {/** 判断题 */}
            {item.type === 3 ? (
              <span className={Style.rightOptions}>
                {item.studentAnswer
                  ? item.studentAnswer
                      .map((answer: string) => {
                        return TFIndex[Number(answer)];
                      })
                      .join('、')
                  : ''}
              </span>
            ) : (
              ''
            )}
            {/** 填空题 */}
            {item.type === 4 ? (
              <span className={Style.rightOptions}>
                {item.studentAnswer
                  ? item.studentAnswer
                      .map((answer: string, index: number) => {
                        return `
                          ${index + 1}.${answer}
                          `;
                      })
                      .join('、')
                  : ''}
              </span>
            ) : (
              ''
            )}
            {/** 主观题 */}
            {item.type === 5 ? <div>{item.studentAnswer ? item.studentAnswer[0] || '' : ''}</div> : ''}
          </div>
        );
      },
    },
    {
      title: '正确答案',
      dataIndex: 'rightAnswer',
      render: (_, item) => {
        return (
          <div style={{minWidth:'80px', maxWidth:'500px'}}>
            {/** 选择题 */}
            {item.type === 1 || item.type === 2 ? (
              <span className={Style.rightOptions}>
                {item.rightAnswer
                  ? item.rightAnswer
                      .map((answer: string) => {
                        // return selectIndex[Number(answer)];
                        return getStrAZ(Number(answer));
                      })
                      .join('、')
                  : ''}
              </span>
            ) : (
              ''
            )}
            {/** 判断题 */}
            {item.type === 3 ? (
              <span className={Style.rightOptions}>
                {item.rightAnswer
                  ? item.rightAnswer
                      .map((answer: string) => {
                        return TFIndex[Number(answer)];
                      })
                      .join('、')
                  : ''}
              </span>
            ) : (
              ''
            )}
            {/** 填空题 */}
            {item.type === 4 ? (
              <span className={Style.rightOptions}>
                {item.rightAnswer
                  ? item.rightAnswer
                      .map((answer: string, index: number) => {
                        return `
                        ${index + 1}.${answer}
                        `;
                      })
                      .join('、')
                  : ''}
              </span>
            ) : (
              ''
            )}
            {/** 主观题 */}
            {item.type === 5 ? <div>{item.rightAnswer}</div> : ''}
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      render: (_,item) => {
        return (
          <div>
            <Tag color={statusTagStyle[item.status || 0].color}>{statusTagStyle[item.status || 0].text}</Tag>
          </div>
        );
      },
    },
    {
      title: '答题结果',
      dataIndex: 'result',
      render: (_, item: any) => {
        return (
          // 如果是主观题，就不显示对错
          item.type === 5 ? '':
          <>
            <Tag color={resultTagStyle[Number(item.result)].color}>
              {resultTagStyle[item.result || 0].text}
            </Tag>
          </>
        );
      },
    },
    {
      title: '得分',
      dataIndex: 'studentScore',
    },
  ];

  // 点击返回
  const onGoBackExam = () => {
    props.history.goBack();
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
           *         <div className={Style.exportBtn}>
          <Button>
            <ExportOutlined />
            导出
          </Button>
        </div>
           * 
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
            <span className={Style.infoContent}>{examInfo.studentName || '-'}</span>
          </div>

          <div className={Style.itemWarpper}>
            <span className={Style.infoTitle}>考试时间：</span>
            <span className={Style.infoContent}>{examInfo.studentExamineStartTime || '-'}</span>
          </div>
        </div>

        <div className={Style.blockWarpper}>
          <div className={Style.blickItem}>
            <div className={Style.time}>
              {Math.floor(examInfo.examineDuration / 60) || 0}{' '}
              <span style={{ fontSize: '14px', color: '#666' }}>分钟</span>
            </div>
            <span className={Style.timeScore}>耗时</span>
          </div>
          <div className={Style.blickItem}>
            <div className={Style.score}>{examInfo.score || 0}</div>{' '}
            <div className={Style.timeScore}>考试成绩</div>
          </div>
        </div>
      </div>

      {/** 列表内容 */}
      <div className={Style.tableWarpper}>
        <Protable
          search={false}
          options={false}
          columns={columnsData}
          dataSource={examDetailsList}
          pagination={false}
          rowKey="id"
        />
      </div>
    </>
  );
};

export default ScoreDetails;
