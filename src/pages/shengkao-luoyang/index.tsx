import { useCreation, useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { Line } from '@ant-design/plots';
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

const Index = () => {
  const [samePostList, setSamePostList] = useSafeState<SamePostListItem[]>([]);
  const [postInput, setPostInput] = useSafeState('');
  const [listSort, setListSort] = useSafeState<'asc' | 'desc'>('desc');
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
      const ave = Number(
        (list.reduce((p, c) => p + c, 0) / list.length).toFixed(2),
      );
      const max = Math.max(...list);
      const min = Math.min(...list);
      const diff = max - min;
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
        return (
          item.post.includes(postInput) &&
          ((item['2022'].list.length > 0 && item['2023'].list.length > 0) ||
            (item['2022'].list.length > 0 && item['2024'].list.length > 0) ||
            (item['2023'].list.length > 0 && item['2024'].list.length > 0) ||
            (item['2022'].list.length > 0 &&
              item['2023'].list.length > 0 &&
              item['2024'].list.length > 0))
        );
      })
      .sort((a, b) => (listSort === 'asc' ? a.ave - b.ave : b.ave - a.ave));
  }, [samePostList, postInput, listSort]);

  return (
    <div className="shengkao-luoyang-container">
      <Line
        {...{
          xField: 'year',
          yField: 'value',
          data: [
            {
              year: '2022',
              value: Number(
                (
                  score2022
                    .map((item) => item.score)
                    .reduce((p, c) => p + c, 0) / score2022.length
                ).toFixed(2),
              ),
            },
            {
              year: '2023',
              value: Number(
                (
                  score2023
                    .map((item) => item.score)
                    .reduce((p, c) => p + c, 0) / score2023.length
                ).toFixed(2),
              ),
            },
            {
              year: '2024',
              value: Number(
                (
                  score2024
                    .map((item) => item.score)
                    .reduce((p, c) => p + c, 0) / score2024.length
                ).toFixed(2),
              ),
            },
          ],
          tooltip: false,
          label: {
            text: 'value',
            transform: [{ type: 'overlapDodgeY' }],
            fill: '#fff',
            fillOpacity: 1,
          },
          title: {
            title: '2022-2024年进面平均分',
            titleFill: '#fff',
          },
          axis: {
            x: {
              lineStroke: '#fff',
              tickStroke: '#fff',
              labelFill: '#fff',
            },
            y: {
              lineStroke: '#fff',
              tickStroke: '#fff',
              labelFill: '#fff',
            },
          },
          height: 250,
          className: 'history-score-chart',
          colorField: ['#fff'],
        }}
      />
      <div className="filter-line">
        <span>岗位查找</span>
        <input
          className="input"
          placeholder="输入职位名称"
          value={postInput}
          onChange={(e) => setPostInput(e.target.value)}
        />
        {listSort === 'asc' ? (
          <a className="list-sort-toggle" onClick={toggleListSort}>
            ↓ 平均分从高到低排列
          </a>
        ) : (
          <a className="list-sort-toggle" onClick={toggleListSort}>
            ↑ 平均分从低到高排列
          </a>
        )}
      </div>
      <div className="history-score-list">
        {samePostFilterList.map((item, idx) => {
          return (
            <div className="history-score-list__item" key={idx}>
              <div className="history-score-list__item-title">{item.post}</div>
              <div className="history-score-list__item-content">
                <div className="history-score-list__item-cell history-score-list__item-cell-ave">
                  <span className="history-score-list__item-content__year">
                    平均分
                  </span>
                  <span className="history-score-list__item-content__score">
                    {item.ave}
                  </span>
                </div>
                {item['2022'].list.length > 0 && (
                  <div className="history-score-list__item-cell">
                    <span className="history-score-list__item-content__year">
                      2022
                    </span>
                    <span className="history-score-list__item-content__score">
                      {item['2022'].ave}
                    </span>
                  </div>
                )}
                {item['2023'].list.length > 0 && (
                  <div className="history-score-list__item-cell">
                    <span className="history-score-list__item-content__year">
                      2023
                    </span>
                    <span className="history-score-list__item-content__score">
                      {item['2023'].ave}
                    </span>
                  </div>
                )}
                {item['2024'].list.length > 0 && (
                  <div className="history-score-list__item-cell">
                    <span className="history-score-list__item-content__year">
                      2024
                    </span>
                    <span className="history-score-list__item-content__score">
                      {item['2024'].ave}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
