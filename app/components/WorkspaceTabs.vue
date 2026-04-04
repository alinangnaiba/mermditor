<template>
  <div v-if="!isMobile" ref="tabsContainerRef" class="workspace-tabs">
    <button
      v-for="fileId in openFileIds"
      :key="fileId"
      class="workspace-tab"
      :class="{ active: fileId === activeFileId }"
      @click="openFile(fileId)"
    >
      <span class="workspace-tab-dot" />
      <span class="workspace-tab-name">{{ getFileName(fileId) }}</span>
      <span
        v-if="openFileIds.length > 1"
        class="workspace-tab-close"
        @click.stop="closeTab(fileId)"
      >
        ×
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue'

  /* eslint-disable no-unused-vars */
  interface Props {
    isMobile: boolean
    openFileIds: string[]
    activeFileId: string
    getFileName: (fileId: string) => string
    openFile: (fileId: string) => void
    closeTab: (fileId: string) => void
  }
  /* eslint-enable no-unused-vars */

  const props = defineProps<Props>()

  const tabsContainerRef = ref<HTMLElement | null>(null)

  watch(
    () => props.activeFileId,
    async (fileId) => {
      if (!fileId || !tabsContainerRef.value) return

      await nextTick()
      const activeTab = tabsContainerRef.value.querySelector<HTMLElement>('.workspace-tab.active')
      activeTab?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
  )
</script>
