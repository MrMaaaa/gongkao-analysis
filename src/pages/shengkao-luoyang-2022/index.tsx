import React, { useEffect } from 'react';
import { useMemoizedFn, useSafeState, useMount, useCreation } from 'ahooks';
import cls from 'classnames';
import { ScoreItem, ScoreObjItemCell } from '@/interface';
import scorejson from './score.json';
import './index.scss';



interface ScoreObjItem {
  score: ScoreObjItemCell;
}

interface PostsItem extends ScoreObjItem {
  postId: string;
  post: string;
  list: ScoreItem[];
}

interface PostData {
  diff: {
    score: {
      max?: PostsItem;
      min?: PostsItem;
    };
  };
  ave: {
    score: {
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
  postInfo: ScoreItem[];
}

const ScoreSection: React.FC<{
  score: string | number | undefined;
  suffix?: string;
}> = ({ score, suffix = '分' }) => {
  if (score === undefined) return null;
  if (suffix === '分') {
    score = Number(score).toFixed(2);
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
  const [list] = useSafeState<ScoreItem[]>(scorejson);
  const [filterData, setFilterData] = useSafeState<ScoreObj>({
    score: {
      max: undefined,
      min: undefined,
      ave: 0,
      diff: 0,
    },
    postData: {
      diff: {
        score: {},
      },
      ave: {
        score: {},
      },
    },
    posts: {},
  });

  const transOriginList = useMemoizedFn((originList: ScoreItem[]) => {
    const scoreTypeList = ['score'] as (keyof ScoreObjItem)[];

    const obj: ScoreObj = {
      score: {
        max: undefined,
        min: undefined,
        ave: 0,
        diff: 0,
      },
      postData: {
        diff: {
          score: {},
        },
        ave: {
          score: {},
        },
      },
      posts: {},
    };

    const sumValue = {
      score: 0,
    };
    originList.forEach((ori) => {
      // 获取总成绩的最高、最低分
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
  const [selectedPostId, setSelectedPostId] = useSafeState('13102012');
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
    scoreAmountSum: 0,
    xingceRankAmount: '',
    xingceAmountSum: 0,
    shenlunRankAmount: '',
    shenlunAmountSum: 0,
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
    return ((Number(rank) / total) * 100).toFixed(2);
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
      postRankAmount: getRankAmount(selectedPostRank, postCount),
      postRank: selectedPostRank + 1 + '',
    });
  });

  useEffect(() => {
    getPostRankInPosts();
  }, [selectedPostId, filterData]);

  return (
    <div className="container">
      <div>
        <div className="data-source-tips">
          数据来源：
          <a
            href="http://www.lysrsks.gov.cn/index/news/detail.html?id=623"
            target="_blank"
          >
            河南省2022年度统一考试录用公务员洛阳职位面试确认人员名单
          </a>
        </div>
        <div className="data-source-tips">
          注：因面试公告未公示行测申论分数，因此这里只显示总成绩相关数据
        </div>
        <div className="title">进面分数</div>
        <div className="group">
          最高分：
          <ScoreSection score={filterData.score.max?.score} />
        </div>
        <div className="group">
          最低分：
          <ScoreSection score={filterData.score.min?.score} />
        </div>
        <div className="group">
          平均分：
          <ScoreSection score={filterData.score.ave} />
        </div>
        <div className="title">岗位情况</div>
        <div className="group">
          总分波动最大岗位：
          <span className="post-name">
            {filterData.postData.diff.score.max?.post}
          </span>
          ，相差
          <ScoreSection
            score={filterData.postData.diff.score.max?.score.diff}
          />
          (
          <ScoreRange
            scorePrev={filterData.postData.diff.score.max?.score.max?.score}
            scoreAfter={filterData.postData.diff.score.max?.score.min?.score}
          />
          )
        </div>
        <div className="group">
          总分波动最小岗位：
          <span className="post-name">
            {filterData.postData.diff.score.min?.post}
          </span>
          ，相差
          <ScoreSection
            score={filterData.postData.diff.score.min?.score.diff}
          />
          (
          <ScoreRange
            scorePrev={filterData.postData.diff.score.min?.score.max?.score}
            scoreAfter={filterData.postData.diff.score.min?.score.min?.score}
          />
          )
        </div>
        <div className="group">
          竞争最激烈的岗位：
          <span className="post-name">
            {filterData.postData.ave.score.max?.post}
          </span>
          ，平均分：
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
        </div>
        <div className="group">
          竞争最温和的岗位：
          <span className="post-name">
            {filterData.postData.ave.score.min?.post}
          </span>
          ，平均分：
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
    </div>
  );
};

export default App;
