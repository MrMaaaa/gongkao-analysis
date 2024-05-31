import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMemoizedFn, useSafeState, useMount, useCreation } from 'ahooks';
import cls from 'classnames';
import { Scatter } from '@ant-design/plots';
import ConditionComponent from '@/components/condition-component';
import { ScoreFullItem, ScoreObjItemCell } from '@/interface';
import { readJSON } from '@/utils';
import './index.scss';

interface ScoreObjItem {
  score: ScoreObjItemCell<ScoreFullItem>;
  shenlun: ScoreObjItemCell<ScoreFullItem>;
  xingce: ScoreObjItemCell<ScoreFullItem>;
  gongan: ScoreObjItemCell<ScoreFullItem>;
}

interface PostsItem extends ScoreObjItem {
  postId: string;
  post: string;
  list: ScoreFullItem[];
}

interface PostData {
  diff: {
    score: {
      max?: PostsItem;
      min?: PostsItem;
    };
    xingce: {
      max?: PostsItem;
      min?: PostsItem;
    };
    shenlun: {
      max?: PostsItem;
      min?: PostsItem;
    };
    gongan: {
      max?: PostsItem;
      min?: PostsItem;
    };
  };
  ave: {
    score: {
      max?: PostsItem;
      min?: PostsItem;
    };
    xingce: {
      max?: PostsItem;
      min?: PostsItem;
    };
    shenlun: {
      max?: PostsItem;
      min?: PostsItem;
    };
    gongan: {
      max?: PostsItem;
      min?: PostsItem;
    };
  };
}

interface ScoreObj extends ScoreObjItem {
  postData: PostData;
  posts: {
    [id: string]: PostsItem;
  };
}

interface ScoreRankInPosts {
  topRank: number;
  postInfo: ScoreFullItem[];
}

const ScoreSection: React.FC<{
  score: string | number | undefined;
  suffix?: string;
}> = ({ score = '', suffix = '分' }) => {
  if (score === undefined) return null;
  if (suffix === '分') {
    score = Number(score || '0').toFixed(2);
  }

  return (
    <span className="score-section">
      <span
        className={cls({
          'score-section__score': true,
          'score-section__score-no-width': suffix === '个' || suffix === '名',
        })}
      >
        {score}
      </span>
      {!!suffix && <span className="score-section__suffix">{suffix}</span>}
    </span>
  );
};

const ScoreRange: React.FC<{
  scorePrev: string | number | undefined;
  scoreAfter: string | number | undefined;
  suffix?: string;
}> = ({ scorePrev, scoreAfter, suffix = '分' }) => {
  if (scorePrev === undefined || scoreAfter === undefined) return null;

  return (
    <span className="score-range">
      <ScoreSection score={scorePrev} suffix={suffix} />
      <span className="score-range__split">-</span>
      <ScoreSection score={scoreAfter} suffix={suffix} />
    </span>
  );
};

