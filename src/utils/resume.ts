import { defaultResume } from '../data/defaultResume'
import type { ResumeData } from '../types/resume'

export function cloneResume<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function normalizeResume(value: unknown): ResumeData {
  const incoming = isRecord(value) ? value : {}
  const base = cloneResume(defaultResume)

  return {
    profile: {
      ...base.profile,
      ...(isRecord(incoming.profile) ? incoming.profile : {}),
    },
    links: normalizeArray(incoming.links, base.links),
    education: normalizeArray(incoming.education, base.education),
    internships: normalizeArray(incoming.internships, base.internships),
    work: normalizeArray(incoming.work, base.work),
    projects: normalizeArray(incoming.projects, base.projects),
    awards: normalizeArray(incoming.awards, base.awards),
    scholarships: normalizeArray(incoming.scholarships, base.scholarships),
    skills: normalizeArray(incoming.skills, base.skills),
    customSections: normalizeArray(incoming.customSections, base.customSections),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback
}

export function hasContent(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasContent(item))
  }

  if (isRecord(value)) {
    return Object.values(value).some((item) => hasContent(item))
  }

  return value !== null && value !== undefined
}
