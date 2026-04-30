import type { ResumeData } from '../types/resume'
import { defaultResume as templateResume } from './resume_template'

const privateResumeModules = import.meta.glob<{ defaultResume: ResumeData }>('./resume.ts', {
  eager: true,
})

export const defaultResume: ResumeData =
  privateResumeModules['./resume.ts']?.defaultResume ?? templateResume
