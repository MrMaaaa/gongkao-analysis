export interface ScoreItem {
  no?: string;
  id: number | string;
  rank: number | string;
  name: string;
  post: string;
  postId: string;
  score: number;
  shenlun?: number;
  xingce?: number;
  gongan?: number;
}

export interface ScoreFullItem extends Required<ScoreItem> {}

export interface ScoreObjItemCell<T = ScoreItem> {
  max?: T;
  min?: T;
  ave: number;
  diff: number;
}

export interface MajorItem {
  /** 一级类目 */
  majorAncestors: string[]; // 一级类目
  /** 二级类目 */
  majorParent: string[]; // 二级类目
  /** 专业名称 */
  majorName: string; // 专业名称
  /** 专业代码 */
  majorCode: string; // 专业代码
}

export interface PostRecruitmentItem {
  /** 专业（学科）类别-不限专业 */
  majorType: string; // 专业（学科）类别-不限专业
  /** 体检标准 */
  physicalExaminationStandard: string; // 体检标准
  /** 其他要求 */
  otherRequirement: string; // 其他要求
  /** 学位要求 */
  degreeRequirement: string; // 学位要求
  /** 学历要求 */
  educationRequirement: string; // 学历要求
  /** 工作经历-无 */
  workExperience: string; // 工作经历-无
  /** 年龄要求 */
  ageRequirement: string; // 年龄要求
  /** 招录人数 */
  recruitmentNumber: number; // 招录人数
  /** 招录单位 */
  recruitmentInstitution: string; // 招录单位
  /** 是否进行体能测评-是-否 */
  isPhysicalFitnessTest: string; // 是否进行体能测评-是-否
  /** 职位代码 */
  postId: number; // 职位代码
  /** 职位名称 */
  postName: string; // 职位名称
  /** 备注 */
  remark: string; // 备注
}

export enum PostRecruitmentItemKeyMapper {
  'recruitmentInstitution' = '招录单位',
  'postName' = '职位名称',
  'postId' = '职位代码',
  'recruitmentNumber' = '招录人数',
  'ageRequirement' = '年龄要求',
  'educationRequirement' = '学历要求',
  'degreeRequirement' = '学位要求',
  'majorType' = '专业（学科）类别',
  'workExperience' = '工作经历',
  'otherRequirement' = '其他要求',
  'physicalExaminationStandard' = '体检标准',
  'isPhysicalFitnessTest' = '体能测评',
  'remark' = '备注',
}

export interface GuoKaoRecruitmentItem {
  departmentCode: string;
  departmentName: string;
  bureauName: string;
  institutionNature: string;
  postName: string;
  postType: string;
  postDistribution: string;
  postIntro: string;
  postCode: string;
  institutionLevel: string;
  examType: string;
  recruitmentNumber: string;
  majorType: string;
  education: string;
  degree: string;
  politicalStatus: string;
  grassrootsWorkMinExperience: string;
  grassrootsWorkProjectExperience: string;
  isProfessionalAbilityTestAtInterview: string;
  ratioOfInterviewees: string;
  workPosition: string;
  residencePosition: string;
  remark: string;
  departmentWebsite: string;
  contactWay1: string;
  contactWay2: string;
  contactWay3: string;
}

export enum GuokaoPostRecruitmentItemKeyMapper {
  departmentCode = '部门代码',
  departmentName = '部门名称',
  bureauName = '用人司局',
  institutionNature = '机构性质',
  postName = '招考职位',
  postType = '职位属性',
  postDistribution = '职位分布',
  postIntro = '职位简介',
  postCode = '职位代码',
  institutionLevel = '机构层级',
  examType = '考试类别',
  recruitmentNumber = '招考人数',
  majorType = '专业',
  education = '学历',
  degree = '学位',
  politicalStatus = '政治面貌',
  // grassrootsWorkMinExperience = '基层工作最低年限',
  grassrootsWorkMinExperience = '基层年限',
  // grassrootsWorkProjectExperience = '服务基层项目工作经历',
  grassrootsWorkProjectExperience = '基层经历',
  isProfessionalAbilityTestAtInterview = '是否在面试阶段组织专业能力测试',
  // ratioOfInterviewees = '面试人员比例',
  ratioOfInterviewees = '面试比例',
  workPosition = '工作地点',
  residencePosition = '落户地点',
  remark = '备注',
  departmentWebsite = '部门网站',
  contactWay1 = '咨询电话1',
  contactWay2 = '咨询电话2',
  contactWay3 = '咨询电话3',
}

// export const name2key: Record<string, string> = {
//   '专业（学科）类别': 'majorType',
//   体检标准: 'physicalExaminationStandard',
//   其他要求: 'otherRequirement',
//   学位要求: 'degreeRequirement',
//   学历要求: 'educationRequirement',
//   工作经历: 'workExperience',
//   年龄要求: 'ageRequirement',
//   招录人数: 'recruitmentNumber',
//   招录单位: 'recruitmentInstitution',
//   是否进行体能测评: 'isPhysicalFitnessTest',
//   职位代码: 'postId',
//   职位名称: 'postName',
// };
