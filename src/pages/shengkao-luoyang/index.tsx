import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { ScoreItem } from '@/interface';
import score2022 from '@/pages/shengkao-luoyang-2022/score.json';
import score2023 from '@/pages/shengkao-luoyang-2023/score.json';
import score2024 from '@/pages/shengkao-luoyang-2024/score.json';

const score = {
  '2022': score2022,
  '2023': score2023,
  '2024': score2024,
};

const Index = () => {
  const [samePostList, setSamePostList] = useSafeState<
    {
      post: string;
      ['2022']: ScoreItem[];
      ['2023']: ScoreItem[];
      ['2024']: ScoreItem[];
    }[]
  >([]);
  const merge = useMemoizedFn(() => {
    const result = new Map();

    Object.keys(score).forEach((year) => {
      score[year as '2022' | '2023' | '2024'].forEach((item: ScoreItem) => {
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

    const postList = [];

    for (const [post, list] of result.entries()) {
      if (list.length > 1) {
        postList.push({
          post,
          2022: list.filter((item: any) => item.year === '2022'),
          2023: list.filter((item: any) => item.year === '2023'),
          2024: list.filter((item: any) => item.year === '2024'),
        });
      }
    }

    setSamePostList(
      postList.filter((item) => {
        return (
          (item['2022'].length > 0 && item['2023'].length > 0) ||
          (item['2022'].length > 0 && item['2024'].length > 0) ||
          (item['2023'].length > 0 && item['2024'].length > 0) ||
          (item['2022'].length > 0 &&
            item['2023'].length > 0 &&
            item['2024'].length > 0)
        );
      }) as any,
    );
  });

  useMount(() => {
    merge();
  });
  return (
    <div>
      {samePostList.map((item, idx) => {
        return (
          <div key={idx}>
            <div>{item.post}</div>
            {item['2022'].length > 0 && (
              <div>
                <span>2022:</span>
                {<span>{item['2022'].map((e) => e.score).join(',')}</span>}
              </div>
            )}
            {item['2023'].length > 0 && (
              <div>
                <span>2023:</span>
                {<span>{item['2023'].map((e) => e.score).join(',')}</span>}
              </div>
            )}
            {item['2024'].length > 0 && (
              <div>
                <span>2024:</span>
                {<span>{item['2024'].map((e) => e.score).join(',')}</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Index;
