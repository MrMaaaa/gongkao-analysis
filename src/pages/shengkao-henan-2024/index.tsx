import React, { useEffect } from 'react';
import {
  useMemoizedFn,
  useSafeState,
  useMount,
  useCreation,
} from 'ahooks';
import cls from 'classnames';
import * as pdfjsLib from 'pdfjs-dist';
import './index.scss';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.1.392/pdf.worker.mjs';

interface ScoreItem {
  no: string;
  id: string;
  rank: string;
  name: string;
  post: string;
  postId: string;
  score: number;
  shenlun: number;
  xingce: number;
  gongan: number;
}

interface ScoreObjItemCell {
  max?: ScoreItem;
  min?: ScoreItem;
  ave: number;
  diff: number;
}

interface ScoreObjItem {
  score: ScoreObjItemCell;
  shenlun: ScoreObjItemCell;
  xingce: ScoreObjItemCell;
  gongan: ScoreObjItemCell;
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

enum ScoreItemKeys {
  '准考证号' = 'id',
  '名次' = 'rank',
  '姓名' = 'name',
  '序号' = 'no',
  '报考单位' = 'post',
  '职位代码' = 'postId',
  '总成绩' = 'score',
  '申论' = 'shenlun',
  '行测' = 'xingce',
  '公安' = 'gongan',
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

function App() {
  const [list, setList] = useSafeState<ScoreItem[]>(
    JSON.parse(localStorage.getItem('2024-luoyang') || '[]'),
  );
  const [listHeader, setListHeader] = useSafeState('');
  const [listTitle, setListTitle] = useSafeState<string[]>([]);
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

  const onFileChange = (evt: any) => {
    const pdfFile = evt.target.files[0];
    const reader = new FileReader();
    let titles: string[] = [];
    let pdfTexts: any[] = [];
    reader.readAsArrayBuffer(pdfFile);
    reader.addEventListener('loadend', (e) => {
      const loadingTask = pdfjsLib.getDocument(e.target?.result as ArrayBuffer);
      loadingTask.promise.then(async (doc) => {
        for (let idx = 1; idx <= doc.numPages; idx++) {
          const page = await doc.getPage(idx);
          const content = await page.getTextContent();
          const oriData = content.items
            .map((el: any) => el.str)
            .reduce((prev, curr) => {
              if (curr === ' ' || curr === '') {
                return prev;
              }
              if (
                curr === '（' ||
                curr === '参公' ||
                curr === '）' ||
                curr === '）（' ||
                curr === '洛阳市人民政府发展研究中心'
              ) {
                const last = prev.splice(-1);
                return [...prev, last + curr];
              }
              return [...prev, curr];
            });

          if (idx === 1) {
            const data = oriData.slice(15).slice(0, -7);
            setListHeader(oriData.slice(0, 5).join(''));
            titles = oriData.slice(5, 15);
            setListTitle(titles);
            pdfTexts = [...pdfTexts, ...data];
          } else {
            const data = oriData.slice(11).slice(0, -7);
            pdfTexts = [...pdfTexts, ...data];
          }
        }
        const formatData: any = [];
        for (let index = 0; index < pdfTexts.length; index += 10) {
          const data: any[] = pdfTexts.slice(index, index + 10);
          formatData.push(
            data.reduce((prev, curr, currIndex) => {
              const obj = {
                ...prev,
                [ScoreItemKeys[
                  titles[currIndex] as keyof typeof ScoreItemKeys
                ]]: curr,
              };

              obj.score = Number(obj.score);
              obj.xingce = Number(obj.xingce);
              obj.shenlun = Number(obj.shenlun);
              obj.gongan = Number(obj.gongan);
              return obj;
            }, {}),
          );
        }

        setList(formatData);

        localStorage.setItem('2024-luoyang', JSON.stringify(formatData));
      });
    });
  };

  const transOriginList = useMemoizedFn((originList: ScoreItem[]) => {
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

    console.log('filterData', obj);
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
    console.log('originList', list);
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
    <div className="App">
      <div className="container">
        {list.length > 0 ? (
          <div>
            <div className="data-source-tips">
              数据来源：河南省2024年度统一考试录用公务员洛阳职位面试确认人员名单
            </div>
            <div className="title">进面分数</div>
            <div className="group">
              最高分：
              <ScoreSection score={filterData.score.max?.score} />
              ，行测最高
              <ScoreSection score={filterData.score.max?.xingce} />
              ，申论最高
              <ScoreSection score={filterData.score.max?.shenlun} />
            </div>
            <div className="group">
              最低分：
              <ScoreSection score={filterData.score.min?.score} />
              ，行测最低
              <ScoreSection score={filterData.score.min?.xingce} />
              ，申论最低
              <ScoreSection score={filterData.score.min?.shenlun} />
            </div>
            <div className="group">
              平均分：
              <ScoreSection score={filterData.score.ave} />
              ，行测平均
              <ScoreSection score={filterData.xingce.ave} />
              ，申论平均
              <ScoreSection score={filterData.shenlun.ave} />
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
                scoreAfter={
                  filterData.postData.diff.score.max?.score.min?.score
                }
              />
              )
            </div>
            <div className="group">
              行测波动最大岗位：
              <span className="post-name">
                {filterData.postData.diff.xingce.max?.post}
              </span>
              ，相差
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
              )
            </div>
            <div className="group">
              申论波动最大岗位：
              <span className="post-name">
                {filterData.postData.diff.shenlun.max?.post}
              </span>
              ，相差
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
                scoreAfter={
                  filterData.postData.diff.score.min?.score.min?.score
                }
              />
              )
            </div>
            <div className="group">
              行测波动最小岗位：
              <span className="post-name">
                {filterData.postData.diff.xingce.min?.post}
              </span>
              ，相差
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
              )
            </div>
            <div className="group">
              申论波动最小岗位：
              <span className="post-name">
                {filterData.postData.diff.shenlun.min?.post}
              </span>
              ，相差
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
              )
            </div>
            <div className="group">
              竞争最激烈的岗位：
              <span className="post-name">
                {filterData.postData.ave.score.max?.post}
              </span>
              ，平均分：
              <ScoreSection
                score={filterData.postData.ave.score.max?.score.ave}
              />
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
              <ScoreSection
                score={filterData.postData.ave.score.min?.score.ave}
              />
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
              行测超过了
              <ScoreSection score={userResult.xingceAmountSum} suffix={'人'} />
              ，排名前
              <ScoreSection score={userResult.xingceRankAmount} suffix={'%'} />
            </div>
            <div className="group">
              申论超过了
              <ScoreSection score={userResult.shenlunAmountSum} suffix={'人'} />
              ，排名前
              <ScoreSection score={userResult.shenlunRankAmount} suffix={'%'} />
            </div>
            <div className="group">
              可以在
              <ScoreSection
                score={userResult.passPostNames.length}
                suffix={'个'}
              />
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
              <ScoreSection
                score={postRankInfo.score?.max?.score}
                suffix={''}
              />
              ，最低分
              <ScoreSection
                score={postRankInfo.score?.min?.score}
                suffix={''}
              />
              ，平均分在全部
              <ScoreSection score={postCount} suffix={'个'} />
              岗位中排名
              <ScoreSection score={postRankInfo.postRank} suffix={'名'} />
              ，位列前
              <ScoreSection score={postRankInfo.postRankAmount} suffix={'%'} />
            </div>
            {/* <header>
              <h3>{listHeader}</h3>
            </header>
            <div className="table-row">
              {listTitle.map((el) => (
                <span className="table-item">{el}</span>
              ))}
            </div>
            <div>
              {list.map((el) => {
                return (
                  <div key={el['准考证号']} className="table-row">
                    {Object.values(el).map((val) => (
                      <span className="table-item">{val}</span>
                    ))}
                  </div>
                );
              })}
            </div> */}
          </div>
        ) : (
          <input id="pdffile" type="file" onChange={onFileChange}></input>
        )}
      </div>
    </div>
  );
}

export default App;