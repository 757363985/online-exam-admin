import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { Row, Col, Statistic } from 'antd';

import ExamPercent from './components/exam-percent-bar';
import Student from './components/student-position-map';
import PaperRadar from './components/paper-radar';
import PassDegrade from './components/exam-subject-bar';

import { GetHeaderCounter } from './services';

import './home.less';

/** 创建试卷 */
const PUBLISH_NEWS = require('@/assects/img/paper.png');

/** 上传试题 */
const UPLOAD_IMG = require('@/assects/img/exam.png');

type examDataType = {
  examNum: number;
  totalParticipateNum: number;
  alreadyParticipateNum: number;
  passRate: number;
  excellentRate: number;
};

const Home: React.FC = () => {
  /** 顶部考试参数 */
  const [examData, setExamData] = useState<examDataType>({} as examDataType);

  useEffect(() => {
    GetHeaderCounter().then(({ data }) => {
      setExamData(data);
    });
  }, []);

  /** 点击发布新闻或上传图片 */
  const onClickActionBtn = (type: 'paper' | 'exam') => {
    if (type === 'paper') history.push('/paper-management');
    if (type === 'exam') history.push('/exam-management');
  };

  return (
    <>
      {/** 首页顶部 */}
      <div className="home-head">
        {/* 发布新闻与上传照片 */}
        <div className="action-part">
          <img src={PUBLISH_NEWS} alt="" onClick={() => onClickActionBtn('paper')} />
          <img src={UPLOAD_IMG} alt="" onClick={() => onClickActionBtn('exam')} />
        </div>

        {/* 校友总数量栏数据 */}
        <div className="data-part">
          <div className="main-data">
            <div className="data-item">
              <div className="label">总考试数</div>
              <Statistic
                className="value"
                valueStyle={{ fontSize: '30px' }}
                value={examData.examNum || 0}
              />
              <div className="diliver" />
            </div>

            <div className="data-item">
              <div className="label">总参考人数</div>

              <Statistic
                className="value"
                valueStyle={{ color: '#50B674', fontSize: '30px' }}
                value={examData.totalParticipateNum || 0}
              />
              <div className="diliver" />
            </div>

            <div className="data-item">
              <div className="label">已参考人数</div>
              <Statistic
                className="value"
                valueStyle={{ fontSize: '30px' }}
                value={examData.alreadyParticipateNum || 0}
              />
              <div className="diliver" />
            </div>

            <div className="data-item">
              <div className="label">平均及格率</div>
              <Statistic
                className="value"
                valueStyle={{ fontSize: '30px' }}
                value={examData.passRate || 0}
                suffix="%"
              />
              <div className="diliver" />
            </div>

            <div className="data-item">
              <div className="label">平均优秀率</div>
              <Statistic
                className="value"
                valueStyle={{ fontSize: '30px' }}
                value={examData.excellentRate || 0}
                suffix="%"
              />
            </div>
          </div>
        </div>
      </div>
      {/** 图标渲染 */}
      <div className="home-charts-warpper">
        <Row gutter={20} justify="space-around">
          <Col span={12}>
            <div style={{ background: '#fff', padding: '0 26px' }}>
              <ExamPercent />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ background: '#fff', padding: '0 26px', height: 400 }}>
              <PaperRadar />
            </div>
          </Col>
        </Row>

        <Row gutter={20} justify="space-around" style={{ marginTop: 20 }}>
          <Col span={12}>
            <div style={{ background: '#fff', padding: '0 26px', overflow: 'hidden' }}>
              <Student />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ background: '#fff', padding: '0 26px', height: 400 }}>
              <PassDegrade />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Home;
