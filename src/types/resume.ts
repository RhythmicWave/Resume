export interface Profile {
  name: string
  title: string
  gender: string
  birthDate: string
  city: string
  politicalStatus: string
  phone: string
  email: string
  github: string
  website: string
  avatar: string
  summary: string
}

export interface LinkItem {
  label: string
  value: string
  url: string
}

export interface EducationItem {
  school: string
  major: string
  degree: string
  period: string
  details: string[]
}

export interface ExperienceItem {
  company: string
  role: string
  period: string
  location: string
  description: string
  highlights: string[]
}

export interface ProjectItem {
  name: string
  role: string
  period: string
  techStack: string
  link: string
  description: string
  highlights: string[]
}

export interface AwardItem {
  title: string
  issuer: string
  date: string
}

export interface SkillCategory {
  name: string
  items: string[]
}

export interface CustomSection {
  title: string
  items: string[]
}

export interface ResumeData {
  profile: Profile
  links: LinkItem[]
  education: EducationItem[]
  internships: ExperienceItem[]
  work: ExperienceItem[]
  projects: ProjectItem[]
  awards: AwardItem[]
  scholarships: AwardItem[]
  skills: SkillCategory[]
  customSections: CustomSection[]
}
