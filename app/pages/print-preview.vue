<template>
  <div class="print-preview-wrapper">
    <PrintPreviewToolbar
      :page-size="pageSize"
      :margins="margins"
      @update:page-size="onPageSizeChange"
      @update:margins="onMarginsChange"
      @print="handlePrint"
      @close="close"
    />

    <div ref="previewContainer" class="preview-container print:hidden" />

    <div id="print-content" class="print-content-source">
      <SafeHtml class="prose max-w-none" :content="content" />
    </div>

    <div v-if="loading" class="loading-overlay print:hidden">
      <div class="bg-white p-6 rounded-lg shadow-xl text-gray-900 flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p>Preparing document...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import SafeHtml from '../components/SafeHtml.vue'
  import PrintPreviewToolbar from '../components/PrintPreviewToolbar.vue'
  import { usePrintPreview } from '../composables/usePrintPreview'
  import type { MarginSize, PageSize } from '../utils/printStyles'

  definePageMeta({
    layout: 'print',
  })

  const { content, loading, previewContainer, pageSize, margins, reRenderPreview, handlePrint, close } =
    usePrintPreview()

  const onPageSizeChange = async (value: PageSize): Promise<void> => {
    pageSize.value = value
    await reRenderPreview()
  }

  const onMarginsChange = async (value: MarginSize): Promise<void> => {
    margins.value = value
    await reRenderPreview()
  }
</script>

<style>
.print-preview-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #525659;
}

.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: rgb(17 24 39);
  color: white;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-select {
  background-color: rgb(55 65 81);
  border: 1px solid rgb(75 85 99);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;
}

.settings-select:hover {
  background-color: rgb(75 85 99);
}

.settings-select:focus {
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.preview-container {
  width: 100%;
  margin-top: 5rem;
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: center;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

@media print {
  .print-preview-wrapper {
    min-height: auto !important;
    background: white !important;
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .toolbar {
    display: none !important;
  }

  .loading-overlay {
    display: none !important;
  }

  .preview-container {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }

  .print-content-source {
    display: none !important;
  }
}
</style>
