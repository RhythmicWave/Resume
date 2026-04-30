<script setup lang="ts">
import {
  Award,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  ImagePlus,
  Link2,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
  Wrench,
  X,
} from 'lucide-vue-next'
import type {
  AwardItem,
  CustomSection,
  EducationItem,
  ExperienceItem,
  LinkItem,
  ProjectItem,
  ResumeData,
  SkillCategory,
} from '../types/resume'
import { cloneResume } from '../utils/resume'

const resume = defineModel<ResumeData>({ required: true })

defineProps<{
  saved: boolean
}>()

const emit = defineEmits<{
  save: []
  reset: []
}>()

const blankLink = (): LinkItem => ({ label: '', value: '', url: '' })
const blankEducation = (): EducationItem => ({
  school: '',
  major: '',
  degree: '',
  period: '',
  details: [''],
})
const blankExperience = (): ExperienceItem => ({
  company: '',
  role: '',
  period: '',
  location: '',
  description: '',
  highlights: [''],
})
const blankProject = (): ProjectItem => ({
  name: '',
  role: '',
  period: '',
  techStack: '',
  link: '',
  description: '',
  highlights: [''],
})
const blankAward = (): AwardItem => ({ title: '', issuer: '', date: '' })
const blankSkill = (): SkillCategory => ({ name: '', items: [''] })
const blankCustomSection = (): CustomSection => ({ title: '', items: [''] })

function updateList(list: string[], value: string): void {
  const lines = value.split('\n')
  list.splice(0, list.length, ...lines)
}

function removeAt<T>(list: T[], index: number): void {
  list.splice(index, 1)
}

function duplicateItem<T>(list: T[], item: T): void {
  list.push(cloneResume(item))
}

async function handleAvatarUpload(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    input.value = ''
    return
  }

  try {
    resume.value.profile.avatar = await fileToAvatarDataUrl(file)
  } finally {
    input.value = ''
  }
}

function clearAvatar(): void {
  resume.value.profile.avatar = ''
}

function fileToAvatarDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('无法读取头像文件'))
    reader.onload = () => {
      const result = reader.result

      if (typeof result !== 'string') {
        reject(new Error('头像文件格式异常'))
        return
      }

      if (file.type === 'image/svg+xml') {
        resolve(result)
        return
      }

      const image = new Image()

      image.onerror = () => resolve(result)
      image.onload = () => {
        const maxSide = 900
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))

        const context = canvas.getContext('2d')

        if (!context) {
          resolve(result)
          return
        }

        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }
      image.src = result
    }

    reader.readAsDataURL(file)
  })
}
</script>

