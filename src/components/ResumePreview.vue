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
import type { ResumeData, ResumeTemplate } from '../types/resume'
import { hasContent } from '../utils/resume'

const props = withDefaults(
  defineProps<{
    resume: ResumeData
    variant?: ResumeTemplate
  }>(),
  {
    variant: 'classic',
  },
)

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

const sidebarContactItems = computed(() =>
  [
    ...metaItems.value.map((item) => ({ ...item, href: '' })),
    ...visibleLinks.value.map((link) => ({
      icon: LinkIcon,
      value: link.value || link.label,
      href: link.url,
    })),
  ].filter((item) => item.value.trim()),
)

function avatarBackgroundStyle(src: string): { backgroundImage: string } {
  return {
    backgroundImage: `url("${src}")`,
  }
}
</script>

<template>
  <article :class="['resume-paper', `resume-paper--${variant}`]" aria-label="简历预览">
    <template v-if="variant === 'sidebar'">
      <aside class="sidebar-panel">
        <div class="sidebar-profile">
          <div v-if="resume.profile.avatar" class="sidebar-avatar">
            <div
              class="avatar-image"
              :style="avatarBackgroundStyle(resume.profile.avatar)"
              role="img"
              aria-label="头像"
            />
          </div>
          <div v-else class="sidebar-avatar is-placeholder">
            <UserRound :size="42" stroke-width="1.8" aria-hidden="true" />
          </div>
          <h1>{{ resume.profile.name || '姓名' }}</h1>
          <p v-if="resume.profile.title">{{ resume.profile.title }}</p>
        </div>

        <section v-if="sidebarContactItems.length" class="sidebar-block">
          <h2>基本信息</h2>
          <div class="sidebar-contact-list">
            <component
              :is="item.href ? 'a' : 'span'"
              v-for="(item, index) in sidebarContactItems"
              :key="`${item.value}-${index}`"
              :href="item.href || undefined"
              target="_blank"
              rel="noreferrer"
              class="sidebar-contact-item"
            >
              <component :is="item.icon" :size="13" stroke-width="2.2" aria-hidden="true" />
              {{ item.value }}
            </component>
          </div>
        </section>

        <section v-if="visibleSkills.length" class="sidebar-block">
          <h2>专业技能</h2>
          <div v-for="skill in visibleSkills" :key="skill.name" class="sidebar-skill">
            <strong v-if="skill.name">{{ skill.name }}</strong>
            <ul v-if="skill.items?.filter(Boolean).length" class="sidebar-skill-list">
              <li v-for="item in skill.items.filter(Boolean)" :key="item">{{ item }}</li>
            </ul>
          </div>
        </section>
      </aside>

      <main class="sidebar-main">
        <section v-if="resume.profile.summary" class="sidebar-section">
          <div class="sidebar-heading">
            <span><UserRound :size="13" stroke-width="2.7" aria-hidden="true" /></span>
            <h2>个人概述</h2>
          </div>
          <p class="sidebar-summary">{{ resume.profile.summary }}</p>
        </section>

        <section v-if="visibleEducation.length" class="sidebar-section">
          <div class="sidebar-heading">
            <span><GraduationCap :size="13" stroke-width="2.7" aria-hidden="true" /></span>
            <h2>教育背景</h2>
          </div>
          <div
            v-for="item in visibleEducation"
            :key="`${item.school}-${item.period}`"
            class="sidebar-entry has-dot"
          >
            <div class="sidebar-entry-head">
              <div>
                <h3>{{ item.school }}</h3>
                <p>{{ [item.major, item.degree].filter(Boolean).join(' / ') }}</p>
              </div>
              <time>{{ item.period }}</time>
            </div>
            <ul v-if="item.details?.filter(Boolean).length" class="sidebar-bullet-list">
              <li v-for="detail in item.details.filter(Boolean)" :key="detail">{{ detail }}</li>
            </ul>
          </div>
        </section>

        <section v-if="visibleProjects.length" class="sidebar-section">
          <div class="sidebar-heading">
            <span><UsersRound :size="13" stroke-width="2.7" aria-hidden="true" /></span>
            <h2>项目经历</h2>
          </div>
          <div v-for="project in visibleProjects" :key="`${project.name}-${project.period}`" class="sidebar-entry">
            <div class="sidebar-entry-head">
              <div>
                <h3>{{ project.name }}</h3>
                <p v-if="project.techStack">{{ project.techStack }}</p>
              </div>
              <time>{{ project.period }}</time>
            </div>
            <div v-if="project.role" class="sidebar-entry-meta">
              <span>{{ project.role }}</span>
            </div>
            <a v-if="project.link" class="sidebar-link" :href="project.link" target="_blank" rel="noreferrer">
              {{ project.link }}
            </a>
            <p v-if="project.description" class="sidebar-description">{{ project.description }}</p>
            <ul v-if="project.highlights?.filter(Boolean).length" class="sidebar-bullet-list">
              <li v-for="highlight in project.highlights.filter(Boolean)" :key="highlight">
                {{ highlight }}
              </li>
            </ul>
          </div>
        </section>

        <section v-if="visibleWork.length || visibleInternships.length" class="sidebar-section">
          <div class="sidebar-heading">
            <span><BriefcaseBusiness :size="13" stroke-width="2.7" aria-hidden="true" /></span>
            <h2>实践与工作经历</h2>
          </div>
          <div v-for="item in visibleWork" :key="`work-${item.company}-${item.period}`" class="sidebar-entry">
            <div class="sidebar-entry-head">
              <div>
                <h3>{{ item.company }}</h3>
                <p>{{ item.role }}</p>
              </div>
              <time>{{ item.period }}</time>
            </div>
            <p v-if="item.description" class="sidebar-description">{{ item.description }}</p>
            <ul v-if="item.highlights?.filter(Boolean).length" class="sidebar-bullet-list">
              <li v-for="highlight in item.highlights.filter(Boolean)" :key="highlight">
                {{ highlight }}
              </li>
            </ul>
          </div>
          <div
            v-for="item in visibleInternships"
            :key="`internship-${item.company}-${item.period}`"
            class="sidebar-entry"
          >
            <div class="sidebar-entry-head">
              <div>
                <h3>{{ item.company }}<span v-if="item.location"> / {{ item.location }}</span></h3>
                <p>{{ item.role }}</p>
              </div>
              <time>{{ item.period }}</time>
            </div>
            <p v-if="item.description" class="sidebar-description">{{ item.description }}</p>
            <ul v-if="item.highlights?.filter(Boolean).length" class="sidebar-bullet-list">
              <li v-for="highlight in item.highlights.filter(Boolean)" :key="highlight">
                {{ highlight }}
              </li>
            </ul>
          </div>
        </section>

        <section v-if="visibleAwards.length || visibleScholarships.length" class="sidebar-section">
          <div class="sidebar-heading">
            <span><Trophy :size="13" stroke-width="2.7" aria-hidden="true" /></span>
            <h2>荣誉奖励</h2>
          </div>
          <div class="sidebar-simple-list">
            <div v-for="award in visibleAwards" :key="`${award.title}-${award.issuer}-${award.date}`" class="sidebar-simple-row">
              <span>{{ [award.title, award.issuer].filter(Boolean).join(' / ') }}</span>
              <time v-if="award.date">{{ award.date }}</time>
            </div>
            <div
              v-for="item in visibleScholarships"
              :key="`${item.title}-${item.issuer}-${item.date}`"
              class="sidebar-simple-row"
            >
              <span>{{ [item.title, item.issuer].filter(Boolean).join(' / ') }}</span>
              <time v-if="item.date">{{ item.date }}</time>
            </div>
          </div>
        </section>

        <section v-for="section in visibleCustomSections" :key="section.title" class="sidebar-section">
          <div class="sidebar-heading">
            <span><Code2 :size="13" stroke-width="2.7" aria-hidden="true" /></span>
            <h2>{{ section.title }}</h2>
          </div>
          <ul class="sidebar-bullet-list">
            <li v-for="item in section.items.filter(Boolean)" :key="item">{{ item }}</li>
          </ul>
        </section>
      </main>
    </template>

    <template v-else>
      <header class="resume-header">
        <div class="header-copy">
          <h1>{{ resume.profile.name || '姓名' }}</h1>
          <p v-if="resume.profile.title" class="resume-title">{{ resume.profile.title }}</p>
          <div v-if="metaItems.length" class="meta-list">
            <span v-for="(item, index) in metaItems" :key="`${item.value}-${index}`" class="meta-item">
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
          <div
            class="avatar-image"
            :style="avatarBackgroundStyle(resume.profile.avatar)"
            role="img"
            aria-label="头像"
          />
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
    </template>
  </article>
</template>