const App: React.FC = () => {
  const routerParams = useParams();
  const [list, setList] = useSafeState<ScoreFullItem[]>([]);
  const [filterData, setFilterData] = useSafeState<ScoreObj>({
    score: {
      max: undefined,
      min: undefined,
      ave: 0,
      diff: 0,
    },
    xingce: {
      max: undefined,
      min: undefined,
      ave: 0,
      diff: 0,
    },
    shenlun: {
      max: undefined,
      min: undefined,
      ave: 0,
      diff: 0,
    },
    gongan: {
      max: undefined,
      min: undefined,
      ave: 0,
      diff: 0,
    },
    postData: {
      diff: {
        score: {},
        xingce: {},
        shenlun: {},
        gongan: {},
      },
      ave: {
        score: {},
        xingce: {},
        shenlun: {},
        gongan: {},
      },
    },
    posts: {},
  });

  const transOriginList = useMemoizedFn((originList: ScoreFullItem[]) => {
    const scoreTypeList = [
      'score',
      'xingce',
      'shenlun',
      'gongan',
    ] as (keyof ScoreObjItem)[];

    const obj: ScoreObj = {
      score: {
        max: undefined,
        min: undefined,
        ave: 0,
        diff: 0,
      },
      xingce: {
        max: undefined,
        min: undefined,
        ave: 0,
        diff: 0,
      },
      shenlun: {
        max: undefined,
        min: undefined,
        ave: 0,
        diff: 0,
      },
      gongan: {
        max: undefined,
        min: undefined,
        ave: 0,
        diff: 0,
      },
      postData: {
        diff: {
          score: {},
          xingce: {},
          shenlun: {},
          gongan: {},
        },
        ave: {
          score: {},
          xingce: {},
          shenlun: {},
          gongan: {},
        },
      },
      posts: {},
    };

    const sumValue = {
      score: 0,
      xingce: 0,
      shenlun: 0,
      gongan: 0,
    };
    originList.forEach((ori) => {
      // 获取总成绩、行测、申论、公安的最高、最低分
      scoreTypeList.forEach((item) => {
        if (!obj[item] || !ori[item]) return;
        sumValue[item] += ori[item];
        if (
          (!obj[item].max && ori[item]) ||
          ori[item] > obj[item].max?.[item]!
        ) {
          obj[item].max = ori;
        }
        if (
          (!obj[item].min && ori[item] !== 0) ||
          (ori[item] !== 0 && ori[item] < obj[item].min?.[item]!)
        ) {
          obj[item].min = ori;
        }
      });

      if (!obj.posts[ori.postId]) {
        obj.posts[ori.postId] = {
          postId: ori.postId,
          post: ori.post,
          list: [ori],
          score: {
            max: undefined,
            min: undefined,
            ave: 0,
            diff: 0,
          },
          xingce: {
            max: undefined,
            min: undefined,
            ave: 0,
            diff: 0,
          },
          shenlun: {
            max: undefined,
            min: undefined,
            ave: 0,
            diff: 0,
          },
          gongan: {
            max: undefined,
            min: undefined,
            ave: 0,
            diff: 0,
          },
        };
      } else {
        obj.posts[ori.postId].list.push({ ...ori });
      }
    });

    scoreTypeList.forEach((key) => {
      if (obj[key]) {
        // 获取总成绩、行测、申论、公安的平均分
        obj[key].ave = Number((sumValue[key] / originList.length).toFixed(2));
        // 获取总成绩、行测、申论、公安的波动值
        obj[key].diff = Number(
          (obj[key].max?.[key]! - obj[key].min?.[key]!).toFixed(2),
        );
      }
    });

    Object.keys(obj.posts).forEach((item) => {
      const curr = obj.posts[item];
      curr?.list.forEach((el) => {
        const sumValue = {
          score: 0,
          xingce: 0,
          shenlun: 0,
          gongan: 0,
        };

        scoreTypeList.forEach((key) => {
          if (!curr[key] || !el[key]) return;
          // 获取各岗位总成绩、行测、申论、公安的分数和
          sumValue[key] = curr.list.reduce((prev, curr) => {
            return prev + curr[key];
          }, 0);

          // 获取总成绩、行测、申论、公安的最高、最低分
          if (
            (!curr[key]?.max && el[key] !== 0) ||
            el[key] > curr[key].max?.[key]!
          ) {
            curr[key].max = el;
          }
          if (
            (!curr[key]?.min && el[key] !== 0) ||
            (el[key] !== 0 && el[key] < curr[key].min?.[key]!)
          ) {
            curr[key].min = el;
          }

          // 获取总成绩、行测、申论、公安的平均分
          curr[key]!.ave = Number(
            (sumValue[key] / curr.list.length).toFixed(2),
          );

          // 获取总成绩、行测、申论、公安的波动值
          if (curr[key].max !== undefined && curr[key].min !== undefined) {
            curr[key].diff = Number(
              (curr[key].max![key] - curr[key].min![key]).toFixed(2),
            );
          }
        });
      });

      // 计算波动最大最小与平均分最高最低的岗位
      scoreTypeList.forEach((key) => {
        if (
          !obj.postData.diff[key].max ||
          (curr[key].diff > obj.postData.diff[key].max?.[key].diff! &&
            curr.list.length > 1)
        ) {
          obj.postData.diff[key].max = curr;
        }

        if (
          !obj.postData.diff[key].min ||
          (curr[key].diff < obj.postData.diff[key].min?.[key].diff! &&
            curr.list.length > 1)
        ) {
          obj.postData.diff[key].min = curr;
        }

        if (
          !obj.postData.ave[key].max ||
          (curr[key].ave > obj.postData.ave[key].max?.[key].ave! &&
            curr.list.length > 1)
        ) {
          obj.postData.ave[key].max = curr;
        }

        if (
          !obj.postData.ave[key].min ||
          (curr[key].ave < obj.postData.ave[key].min?.[key].ave! &&
            curr.list.length > 1)
        ) {
          obj.postData.ave[key].min = curr;
        }
      });
    });
    setFilterData(obj);
  });

  const [xingce, setXingce] = useSafeState('61.6');
  const [shenlun, setShenlun] = useSafeState('57.5');
  const [selectedPostId, setSelectedPostId] = useSafeState('13147022');
  const [userResult, setUserResult] = useSafeState<{
    userScore: number;
    scoreRankAmount: string;
    scoreAmountSum: number;
    xingceRankAmount: string;
    xingceAmountSum: number;
    shenlunRankAmount: string;
    shenlunAmountSum: number;
    passPostNames: string[];
    noPassPostNames: string[];
    scoreRankInPosts: ScoreRankInPosts;
  }>({
    userScore: 0,
    scoreRankAmount: '',
    scoreAmountSum: -1,
    xingceRankAmount: '',
    xingceAmountSum: -1,
    shenlunRankAmount: '',
    shenlunAmountSum: -1,
    passPostNames: [],
    noPassPostNames: [],
    scoreRankInPosts: {
      topRank: Number.MAX_SAFE_INTEGER,
      postInfo: [],
    },
  });

  const postCount = useCreation(() => {
    return Object.keys(filterData.posts).length;
  }, [filterData]);

  const examineeCount = useCreation(() => {
    return list.length;
  }, [list]);

  const getRankAmount = useMemoizedFn<
    (rank: string | number, total: number) => string
  >((rank, total) => {
    return ((Number(rank || 0) / total || 1) * 100).toFixed(2);
  });

  const generateUserResult = useMemoizedFn(() => {
    const xingce_n = Number(xingce);
    const shenlun_n = Number(shenlun);
    const userScore = Number(((xingce_n + shenlun_n) / 2).toFixed(2));
    let scoreOverSum = 0,
      xingceOverSum = 0,
      shenlunOverSum = 0,
      totalPerson = list.length,
      passPostNames: string[] = [],
      noPassPostNames: string[] = [];
    list.forEach((item) => {
      if (userScore > item.score) {
        scoreOverSum += 1;
      }
      if (xingce_n > item.xingce) {
        xingceOverSum += 1;
      }
      if (shenlun_n > item.shenlun) {
        shenlunOverSum += 1;
      }
    });
    Object.values(filterData.posts).forEach((item) => {
      if (!!item?.score?.min) {
        if (userScore > item.score.min.score) {
          passPostNames.push(item.post);
        } else {
          noPassPostNames.push(item.post);
        }
      }
    });

    const scoreRankInPosts = getScoreRankInPosts(userScore);

    setUserResult({
      userScore,
      scoreRankAmount: getRankAmount(totalPerson - scoreOverSum, totalPerson),
      scoreAmountSum: scoreOverSum,
      xingceRankAmount: getRankAmount(totalPerson - xingceOverSum, totalPerson),
      xingceAmountSum: xingceOverSum,
      shenlunRankAmount: getRankAmount(
        totalPerson - shenlunOverSum,
        totalPerson,
      ),
      shenlunAmountSum: shenlunOverSum,
      passPostNames,
      noPassPostNames,
      scoreRankInPosts,
    });
  });

  const getScoreRankInPosts = useMemoizedFn<
    (score: number) => ScoreRankInPosts
  >((score) => {
    let result: ScoreRankInPosts = {
      topRank: Number.MAX_SAFE_INTEGER,
      postInfo: [],
    };
    Object.values(filterData.posts).forEach((item) => {
      const list = item.list.sort((a, b) => b.score - a.score);
      for (let i = 0; i < list.length - 1; i++) {
        if (score > list[i].score) {
          if (i + 1 < result.topRank) {
            result.topRank = i + 1;
            result.postInfo = [list[i]];
          } else if (i + 1 === result.topRank) {
            result.postInfo.push(list[i]);
          }
        }
      }
    });

    return result;
  });

  useMount(() => {
    const list = readJSON(
      () => require(`@/files/score-shengkao-${routerParams.city}-${routerParams.year}.json`),
    );
    setList(list);
    transOriginList(list);
  });

  useEffect(() => {
    if (!Number.isNaN(xingce) && !Number.isNaN(shenlun)) {
      generateUserResult();
    }
  }, [xingce, shenlun, filterData]);

  const [postRankInfo, setPostRankInfo] = useSafeState<
    Partial<PostsItem> & {
      postRankAmount: string;
      postRank: string;
    }
  >({
    postRankAmount: '',
    postRank: '',
  });
  const getPostRankInPosts = useMemoizedFn(() => {
    const selectedPostInfo = filterData.posts[selectedPostId];
    const selectedPostRank = (Object.values(filterData.posts) as PostsItem[])
      .sort((a, b) => b.score.ave - a.score.ave)
      .findIndex((item) => item.postId === selectedPostId);

    setPostRankInfo({
      ...selectedPostInfo,
      postRankAmount: getRankAmount(selectedPostRank + 1, postCount),
      postRank: selectedPostRank + 1 + '',
    });
  });

  useEffect(() => {
    getPostRankInPosts();
  }, [selectedPostId, filterData]);

  const onlyTotal = useCreation(() => {
    return !filterData.score.max?.xingce;
  }, [filterData.score.max?.xingce]);

  return (
    <div className="analysis-container">
      <div>
        <div className="title">进面分数</div>
        <div className="group">
          最高分：
          <ScoreSection score={filterData.score.max?.score} />
          <ConditionComponent condition={!onlyTotal}>
            <>
              ，行测最高
              <ScoreSection score={filterData.score.max?.xingce} />
            </>
          </ConditionComponent>
          <ConditionComponent condition={!onlyTotal}>
            <>
              ，申论最高
              <ScoreSection score={filterData.score.max?.shenlun} />
            </>
          </ConditionComponent>
        </div>
        <div className="group">
          最低分：
          <ScoreSection score={filterData.score.min?.score} />
          <ConditionComponent condition={!onlyTotal}>
            <>
              ，行测最低
              <ScoreSection score={filterData.score.min?.xingce} />
            </>
          </ConditionComponent>
          <ConditionComponent condition={!onlyTotal}>
            <>
              ，申论最低
              <ScoreSection score={filterData.score.min?.shenlun} />
            </>
          </ConditionComponent>
        </div>
        <div className="group">
          平均分：
          <ScoreSection score={filterData.score.ave} />
          <ConditionComponent condition={!onlyTotal}>
            <>
              ，行测平均
              <ScoreSection score={filterData.xingce.ave} />
            </>
          </ConditionComponent>
          <ConditionComponent condition={!onlyTotal}>
            <>
              ，申论平均
              <ScoreSection score={filterData.shenlun.ave} />
            </>
          </ConditionComponent>
        </div>
        <div className="title">岗位情况</div>
        <div className="group">
          总分波动最大相差
          <ScoreSection
            score={filterData.postData.diff.score.max?.score.diff}
          />
          (
          <ScoreRange
            scorePrev={filterData.postData.diff.score.max?.score.max?.score}
            scoreAfter={filterData.postData.diff.score.max?.score.min?.score}
          />
          ) ，岗位：
          <span className="post-name">
            {filterData.postData.diff.score.max?.post}
          </span>
        </div>
        <ConditionComponent condition={!onlyTotal}>
          <div className="group">
            行测波动最大相差
            <ScoreSection
              score={filterData.postData.diff.xingce.max?.xingce.diff}
            />
            (
            <ScoreRange
              scorePrev={
                filterData.postData.diff.xingce.max?.xingce.max?.xingce
              }
              scoreAfter={
                filterData.postData.diff.xingce.max?.xingce.min?.xingce
              }
            />
            ) ，岗位：
            <span className="post-name">
              {filterData.postData.diff.xingce.max?.post}
            </span>
          </div>
        </ConditionComponent>
        <ConditionComponent condition={!onlyTotal}>
          <div className="group">
            申论波动最大相差
            <ScoreSection
              score={filterData.postData.diff.shenlun.max?.shenlun.diff}
            />
            (
            <ScoreRange
              scorePrev={
                filterData.postData.diff.shenlun.max?.shenlun.max?.shenlun
              }
              scoreAfter={
                filterData.postData.diff.shenlun.max?.shenlun.min?.shenlun
              }
            />
            ) ，岗位：
            <span className="post-name">
              {filterData.postData.diff.shenlun.max?.post}
            </span>
          </div>
        </ConditionComponent>
        <div className="group">
          总分波动最小相差
          <ScoreSection
            score={filterData.postData.diff.score.min?.score.diff}
          />
          (
          <ScoreRange
            scorePrev={filterData.postData.diff.score.min?.score.max?.score}
            scoreAfter={filterData.postData.diff.score.min?.score.min?.score}
          />
          ) ，岗位：
          <span className="post-name">
            {filterData.postData.diff.score.min?.post}
          </span>
        </div>
        <ConditionComponent condition={!onlyTotal}>
          <div className="group">
            行测波动最小相差
            <ScoreSection
              score={filterData.postData.diff.xingce.min?.xingce.diff}
            />
            (
            <ScoreRange
              scorePrev={
                filterData.postData.diff.xingce.min?.xingce.max?.xingce
              }
              scoreAfter={
                filterData.postData.diff.xingce.min?.xingce.min?.xingce
              }
            />
            ) ，岗位：
            <span className="post-name">
              {filterData.postData.diff.xingce.min?.post}
            </span>
          </div>
        </ConditionComponent>
        <ConditionComponent condition={!onlyTotal}>
          <div className="group">
            申论波动最小相差
            <ScoreSection
              score={filterData.postData.diff.shenlun.min?.shenlun.diff}
            />
            (
            <ScoreRange
              scorePrev={
                filterData.postData.diff.shenlun.min?.shenlun.max?.shenlun
              }
              scoreAfter={
                filterData.postData.diff.shenlun.min?.shenlun.min?.shenlun
              }
            />
            ) ，岗位：
            <span className="post-name">
              {filterData.postData.diff.shenlun.min?.post}
            </span>
          </div>
        </ConditionComponent>
        <div className="group">
          竞争最激烈平均分
          <ScoreSection score={filterData.postData.ave.score.max?.score.ave} />
          {/* ，行测最高分
              <ScoreSection
                score={filterData.postData.ave.score.max?.xingce.max?.xingce}
              />
              ，最低分
              <ScoreSection
                score={filterData.postData.ave.score.max?.xingce.min?.xingce}
              />
              ，平均分
              <ScoreSection
                score={filterData.postData.ave.score.max?.xingce.ave}
              />
              ，申论最高分
              <ScoreSection
                score={filterData.postData.ave.score.max?.shenlun.max?.shenlun}
              />
              ，最低分
              <ScoreSection
                score={filterData.postData.ave.score.max?.xingce.min?.xingce}
              />
              ，平均分
              <ScoreSection
                score={filterData.postData.ave.score.max?.xingce.ave}
              /> */}
          ，岗位：
          <span className="post-name">
            {filterData.postData.ave.score.max?.post}
          </span>
        </div>
        <div className="group">
          竞争最温和平均分
          <ScoreSection score={filterData.postData.ave.score.min?.score.ave} />
          {/* ， 行测最高分
              <ScoreSection
                score={filterData.postData.ave.score.min?.xingce.max?.xingce}
              />
              ，最低分
              <ScoreSection
                score={filterData.postData.ave.score.min?.xingce.min?.xingce}
              />
              ，平均分
              <ScoreSection
                score={filterData.postData.ave.score.min?.xingce.ave}
              />
              ，申论最高分
              <ScoreSection
                score={filterData.postData.ave.score.min?.shenlun.max?.shenlun}
              />
              ，最低分
              <ScoreSection
                score={filterData.postData.ave.score.min?.xingce.min?.xingce}
              />
              ，平均分
              <ScoreSection
                score={filterData.postData.ave.score.min?.xingce.ave}
              /> */}
          ，岗位：
          <span className="post-name">
            {filterData.postData.ave.score.min?.post}
          </span>
        </div>
        <div className="title">我的成绩</div>
        <div className="group">
          行测：
          <input
            className="input score-section__input"
            type="text"
            value={xingce}
            onChange={(e) => setXingce(e.target.value)}
          />
          申论：
          <input
            className="input score-section__input"
            type="text"
            value={shenlun}
            onChange={(e) => setShenlun(e.target.value)}
          />
          总成绩：
          <input
            className="input score-section__input"
            type="text"
            value={userResult.userScore}
            disabled
          />
          {/* <ScoreSection score={userResult.userScore} /> */}
        </div>
        <div className="group">
          在进入面试的
          <ScoreSection score={examineeCount} suffix={'名'} />
          考生中
        </div>
        <div className="group">
          总分超过了
          <ScoreSection score={userResult.scoreAmountSum} suffix={'人'} />
          ，排名前
          <ScoreSection score={userResult.scoreRankAmount} suffix={'%'} />
        </div>
        <ConditionComponent condition={!onlyTotal}>
          <div className="group">
            行测超过了
            <ScoreSection score={userResult.xingceAmountSum} suffix={'人'} />
            ，排名前
            <ScoreSection score={userResult.xingceRankAmount} suffix={'%'} />
          </div>
        </ConditionComponent>
        <ConditionComponent condition={!onlyTotal}>
          <div className="group">
            申论超过了
            <ScoreSection score={userResult.shenlunAmountSum} suffix={'人'} />
            ，排名前
            <ScoreSection score={userResult.shenlunRankAmount} suffix={'%'} />
          </div>
        </ConditionComponent>
        <div className="group">
          可以在
          <ScoreSection score={userResult.passPostNames.length} suffix={'个'} />
          岗位进入面试，无缘
          <ScoreSection
            score={userResult.noPassPostNames.length}
            suffix={'个'}
          />
          岗位，在
          <ScoreSection
            score={userResult.scoreRankInPosts.postInfo.length}
            suffix={'个'}
          />
          岗位名次最高，位列
          <ScoreSection
            score={userResult.scoreRankInPosts.topRank}
            suffix={'名'}
          />
        </div>
        <div className="group">
          岗位代码：
          <input
            className="input score-section__input score-section__input-post"
            type="text"
            value={selectedPostId}
            onChange={(e) => setSelectedPostId(e.target.value)}
          />
          ， 你选择的岗位是：
          <span className="post-name">{postRankInfo.post}</span>
        </div>
        <div className="group">
          平均分
          <ScoreSection score={postRankInfo.score?.ave} suffix={''} />
          ，最高分
          <ScoreSection score={postRankInfo.score?.max?.score} suffix={''} />
          ，最低分
          <ScoreSection score={postRankInfo.score?.min?.score} suffix={''} />
          ，平均分在全部
          <ScoreSection score={postCount} suffix={'个'} />
          岗位中排名
          <ScoreSection score={postRankInfo.postRank} suffix={'名'} />
          ，位列前
          <ScoreSection score={postRankInfo.postRankAmount} suffix={'%'} />
        </div>
      </div>
      <Scatter
        {...{
          yField: 'shenlun',
          xField: 'xingce',
          data: [
            ...list.map((item) => ({
              no: item.id,
              xingce: item.xingce,
              shenlun: item.shenlun,
            })),
          ],
          tooltip: {
            items: [
              { field: 'xingce', channel: 'xingce', name: '行测' },
              { field: 'shenlun', channel: 'shenlun', name: '申论' },
            ],
          },
          title: {
            title: '成绩分布散点气泡图',
            style: {
              titleFill: '#fff',
            },
          },
          axis: {
            x: {
              lineStroke: '#fff',
              tickStroke: '#fff',
              tickStrokeOpacity: 1,
              labelFill: '#fff',
              // labelFontSize: 30,
              labelFillOpacity: 1,
              title: '行测分数',
              titleFill: '#fff',
              // titleFontSize: 30,
            },
            y: {
              lineStroke: '#fff',
              tickStroke: '#fff',
              tickStrokeOpacity: 1,
              // labelFontSize: 30,
              labelFillOpacity: 1,
              labelFill: '#fff',
              title: '申论分数',
              titleFill: '#fff',
              // titleFontSize: 30,
            },
          },
          annotations: [
            {
              type: 'lineX',
              xField: 59.97,
              style: { stroke: '#F4664A', strokeOpacity: 1, lineWidth: 1 },
            },
            {
              type: 'lineY',
              yField: 68.07,
              style: { stroke: '#F4664A', strokeOpacity: 1, lineWidth: 1 },
            },
          ],
        }}
      />
    </div>
  );
};

export default App;
