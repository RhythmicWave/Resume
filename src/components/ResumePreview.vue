<script setup lang="ts">
import {
  Award,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleUserRound,
  Code2,
  GraduationCap,
  HeartHandshake,
  Home,
  Link as LinkIcon,
  Mail,
  Phone,
  Trophy,
  UserRound,
  UsersRound,
} from 'lucide-vue-next'
import { computed } from 'vue'
import ResumeSection from './ResumeSection.vue'
import type { ResumeData } from '../types/resume'
import { hasContent } from '../utils/resume'

const props = defineProps<{
  resume: ResumeData
}>()

const visibleLinks = computed(() =>
  props.resume.links.filter((item) => hasContent([item.label, item.value, item.url])),
)
const visibleEducation = computed(() => props.resume.education.filter(hasContent))
const visibleInternships = computed(() => props.resume.internships.filter(hasContent))
const visibleWork = computed(() => props.resume.work.filter(hasContent))
const visibleProjects = computed(() => props.resume.projects.filter(hasContent))
const visibleAwards = computed(() => props.resume.awards.filter(hasContent))
const visibleScholarships = computed(() => props.resume.scholarships.filter(hasContent))
const visibleSkills = computed(() => props.resume.skills.filter(hasContent))
const visibleCustomSections = computed(() => props.resume.customSections.filter(hasContent))

const metaItems = computed(() =>
  [
    { icon: UserRound, value: props.resume.profile.gender },
    { icon: CalendarDays, value: props.resume.profile.birthDate },
    { icon: Home, value: props.resume.profile.city },
    { icon: CircleUserRound, value: props.resume.profile.politicalStatus },
    { icon: Phone, value: props.resume.profile.phone },
    { icon: Mail, value: props.resume.profile.email },
  ].filter((item) => item.value.trim()),
)
</script>

