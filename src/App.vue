<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Download, FileJson, Monitor, Save } from 'lucide-vue-next'
import ResumeEditor from './components/ResumeEditor.vue'
import ResumePreview from './components/ResumePreview.vue'
import { defaultResume } from './data/defaultResume'
import type { ResumeData } from './types/resume'
import { exportResumePdf } from './utils/exportPdf'
import { cloneResume, normalizeResume } from './utils/resume'

const storageKey = 'vue-resume-builder:data'

const resume = ref<ResumeData>(cloneResume(defaultResume))
const previewRef = ref<HTMLElement | null>(null)
const isExporting = ref(false)
const saved = ref(true)
const isLoadingStoredConfig = ref(false)
const previewScale = ref(1)

const paperWidth = 794
const paperHeight = 1123

const fileName = computed(() => `${resume.value.profile.name || 'resume'}-resume.pdf`)
const configJson = computed(() => JSON.stringify(resume.value, null, 2))
const paperViewportStyle = computed(() => ({
  width: `${paperWidth * previewScale.value}px`,
  height: `${paperHeight * previewScale.value}px`,
  '--preview-scale': String(previewScale.value),
}))

onMounted(() => {
  updatePreviewScale()
  window.addEventListener('resize', updatePreviewScale)

  const stored = localStorage.getItem(storageKey)

  if (!stored) {
    return
  }

  try {
    isLoadingStoredConfig.value = true
    resume.value = normalizeResume(JSON.parse(stored))
    saved.value = true
  } catch {
    localStorage.removeItem(storageKey)
  } finally {
    nextTick(() => {
      isLoadingStoredConfig.value = false
      saved.value = true
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePreviewScale)
})

watch(
  resume,
  () => {
    if (isLoadingStoredConfig.value) {
      return
    }

    saved.value = false
  },
  { deep: true },
)

function saveConfig(): void {
  localStorage.setItem(storageKey, JSON.stringify(resume.value))
  saved.value = true
}

function resetResume(): void {
  resume.value = cloneResume(defaultResume)
  saved.value = false
}

async function handleExport(): Promise<void> {
  const paper = previewRef.value?.querySelector<HTMLElement>('.resume-paper')

  if (!paper) {
    return
  }

  isExporting.value = true
  saveConfig()
  await nextTick()

  try {
    paper.style.transform = 'none'
    await exportResumePdf(paper, fileName.value)
  } finally {
    paper.style.removeProperty('transform')
    isExporting.value = false
  }
}

async function copyConfig(): Promise<void> {
  await navigator.clipboard.writeText(configJson.value)
}

function updatePreviewScale(): void {
  const availableWidth = window.innerWidth - 36
  previewScale.value = Math.min(1, Math.max(0.42, availableWidth / paperWidth))
}
</script>

<template>
  <main class="app-shell">
    <ResumeEditor v-model="resume" :saved="saved" @save="saveConfig" @reset="resetResume" />

    <section class="preview-workbench" aria-label="简历预览与导出">
      <header class="workbench-topbar">
        <div>
          <p><Monitor :size="15" aria-hidden="true" /> A4 实时预览</p>
          <h1>{{ resume.profile.name || '未命名简历' }}</h1>
        </div>
        <div class="topbar-actions">
          <button type="button" class="tool-button ghost" @click="copyConfig">
            <FileJson :size="16" aria-hidden="true" />
            复制配置
          </button>
          <button type="button" class="tool-button ghost" @click="saveConfig">
            <Save :size="16" aria-hidden="true" />
            保存
          </button>
          <button type="button" class="tool-button primary export-button" :disabled="isExporting" @click="handleExport">
            <Download :size="16" aria-hidden="true" />
            {{ isExporting ? '导出中...' : '导出 PDF' }}
          </button>
        </div>
      </header>

      <div ref="previewRef" :class="['paper-stage', { 'is-exporting': isExporting }]">
        <div class="paper-viewport" :style="paperViewportStyle">
          <ResumePreview :resume="resume" />
        </div>
      </div>
    </section>
  </main>
</template>
