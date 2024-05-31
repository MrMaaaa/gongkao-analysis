import { useMount, useSafeState } from 'ahooks';
import { useLocation, useParams } from 'react-router-dom';
import qs from 'query-string';
import { readJSON } from '@/utils/read';
import { PostRecruitmentItem } from '@/interface';

const Index = () => {
  const search = qs.parse(useLocation().search);
  const params = useParams();
  const [postDetail, setPostDetail] = useSafeState<
    PostRecruitmentItem | undefined
  >(undefined);

  useMount(() => {
    const list: PostRecruitmentItem[] = readJSON(() =>
      require(`@/files/post-shengkao-${params.province}-${params.year}.json`),
    );

    const target = list.find((el) => el.postId === Number(search.postId));
    setPostDetail(target);
  });

  if (!postDetail) return null;

  return (
    <div className="post-card">
      <div>{postDetail.recruitmentInstitution}</div>
      <div>
        {postDetail.postName}
        ({postDetail.postId})
        [招录{postDetail.recruitmentNumber}人]
      </div>
      <div>专业：{postDetail.majorType}</div>
      <div>学历：{postDetail.educationRequirement}</div>
      <div>学位：{postDetail.degreeRequirement}</div>
      <div>其他要求：{postDetail.otherRequirement}</div>
      <div>工作经历要求：{postDetail.workExperience}</div>
      <div>备注：{postDetail.remark || '无'}</div>
    </div>
  );
};

export default Index;