<template>
  <article class="resume-paper" aria-label="简历预览">
    <header class="resume-header">
      <div class="header-copy">
        <h1>{{ resume.profile.name || '姓名' }}</h1>
        <p v-if="resume.profile.title" class="resume-title">{{ resume.profile.title }}</p>
        <div v-if="metaItems.length" class="meta-list">
          <span v-for="item in metaItems" :key="`${item.value}-${item.icon}`" class="meta-item">
            <component :is="item.icon" :size="13" stroke-width="2.2" aria-hidden="true" />
            {{ item.value }}
          </span>
        </div>
        <div v-if="visibleLinks.length" class="link-list">
          <a
            v-for="link in visibleLinks"
            :key="`${link.label}-${link.value}`"
            :href="link.url || undefined"
            target="_blank"
            rel="noreferrer"
          >
            <LinkIcon :size="12" stroke-width="2.4" aria-hidden="true" />
            {{ link.value || link.label }}
          </a>
        </div>
      </div>
      <div v-if="resume.profile.avatar" class="avatar-frame">
        <img :src="resume.profile.avatar" alt="头像" />
      </div>
    </header>

    <p v-if="resume.profile.summary" class="profile-summary">{{ resume.profile.summary }}</p>

    <ResumeSection v-if="visibleEducation.length" title="教育背景" :icon="GraduationCap">
      <div v-for="item in visibleEducation" :key="`${item.school}-${item.period}`" class="entry">
        <div class="entry-main">
          <div>
            <h3>{{ item.school }}</h3>
            <p>{{ [item.major, item.degree].filter(Boolean).join(' / ') }}</p>
          </div>
          <span>{{ item.period }}</span>
        </div>
        <ul v-if="item.details?.length" class="compact-list">
          <li v-for="detail in item.details.filter(Boolean)" :key="detail">{{ detail }}</li>
        </ul>
      </div>
    </ResumeSection>

    <ResumeSection v-if="visibleWork.length" title="工作经历" :icon="Building2">
      <div v-for="item in visibleWork" :key="`${item.company}-${item.period}`" class="entry">
        <div class="entry-main">
          <div>
            <h3>{{ item.company }}</h3>
            <p>{{ item.role }}</p>
          </div>
          <span>{{ item.period }}</span>
        </div>
        <p v-if="item.description" class="entry-description">{{ item.description }}</p>
        <ul v-if="item.highlights?.length" class="compact-list">
          <li v-for="highlight in item.highlights.filter(Boolean)" :key="highlight">
            {{ highlight }}
          </li>
        </ul>
      </div>
    </ResumeSection>

    <ResumeSection v-if="visibleInternships.length" title="实习经历" :icon="BriefcaseBusiness">
      <div v-for="item in visibleInternships" :key="`${item.company}-${item.period}`" class="entry">
        <div class="entry-main">
          <div>
            <h3>{{ item.company }}<span v-if="item.location"> / {{ item.location }}</span></h3>
            <p>{{ item.role }}</p>
          </div>
          <span>{{ item.period }}</span>
        </div>
        <p v-if="item.description" class="entry-description">{{ item.description }}</p>
        <ul v-if="item.highlights?.length" class="compact-list">
          <li v-for="highlight in item.highlights.filter(Boolean)" :key="highlight">
            {{ highlight }}
          </li>
        </ul>
      </div>
    </ResumeSection>

    <ResumeSection v-if="visibleProjects.length" title="项目经历" :icon="UsersRound">
      <div v-for="project in visibleProjects" :key="`${project.name}-${project.period}`" class="entry">
        <div class="entry-main">
          <div>
            <h3>{{ project.name }}</h3>
            <p v-if="project.role" class="project-role">{{ project.role }}</p>
            <p v-if="project.techStack" class="project-tech">{{ project.techStack }}</p>
          </div>
          <span>{{ project.period }}</span>
        </div>
        <a v-if="project.link" class="project-link" :href="project.link" target="_blank" rel="noreferrer">
          {{ project.link }}
        </a>
        <p v-if="project.description" class="entry-description">{{ project.description }}</p>
        <ul v-if="project.highlights?.length" class="compact-list">
          <li v-for="highlight in project.highlights.filter(Boolean)" :key="highlight">
            {{ highlight }}
          </li>
        </ul>
      </div>
    </ResumeSection>

    <ResumeSection v-if="visibleAwards.length" title="竞赛获奖" :icon="Trophy">
      <div class="simple-list">
        <div v-for="award in visibleAwards" :key="`${award.title}-${award.date}`" class="simple-row">
          <span>{{ [award.title, award.issuer].filter(Boolean).join(' / ') }}</span>
          <time>{{ award.date }}</time>
        </div>
      </div>
    </ResumeSection>

    <ResumeSection v-if="visibleScholarships.length" title="奖学金" :icon="Award">
      <div class="simple-list">
        <div v-for="item in visibleScholarships" :key="`${item.title}-${item.date}`" class="simple-row">
          <span>{{ [item.title, item.issuer].filter(Boolean).join(' / ') }}</span>
          <time>{{ item.date }}</time>
        </div>
      </div>
    </ResumeSection>

    <ResumeSection v-if="visibleSkills.length" title="专业技能" :icon="HeartHandshake">
      <div v-for="skill in visibleSkills" :key="skill.name" class="skill-row">
        <strong v-if="skill.name">{{ skill.name }}</strong>
        <ul v-if="skill.items?.length" class="compact-list">
          <li v-for="item in skill.items.filter(Boolean)" :key="item">{{ item }}</li>
        </ul>
      </div>
    </ResumeSection>

    <ResumeSection
      v-for="section in visibleCustomSections"
      :key="section.title"
      :title="section.title"
      :icon="Code2"
    >
      <ul class="compact-list">
        <li v-for="item in section.items.filter(Boolean)" :key="item">{{ item }}</li>
      </ul>
    </ResumeSection>
  </article>
</template>