<template>
  <aside class="editor-panel" aria-label="简历配置">
    <div class="editor-sticky">
      <header class="editor-header">
        <div>
          <p>Resume Studio</p>
          <h2>配置你的简历</h2>
        </div>
        <span :class="['save-state', { active: saved }]">{{ saved ? '已保存' : '编辑中' }}</span>
      </header>

      <div class="editor-actions">
        <button type="button" class="tool-button primary" @click="emit('save')">
          <Save :size="16" aria-hidden="true" />
          保存配置
        </button>
        <button type="button" class="tool-button" @click="emit('reset')">
          <RotateCcw :size="16" aria-hidden="true" />
          重置示例
        </button>
      </div>

      <p class="editor-note">
        空内容会在右侧预览中自动隐藏。头像可以填入网络图片地址，也可以留空。
      </p>

      <div class="editor-scroll">
        <section class="editor-section">
          <h3><UserRound :size="17" aria-hidden="true" /> 基本信息</h3>
          <div class="field-grid">
            <label>
              姓名
              <input v-model="resume.profile.name" type="text" placeholder="xx" />
            </label>
            <label>
              求职意向
              <input v-model="resume.profile.title" type="text" placeholder="后端工程师" />
            </label>
            <label>
              性别
              <input v-model="resume.profile.gender" type="text" placeholder="男" />
            </label>
            <label>
              出生年月
              <input v-model="resume.profile.birthDate" type="text" placeholder="2002.01" />
            </label>
            <label>
              城市
              <input v-model="resume.profile.city" type="text" placeholder="上海" />
            </label>
            <label>
              政治面貌
              <input v-model="resume.profile.politicalStatus" type="text" placeholder="共青团员" />
            </label>
            <label>
              电话
              <input v-model="resume.profile.phone" type="text" placeholder="18300000000" />
            </label>
            <label>
              邮箱
              <input v-model="resume.profile.email" type="email" placeholder="name@example.com" />
            </label>
            <label>
              GitHub
              <input v-model="resume.profile.github" type="text" placeholder="xx" />
            </label>
          </div>
          <div class="avatar-field">
            <div class="avatar-preview" aria-label="头像预览">
              <img v-if="resume.profile.avatar" :src="resume.profile.avatar" alt="头像预览" />
              <ImagePlus v-else :size="24" aria-hidden="true" />
            </div>
            <div class="avatar-controls">
              <div class="avatar-actions">
                <label class="file-trigger">
                  <Upload :size="15" aria-hidden="true" />
                  上传本地图像
                  <input type="file" accept="image/*" @change="handleAvatarUpload" />
                </label>
                <button v-if="resume.profile.avatar" type="button" class="clear-avatar" @click="clearAvatar">
                  <X :size="15" aria-hidden="true" />
                  清除
                </button>
              </div>
              <label class="avatar-url-field">
                头像 URL
                <input v-model="resume.profile.avatar" type="url" placeholder="https://... 或上传本地图像" />
              </label>
            </div>
          </div>
          <label>
            个人概述
            <textarea v-model="resume.profile.summary" rows="4" placeholder="一句话概括优势" />
          </label>
        </section>

        <section class="editor-section">
          <div class="section-title-row">
            <h3><Link2 :size="17" aria-hidden="true" /> 个人链接</h3>
            <button type="button" class="icon-action" title="添加链接" @click="resume.links.push(blankLink())">
              <Sparkles :size="15" aria-hidden="true" />
            </button>
          </div>
          <div v-for="(link, index) in resume.links" :key="index" class="item-editor">
            <div class="item-tools">
              <strong>链接 {{ index + 1 }}</strong>
              <button type="button" title="删除" @click="removeAt(resume.links, index)">
                <Trash2 :size="14" aria-hidden="true" />
              </button>
            </div>
            <div class="field-grid">
              <label>名称<input v-model="link.label" type="text" placeholder="GitHub" /></label>
              <label>显示文本<input v-model="link.value" type="text" placeholder="github.com/you" /></label>
            </div>
            <label>地址<input v-model="link.url" type="url" placeholder="https://github.com/you" /></label>
          </div>
        </section>

        <section class="editor-section">
          <div class="section-title-row">
            <h3><GraduationCap :size="17" aria-hidden="true" /> 教育背景</h3>
            <button
              type="button"
              class="icon-action"
              title="添加教育经历"
              @click="resume.education.push(blankEducation())"
            >
              <Sparkles :size="15" aria-hidden="true" />
            </button>
          </div>
          <div v-for="(edu, index) in resume.education" :key="index" class="item-editor">
            <div class="item-tools">
              <strong>教育 {{ index + 1 }}</strong>
              <button type="button" title="复制" @click="duplicateItem(resume.education, edu)">
                <FileText :size="14" aria-hidden="true" />
              </button>
              <button type="button" title="删除" @click="removeAt(resume.education, index)">
                <Trash2 :size="14" aria-hidden="true" />
              </button>
            </div>
            <div class="field-grid">
              <label>学校<input v-model="edu.school" type="text" /></label>
              <label>专业<input v-model="edu.major" type="text" /></label>
              <label>学历<input v-model="edu.degree" type="text" /></label>
              <label>时间<input v-model="edu.period" type="text" /></label>
            </div>
            <label>
              补充说明
              <textarea
                :value="edu.details.join('\n')"
                rows="3"
                placeholder="每行一条"
                @input="updateList(edu.details, ($event.target as HTMLTextAreaElement).value)"
              />
            </label>
          </div>
        </section>

        <section class="editor-section">
          <div class="section-title-row">
            <h3><BriefcaseBusiness :size="17" aria-hidden="true" /> 实习经历</h3>
            <button
              type="button"
              class="icon-action"
              title="添加实习经历"
              @click="resume.internships.push(blankExperience())"
            >
              <Sparkles :size="15" aria-hidden="true" />
            </button>
          </div>
          <div v-for="(item, index) in resume.internships" :key="index" class="item-editor">
            <div class="item-tools">
              <strong>实习 {{ index + 1 }}</strong>
              <button type="button" title="复制" @click="duplicateItem(resume.internships, item)">
                <FileText :size="14" aria-hidden="true" />
              </button>
              <button type="button" title="删除" @click="removeAt(resume.internships, index)">
                <Trash2 :size="14" aria-hidden="true" />
              </button>
            </div>
            <div class="field-grid">
              <label>公司<input v-model="item.company" type="text" /></label>
              <label>岗位<input v-model="item.role" type="text" /></label>
              <label>时间<input v-model="item.period" type="text" /></label>
              <label>地点<input v-model="item.location" type="text" /></label>
            </div>
            <label>描述<textarea v-model="item.description" rows="3" /></label>
            <label>
              亮点
              <textarea
                :value="item.highlights.join('\n')"
                rows="4"
                placeholder="每行一条"
                @input="updateList(item.highlights, ($event.target as HTMLTextAreaElement).value)"
              />
            </label>
          </div>
        </section>

        <section class="editor-section">
          <div class="section-title-row">
            <h3><BriefcaseBusiness :size="17" aria-hidden="true" /> 工作经历</h3>
            <button
              type="button"
              class="icon-action"
              title="添加工作经历"
              @click="resume.work.push(blankExperience())"
            >
              <Sparkles :size="15" aria-hidden="true" />
            </button>
          </div>
          <div v-for="(item, index) in resume.work" :key="index" class="item-editor">
            <div class="item-tools">
              <strong>工作 {{ index + 1 }}</strong>
              <button type="button" title="复制" @click="duplicateItem(resume.work, item)">
                <FileText :size="14" aria-hidden="true" />
              </button>
              <button type="button" title="删除" @click="removeAt(resume.work, index)">
                <Trash2 :size="14" aria-hidden="true" />
              </button>
            </div>
            <div class="field-grid">
              <label>公司<input v-model="item.company" type="text" /></label>
              <label>岗位<input v-model="item.role" type="text" /></label>
              <label>时间<input v-model="item.period" type="text" /></label>
              <label>地点<input v-model="item.location" type="text" /></label>
            </div>
            <label>描述<textarea v-model="item.description" rows="3" /></label>
            <label>
              亮点
              <textarea
                :value="item.highlights.join('\n')"
                rows="4"
                placeholder="每行一条"
                @input="updateList(item.highlights, ($event.target as HTMLTextAreaElement).value)"
              />
            </label>
          </div>
        </section>

        <section class="editor-section">
          <div class="section-title-row">
            <h3><UsersRound :size="17" aria-hidden="true" /> 项目经历</h3>
            <button type="button" class="icon-action" title="添加项目" @click="resume.projects.push(blankProject())">
              <Sparkles :size="15" aria-hidden="true" />
            </button>
          </div>
          <div v-for="(project, index) in resume.projects" :key="index" class="item-editor">
            <div class="item-tools">
              <strong>项目 {{ index + 1 }}</strong>
              <button type="button" title="复制" @click="duplicateItem(resume.projects, project)">
                <FileText :size="14" aria-hidden="true" />
              </button>
              <button type="button" title="删除" @click="removeAt(resume.projects, index)">
                <Trash2 :size="14" aria-hidden="true" />
              </button>
            </div>
            <div class="field-grid">
              <label>名称<input v-model="project.name" type="text" /></label>
              <label>角色<input v-model="project.role" type="text" /></label>
              <label>时间<input v-model="project.period" type="text" /></label>
              <label>技术栈<input v-model="project.techStack" type="text" /></label>
            </div>
            <label>链接<input v-model="project.link" type="url" /></label>
            <label>描述<textarea v-model="project.description" rows="3" /></label>
            <label>
              亮点
              <textarea
                :value="project.highlights.join('\n')"
                rows="4"
                placeholder="每行一条"
                @input="updateList(project.highlights, ($event.target as HTMLTextAreaElement).value)"
              />
            </label>
          </div>
        </section>

        <section class="editor-section">
          <div class="section-title-row">
            <h3><Award :size="17" aria-hidden="true" /> 奖项与技能</h3>
          </div>

          <div class="mini-block">
            <div class="section-title-row compact">
              <strong>竞赛获奖</strong>
              <button type="button" class="icon-action" title="添加获奖" @click="resume.awards.push(blankAward())">
                <Sparkles :size="15" aria-hidden="true" />
              </button>
            </div>
            <div v-for="(award, index) in resume.awards" :key="index" class="item-editor slim">
              <div class="item-tools">
                <strong>奖项 {{ index + 1 }}</strong>
                <button type="button" title="删除" @click="removeAt(resume.awards, index)">
                  <Trash2 :size="14" aria-hidden="true" />
                </button>
              </div>
              <div class="field-grid">
                <label>名称<input v-model="award.title" type="text" /></label>
                <label>机构<input v-model="award.issuer" type="text" /></label>
                <label>日期<input v-model="award.date" type="text" /></label>
              </div>
            </div>
          </div>

          <div class="mini-block">
            <div class="section-title-row compact">
              <strong>奖学金</strong>
              <button
                type="button"
                class="icon-action"
                title="添加奖学金"
                @click="resume.scholarships.push(blankAward())"
              >
                <Sparkles :size="15" aria-hidden="true" />
              </button>
            </div>
            <div v-for="(item, index) in resume.scholarships" :key="index" class="item-editor slim">
              <div class="item-tools">
                <strong>奖学金 {{ index + 1 }}</strong>
                <button type="button" title="删除" @click="removeAt(resume.scholarships, index)">
                  <Trash2 :size="14" aria-hidden="true" />
                </button>
              </div>
              <div class="field-grid">
                <label>名称<input v-model="item.title" type="text" /></label>
                <label>机构<input v-model="item.issuer" type="text" /></label>
                <label>日期<input v-model="item.date" type="text" /></label>
              </div>
            </div>
          </div>

          <div class="mini-block">
            <div class="section-title-row compact">
              <strong><Wrench :size="15" aria-hidden="true" /> 专业技能</strong>
              <button type="button" class="icon-action" title="添加技能组" @click="resume.skills.push(blankSkill())">
                <Sparkles :size="15" aria-hidden="true" />
              </button>
            </div>
            <div v-for="(skill, index) in resume.skills" :key="index" class="item-editor slim">
              <div class="item-tools">
                <strong>技能 {{ index + 1 }}</strong>
                <button type="button" title="删除" @click="removeAt(resume.skills, index)">
                  <Trash2 :size="14" aria-hidden="true" />
                </button>
              </div>
              <label>分类<input v-model="skill.name" type="text" placeholder="工程能力" /></label>
              <label>
                技能项
                <textarea
                  :value="skill.items.join('\n')"
                  rows="4"
                  placeholder="每行一条"
                  @input="updateList(skill.items, ($event.target as HTMLTextAreaElement).value)"
                />
              </label>
            </div>
          </div>
        </section>

        <section class="editor-section">
          <div class="section-title-row">
            <h3><FileText :size="17" aria-hidden="true" /> 自定义模块</h3>
            <button
              type="button"
              class="icon-action"
              title="添加自定义模块"
              @click="resume.customSections.push(blankCustomSection())"
            >
              <Sparkles :size="15" aria-hidden="true" />
            </button>
          </div>
          <div v-for="(section, index) in resume.customSections" :key="index" class="item-editor">
            <div class="item-tools">
              <strong>模块 {{ index + 1 }}</strong>
              <button type="button" title="删除" @click="removeAt(resume.customSections, index)">
                <Trash2 :size="14" aria-hidden="true" />
              </button>
            </div>
            <label>标题<input v-model="section.title" type="text" /></label>
            <label>
              内容
              <textarea
                :value="section.items.join('\n')"
                rows="4"
                placeholder="每行一条"
                @input="updateList(section.items, ($event.target as HTMLTextAreaElement).value)"
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  </aside>
</template>
