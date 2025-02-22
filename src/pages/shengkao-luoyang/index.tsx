import { useCreation, useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { Line } from '@ant-design/plots';
import { Input, Typography } from 'antd';
import { RollbackOutlined, CoffeeOutlined } from '@ant-design/icons';
import ConditionComponent from '@/components/condition-component';
import IfElseComponent from '@/components/if-else-component';
import { ScoreItem, ScoreObjItemCell } from '@/interface';
import score2022 from '@/files/score-shengkao-luoyang-2022.json';
import score2023 from '@/files/score-shengkao-luoyang-2023.json';
import score2024 from '@/files/score-shengkao-luoyang-2024.json';
import './index.scss';

const score = {
  '2022': score2022,
  '2023': score2023.map((item) => ({
    ...item,
    post: item.post.split('-')[1],
  })),
  '2024': score2024,
};

interface ScoreYearItem extends ScoreItem {
  year: string;
}

interface PostItem extends ScoreObjItemCell<number> {
  list: ScoreItem[];
}

interface SamePostListItem {
  post: string;
  ['2022']: PostItem;
  ['2023']: PostItem;
  ['2024']: PostItem;
  ave: number;
}

const ScoreShowItem: React.FC<{
  score: PostItem;
  year: string;
}> = ({ score, year }) => {
  return (
    <div className="history-score-list__item-cell">
      <Typography.Text className="history-score-list__item-content__year">{year}</Typography.Text>
      <IfElseComponent
        condition={score.list.length > 0}
        if={
          <div className="history-score-list__item-content__score-group">
            <Typography.Text className="history-score-list__item-content__score score">
              {score?.ave}
            </Typography.Text>
            <Typography.Text className="history-score-list__item-content__score score">
              {score.min}-{score.max}
            </Typography.Text>
          </div>
        }
        else={
          <Typography.Text className="history-score-list__item-content__score-group">-</Typography.Text>
        }
      />
    </div>
  );
};

const Index = () => {
  const [samePostList, setSamePostList] = useSafeState<SamePostListItem[]>([]);
  const [postInput, setPostInput] = useSafeState('');
  const [listSort, setListSort] = useSafeState<'asc' | 'desc'>('asc');
  const toggleListSort = useMemoizedFn(() => {
    setListSort((v) => (v === 'asc' ? 'desc' : 'asc'));
  });
  const merge = useMemoizedFn(() => {
    const result = new Map();

    Object.keys(score).forEach((year) => {
      score[year as '2022' | '2023' | '2024'].forEach((item) => {
        const target = {
          ...item,
          year,
        };
        if (!!result.get(target.post)) {
          result.set(target.post, result.get(target.post).concat([target]));
        } else {
          result.set(target.post, [target]);
        }
      });
    });

    const getDataOperateObj = (list: number[]): ScoreObjItemCell<number> => {
      if (list.length === 0) {
        return { ave: 0, max: 0, min: 0, diff: 0 };
      }
      const ave = Number(
        (list.reduce((p, c) => p + c, 0) / list.length).toFixed(2),
      );
      const max = Math.max(...list);
      const min = Math.min(...list);
      const diff = Number((max - min).toFixed(2));
      return { ave, max, min, diff };
    };

    const postList: SamePostListItem[] = [];

    for (const [post, list] of result.entries() as IterableIterator<
      [string, ScoreYearItem[]]
    >) {
      if (list.length > 1) {
        postList.push({
          post,
          2022: {
            list: list.filter((item) => item.year === '2022'),
            ...getDataOperateObj(
              list.filter((item) => item.year === '2022').map((i) => i.score),
            ),
          },
          2023: {
            list: list.filter((item) => item.year === '2023'),
            ...getDataOperateObj(
              list.filter((item) => item.year === '2023').map((i) => i.score),
            ),
          },
          2024: {
            list: list.filter((item) => item.year === '2024'),
            ...getDataOperateObj(
              list.filter((item) => item.year === '2024').map((i) => i.score),
            ),
          },
          ave: Number(
            (list.reduce((p, c) => p + c.score, 0) / list.length).toFixed(2),
          ),
        });
      }
    }

    setSamePostList(postList);
  });

  useMount(() => {
    merge();
  });

  const samePostFilterList = useCreation(() => {
    return samePostList
      .filter((item) => {
        return item.post.includes(postInput);
        // &&
        // ((item['2022'].list.length > 0 && item['2023'].list.length > 0) ||
        //   (item['2022'].list.length > 0 && item['2024'].list.length > 0) ||
        //   (item['2023'].list.length > 0 && item['2024'].list.length > 0) ||
        //   (item['2022'].list.length > 0 &&
        //     item['2023'].list.length > 0 &&
        //     item['2024'].list.length > 0))
      })
      .sort((a, b) => (listSort === 'asc' ? a.ave - b.ave : b.ave - a.ave));
  }, [samePostList, postInput, listSort]);

  const [showList, setShowList] = useSafeState(false);

  return (
    <div>
      <ConditionComponent condition={!showList}>
        <div className="sk-ly-post-wrapper">
          <div className="sk-ly-post">
            <Typography.Title level={2} className="sk-ly-post__title">
              报考岗位建议
              <span className="sk-ly-post__title-aside">
                （洛阳市2022-2024）
              </span>
            </Typography.Title>
            <Input.Search
              className="sk-ly-post__input"
              placeholder="请输入你心仪的岗位"
              enterButton="搜索"
              onSearch={(value) => {
                setShowList(true);
                setPostInput(value);
              }}
              size="large"
            />
          </div>
        </div>
      </ConditionComponent>

      <ConditionComponent condition={showList}>
        <>
          <Typography.Text className="top-bar">
            <RollbackOutlined
              onClick={() => {
                setShowList(false);
                setPostInput('');
              }}
            />
          </Typography.Text>
          <IfElseComponent
            condition={samePostFilterList.length > 0}
            if={
              <div className="history-score-list">
                {samePostFilterList.map((item, idx) => {
                  return (
                    <div className="history-score-list__item" key={idx}>
                      <Typography.Title level={5} className="history-score-list__item-title">
                        {item.post}
                      </Typography.Title>
                      <div className="history-score-list__item-content">
                        <div className="history-score-list__item-cell history-score-list__item-cell-ave">
                          <Typography.Text className="history-score-list__item-content__year">
                            平均分
                          </Typography.Text>
                          <Typography.Title level={3} className="history-score-list__item-content__score score">
                            {item.ave}
                          </Typography.Title>
                        </div>
                        <ScoreShowItem year="2022" score={item['2022']} />
                        <ScoreShowItem year="2023" score={item['2023']} />
                        <ScoreShowItem year="2024" score={item['2024']} />
                      </div>
                    </div>
                  );
                })}
              </div>
            }
            else={<div className="no-data">
              <CoffeeOutlined />
              <span className="no-data__text">暂无数据</span>
            </div>}
          />
        </>
      </ConditionComponent>
    </div>
  );

  // return (
  //   <div className="shengkao-luoyang-container">
  //     <Line
  //       {...{
  //         xField: 'year',
  //         yField: 'value',
  //         data: [
  //           {
  //             year: '2022',
  //             value: Number(
  //               (
  //                 score2022
  //                   .map((item) => item.score)
  //                   .reduce((p, c) => p + c, 0) / score2022.length
  //               ).toFixed(2),
  //             ),
  //           },
  //           {
  //             year: '2023',
  //             value: Number(
  //               (
  //                 score2023
  //                   .map((item) => item.score)
  //                   .reduce((p, c) => p + c, 0) / score2023.length
  //               ).toFixed(2),
  //             ),
  //           },
  //           {
  //             year: '2024',
  //             value: Number(
  //               (
  //                 score2024
  //                   .map((item) => item.score)
  //                   .reduce((p, c) => p + c, 0) / score2024.length
  //               ).toFixed(2),
  //             ),
  //           },
  //         ],
  //         tooltip: false,
  //         label: {
  //           text: 'value',
  //           transform: [{ type: 'overlapDodgeY' }],
  //           fill: '#fff',
  //           fillOpacity: 1,
  //         },
  //         title: {
  //           title: '2022-2024年进面平均分',
  //           titleFill: '#fff',
  //         },
  //         axis: {
  //           x: {
  //             lineStroke: '#fff',
  //             tickStroke: '#fff',
  //             labelFill: '#fff',
  //           },
  //           y: {
  //             lineStroke: '#fff',
  //             tickStroke: '#fff',
  //             labelFill: '#fff',
  //           },
  //         },
  //         height: 250,
  //         className: 'history-score-chart',
  //         colorField: ['#fff'],
  //       }}
  //     />
  //     <div className="filter-line">
  //       <span>岗位查找</span>
  //       <input
  //         className="input"
  //         placeholder="输入职位名称"
  //         value={postInput}
  //         onChange={(e) => setPostInput(e.target.value)}
  //       />
  //       {listSort === 'asc' ? (
  //         <a className="list-sort-toggle" onClick={toggleListSort}>
  //           ↓ 平均分从高到低排列
  //         </a>
  //       ) : (
  //         <a className="list-sort-toggle" onClick={toggleListSort}>
  //           ↑ 平均分从低到高排列
  //         </a>
  //       )}
  //     </div>
  //     <div className="history-score-list">
  //       {samePostFilterList.map((item, idx) => {
  //         return (
  //           <div className="history-score-list__item" key={idx}>
  //             <div className="history-score-list__item-title">{item.post}</div>
  //             <div className="history-score-list__item-content">
  //               <div className="history-score-list__item-cell history-score-list__item-cell-ave">
  //                 <span className="history-score-list__item-content__year">
  //                   平均分
  //                 </span>
  //                 <span className="history-score-list__item-content__score">
  //                   {item.ave}
  //                 </span>
  //               </div>
  //               {item['2022'].list.length > 0 && (
  //                 <div className="history-score-list__item-cell">
  //                   <span className="history-score-list__item-content__year">
  //                     2022
  //                   </span>
  //                   <span className="history-score-list__item-content__score">
  //                     {item['2022'].ave}
  //                   </span>
  //                 </div>
  //               )}
  //               {item['2023'].list.length > 0 && (
  //                 <div className="history-score-list__item-cell">
  //                   <span className="history-score-list__item-content__year">
  //                     2023
  //                   </span>
  //                   <span className="history-score-list__item-content__score">
  //                     {item['2023'].ave}
  //                   </span>
  //                 </div>
  //               )}
  //               {item['2024'].list.length > 0 && (
  //                 <div className="history-score-list__item-cell">
  //                   <span className="history-score-list__item-content__year">
  //                     2024
  //                   </span>
  //                   <span className="history-score-list__item-content__score">
  //                     {item['2024'].ave}
  //                   </span>
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
};

export default Index;
