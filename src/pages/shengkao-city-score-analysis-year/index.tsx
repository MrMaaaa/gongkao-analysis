import React, { useEffect } from 'react';
import cls from 'classnames';
import { useParams } from 'react-router-dom';
import { Select, InputNumber } from 'antd';
import { useMemoizedFn, useSafeState, useMount, useCreation } from 'ahooks';
import { Scatter } from '@ant-design/plots';
import IfElseComponent from '@/components/if-else-component';
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
  defaultValue?: string;
  noWidth?: boolean;
}> = ({ score = '', suffix = '分', defaultValue = '', noWidth = false }) => {
  if (score === undefined && !defaultValue && !suffix) return null;
  if (suffix === '分') {
    score = Number(score || '0').toFixed(2);
  }

  return (
    <span className="score-section">
      <span
        className={cls({
          'score-section__score': true,
          'score-section__score-no-width': noWidth,
        })}
      >
        <IfElseComponent
          condition={score === null || score === undefined}
          if={defaultValue}
          else={score}
        />
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

  const [xingce, setXingce] = useSafeState(61.6);
  const [shenlun, setShenlun] = useSafeState(57.5);
  const [selectedPostId, setSelectedPostId] = useSafeState('');
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

  const postList = useCreation(() => {
    return Object.values(filterData.posts).map((item) => ({
      post: item.post,
      postId: item.postId,
    }));
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
    const xingce_n = xingce;
    const shenlun_n = shenlun;
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
    const list = readJSON(() =>
      require(`@/files/score-shengkao-${routerParams.city}-${routerParams.year}.json`),
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
      <div className="section">
        <div className="title">
          <div className="title-text">进面分数</div>
        </div>
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
      </div>
      <div className="section">
        <div className="title">
          <div className="title-text">岗位情况</div>
        </div>
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
        <div className="group">
          <Select
            style={{ width: 300 }}
            showSearch
            options={postList}
            fieldNames={{ label: 'post', value: 'postId' }}
            onChange={setSelectedPostId}
            allowClear
            filterOption={(input, option) =>
              (option?.post ?? '').toLowerCase().includes(input.toLowerCase())
            }
            placeholder="请输入岗位名称"
          />
          <div className="group">
            平均分
            <ScoreSection
              score={postRankInfo.score?.ave}
              suffix=""
              defaultValue="-"
              noWidth
            />
            ，最高分
            <ScoreSection
              score={postRankInfo.score?.max?.score}
              suffix=""
              defaultValue="-"
              noWidth
            />
            ，最低分
            <ScoreSection
              score={postRankInfo.score?.min?.score}
              suffix=""
              defaultValue="-"
              noWidth
            />
            ，平均分在全部
            <ScoreSection score={postCount} suffix={'个'} noWidth />
            岗位中排名
            <ScoreSection score={postRankInfo.postRank} suffix={'名'} noWidth />
            ，位列前
            <ScoreSection
              score={postRankInfo.postRankAmount}
              suffix={'%'}
              noWidth
            />
          </div>
        </div>
      </div>
      <div className="section">
        <div className="title">
          <div className="title-text">我的成绩</div>
        </div>
        <div className="group">
          行测：
          <InputNumber
            className="input score-section__input"
            controls={false}
            value={xingce}
            onChange={(e) => setXingce(e || 0)}
            changeOnWheel
          />
          申论：
          <InputNumber
            className="input score-section__input"
            controls={false}
            value={shenlun}
            onChange={(e) => setShenlun(e || 0)}
            changeOnWheel
          />
          总成绩：
          <InputNumber
            className="input score-section__input"
            type="text"
            value={userResult.userScore}
            disabled
          />
          {/* <ScoreSection score={userResult.userScore} /> */}
        </div>
        <div className="group">
          在进入面试的
          <ScoreSection score={examineeCount} suffix={'名'} noWidth />
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
          <ScoreSection
            score={userResult.passPostNames.length}
            suffix={'个'}
            noWidth
          />
          岗位进入面试，无缘
          <ScoreSection
            score={userResult.noPassPostNames.length}
            suffix={'个'}
            noWidth
          />
          岗位，在
          <ScoreSection
            score={userResult.scoreRankInPosts.postInfo.length}
            suffix={'个'}
            noWidth
          />
          岗位名次最高，位列
          <ScoreSection
            score={userResult.scoreRankInPosts.topRank}
            suffix={'名'}
            noWidth
          />
        </div>
      </div>
      {/* <Scatter
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
      /> */}
    </div>
  );
};

export default App;
