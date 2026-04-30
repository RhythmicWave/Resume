import type { ResumeData } from '../types/resume'

export const defaultResume: ResumeData = {
  profile: {
    name: 'xx',
    title: '求职意向：后端工程师',
    gender: '男',
    birthDate: '2002.01',
    city: '上海',
    politicalStatus: '共青团员',
    phone: '18300000000',
    email: 'xx@example.com',
    github: 'xx',
    website: 'https://github.com/xx/resume',
    avatar: '',
    summary: '',
  },
  links: [
    {
      label: 'GitHub',
      value: 'github.com/xx',
      url: 'https://github.com/xx',
    },
  ],
  education: [
    {
      school: '大学',
      major: '计算机科学与技术',
      degree: '硕士',
      period: '2022 - 2025',
      details: ['GPA：3.8 / 4.0，排名：前 10%'],
    },
    {
      school: '大学',
      major: '计算机科学与技术',
      degree: '本科',
      period: '2018 - 2022',
      details: ['GPA：3.7 / 4.0，核心课程：数据结构、操作系统、计算机网络'],
    },
  ],
  internships: [
    {
      company: '科技公司',
      role: '实习生 / 经营、商商帅',
      period: '2023.07 - 2024.04',
      location: '上海',
      description: '参与 xxx 后端开发，负责部分业务接口、数据整理与运营支持。',
      highlights: ['实现了 xxx 特性', '后台资源占用率减少 8%'],
    },
  ],
  work: [],
  projects: [
    {
      name: 'LaTeX 简历模板',
      role: '项目负责人',
      period: '2024.09 - 至今',
      techStack: 'LaTeX / Python',
      link: 'https://github.com/xx/resume',
      description: 'Fork 自 billyran/resume，优化中文简历模板，支持快速维护与导出。',
      highlights: [
        '新增支持 FontAwesome 6.6.0',
        '修改部份图片的样式',
        '新增多种标题行样式',
        '整理模板配置并补充示例',
      ],
    },
  ],
  awards: [
    {
      title: '比赛 / 国家级 / 银牌',
      issuer: '全国大学生竞赛',
      date: '2019.10',
    },
    {
      title: '比赛 / 国家级 / 冠军',
      issuer: '全国大学生竞赛',
      date: '2024.01',
    },
  ],
  scholarships: [
    {
      title: '奖学金 / 校级二等奖',
      issuer: '大学',
      date: '2019.10',
    },
    {
      title: '奖学金 / 校级一等',
      issuer: '大学',
      date: '2020.10',
    },
  ],
  skills: [
    {
      name: '工程能力',
      items: [
        '熟悉 Linux 系统，掌握常用 Linux 命令，日常在 Linux 环境下从事开发',
        '通过英语 CET-6，具备良好的英文文献阅读能力',
      ],
    },
    {
      name: '编程语言',
      items: ['熟悉 Vue、TypeScript、Python，了解 C/C++ 与 Go'],
    },
  ],
  customSections: [],
}
