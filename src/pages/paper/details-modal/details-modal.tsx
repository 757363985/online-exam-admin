import React, { useEffect, useState } from 'react';
import { Modal, Tag, Checkbox, Row, Input } from 'antd';
import { getStrAZ } from '@scf/helpers/es/index';

import { GetPaperDetails } from '../service';

import InputModal from './components/input-modal';

import Style from './details-modal.less';

type PaperDetailsModalProps = {
  id: number;
  visible: boolean;
  onCancel: () => void;
};

type ExersiceItem = {
  id: number;
  title: string;
  score: number;
  /** 1单选 2多选 3判断 4填空 5主观 */
  type: 1 | 2 | 3 | 4 | 5;
  rightAnswer: string[];
  optionCount: number;
  options: string[];
};

/** tag标签设置 */
const tagStyle = [
  { color: 'green', text: '单选' },
  { color: 'orange', text: '多选' },
  { color: 'red', text: '判断' },
  { color: 'blue', text: '填空' },
  { color: 'purple', text: '主观' },
];

/** 选择题前缀 */
// const selectIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

/** 判断题前缀 */
const TFIndex = ['正确', '错误'];

const PaperDetailsModal: React.FC<PaperDetailsModalProps> = (props: PaperDetailsModalProps) => {
  const { visible, id, onCancel } = props;

  /** 试卷标题 */
  const [paperTitle, setPaperTitle] = useState('');

  /** 试卷总分数 */
  const [paperScore, setPaperScore] = useState('');

  /** 习题列表 */
  const [exerciseList, setExerciseList] = useState<ExersiceItem[]>([] as ExersiceItem[]);

  useEffect(() => {
    // console.log(id);
    if (visible) {
      GetPaperDetails({ paperId: id }).then(({ data }) => {
        setPaperTitle(data.info.title || '');
        setExerciseList(data.questions || []);
        setPaperScore(data.info.score || '0');
      });
    }
  }, [id, visible]);

  const modalProps = {
    visible,
    onCancel,
    footer: false,
    width: '840px',
  };

  return (
    <Modal getContainer={false} {...modalProps}>
      <div className={Style['paper-head']}>
        <span className={Style['paper-title']}>{paperTitle}</span>
        <div className={Style['paper-count']}>共{exerciseList.length || 0}道题</div>

        <span className={Style['paper-allScore']}>共{paperScore || 0}分</span>
      </div>
      <div className={Style['paper-exerciseList']}>
        {exerciseList.map((item, index) => {
          return (
            <div key={item.id} className={Style['paper-exerciseItem']}>
              <div className={Style['paper-exerciseTitle']}>
                <span className={Style['paper-exerciseIndex']}>
                  {index >= 9 ? index + 1 : `0${index + 1}`}{' '}
                </span>
                <span className={Style.title}>{item.title}</span>
                <span className={Style['paper-exerciseScore']}>{`(${item.score}分)`}</span>
                <Tag color={tagStyle[item.type - 1 || 0].color}>
                  {tagStyle[item.type - 1 || 0].text}
                </Tag>
              </div>
              <div className={Style['paper-exerciseContent']}>
                {/** 选择题 */}
                {item.type === 1 || item.type === 2 ? (
                  <>
                    <Checkbox.Group defaultValue={item.rightAnswer}>
                      {item.options && item.options.length >= 0
                        ? item.options.map((options, order) => {
                            return (
                              <div className={Style.optionsItem} key={options}>
                                <Row>
                                  <Checkbox value={String(order)}>
                                    <span className={Style.selectIndex}>{`${getStrAZ(
                                      order,
                                    )}、`}</span>
                                    {options}
                                  </Checkbox>
                                </Row>
                              </div>
                            );
                          })
                        : ''}
                    </Checkbox.Group>
                    <div className={Style.rightAnswer}>
                      正确答案:
                      <span className={Style.rightOptions}>
                        {item.rightAnswer
                          .map((answer) => {
                            return getStrAZ(Number(answer));
                          })
                          .join('、')}
                      </span>
                    </div>
                  </>
                ) : (
                  ''
                )}
                {/** 判断题 */}
                {item.type === 3 ? (
                  <>
                    <Checkbox.Group defaultValue={item.rightAnswer}>
                      {item.options && item.options.length >= 0
                        ? item.options.map((options, order) => {
                            return (
                              <div className={Style.optionsItem} key={options}>
                                <Row>
                                  <Checkbox value={String(order)}>
                                    {/** <span
                                      className={Style.selectIndex}
                                    >
                                    {`${TFIndex[order]}、`}
                                    
                                    </span> */}
                                    {options}
                                  </Checkbox>
                                </Row>
                              </div>
                            );
                          })
                        : ''}
                    </Checkbox.Group>
                    <div className={Style.rightAnswer}>
                      正确答案:
                      <span className={Style.rightOptions}>
                        {item.rightAnswer
                          ? item.rightAnswer
                              .map((answer) => {
                                return TFIndex[Number(answer)];
                              })
                              .join('、')
                          : ''}
                      </span>
                    </div>
                  </>
                ) : (
                  ''
                )}
                {/** 填空题 */}
                {item.type === 4 ? (
                  <>
                    <InputModal count={item.optionCount} />
                    <div className={Style.rightAnswer}>
                      正确答案:
                      <span className={Style.rightOptions}>
                        {item.rightAnswer
                          ? item.rightAnswer.map((answer, index) => {
                              return `${index + 1}、${answer}`;
                            })
                          : ''}
                      </span>
                    </div>
                  </>
                ) : (
                  ''
                )}
                {/** 主观题 */}
                {item.type === 5 ? (
                  <div className={Style.areaWarpper}>
                    <Input.TextArea placeholder="请输入" />
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default PaperDetailsModal;
