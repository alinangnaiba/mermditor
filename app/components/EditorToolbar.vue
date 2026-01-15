<template>
  <div class="flex-shrink-0 border-b border-gray-700 bg-gray-800 px-4 py-2">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <!-- Toolbar Groups -->
      <div class="flex flex-wrap items-end gap-2">

        <!-- File Group -->
        <div class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 font-medium px-1 uppercase tracking-wider">File</span>
          <div class="flex items-center gap-1 bg-gray-900/30 p-1 rounded-lg border border-gray-700/50">
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Import Markdown (Ctrl+O)"
              @click="actions.importMarkdownFile()"
            >
              <PhDownloadSimple :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Export Markdown (Ctrl+Shift+S)"
              @click="actions.exportMarkdownFile()"
            >
              <PhExport :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Export to PDF"
              @click="actions.exportPdf()"
            >
              <PhFilePdf :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Save As..."
              @click="showFilenameModal = true"
            >
              <PhFloppyDisk :size="18" />
            </button>
          </div>
        </div>

        <!-- Format Group -->
        <div class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 font-medium px-1 uppercase tracking-wider">Format</span>
          <div class="flex items-center gap-1 bg-gray-900/30 p-1 rounded-lg border border-gray-700/50">
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Bold (Ctrl+B)"
              @click="actions.insertFormat('**', '**')"
            >
              <PhTextB :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Italic (Ctrl+I)"
              @click="actions.insertFormat('*', '*')"
            >
              <PhTextItalic :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Strikethrough"
              @click="actions.insertFormat('~~', '~~')"
            >
              <PhTextStrikethrough :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Highlight (Ctrl+Shift+H)"
              @click="actions.insertHighlight()"
            >
              <PhHighlighter :size="18" />
            </button>
          </div>
        </div>

        <!-- Structure Group -->
        <div class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 font-medium px-1 uppercase tracking-wider">Structure</span>
          <div class="flex items-center gap-1 bg-gray-900/30 p-1 rounded-lg border border-gray-700/50">
            <HeadingPicker :actions="{ insertHeading: props.actions.insertHeading }" />
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Blockquote (Ctrl+Q)"
              @click="actions.insertBlockquote()"
            >
              <PhQuotes :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Inline Code (Ctrl+`)"
              @click="actions.insertFormat('`', '`')"
            >
              <PhCode :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Code Block (Ctrl+Shift+~)"
              @click="actions.insertCodeBlock()"
            >
              <PhCodeBlock :size="18" />
            </button>
          </div>
        </div>

        <!-- Lists Group -->
        <div class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 font-medium px-1 uppercase tracking-wider">List</span>
          <div class="flex items-center gap-1 bg-gray-900/30 p-1 rounded-lg border border-gray-700/50">
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Bullet List"
              @click="actions.insertList('-')"
            >
              <PhListBullets :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Numbered List"
              @click="actions.insertList('1.')"
            >
              <PhListNumbers :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Task List (Ctrl+Shift+L)"
              @click="actions.insertTaskList()"
            >
              <PhCheckSquare :size="18" />
            </button>
             <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Definition List (Ctrl+Shift+R)"
              @click="actions.insertDefinitionList()"
            >
              <PhListMagnifyingGlass :size="18" />
            </button>
          </div>
        </div>

        <!-- Insert Group -->
        <div class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 font-medium px-1 uppercase tracking-wider">Insert</span>
          <div class="flex items-center gap-1 bg-gray-900/30 p-1 rounded-lg border border-gray-700/50">
             <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Link (Ctrl+K)"
              @click="actions.insertFormat('[](', ')')"
            >
              <PhLink :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Image (Ctrl+Shift+M)"
              @click="actions.insertFormat('![](', ')')"
            >
              <PhImage :size="18" />
            </button>
            <EmojiPicker :actions="{ insertEmoji: actions.insertEmoji }" />
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Footnote"
              @click="actions.insertFootnote()"
            >
              <PhNotePencil :size="18" />
            </button>
          </div>
        </div>

        <!-- Advanced Group -->
        <div class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 font-medium px-1 uppercase tracking-wider">Extra</span>
          <div class="flex items-center gap-1 bg-gray-900/30 p-1 rounded-lg border border-gray-700/50">
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Subscript (Ctrl+Shift+Y)"
              @click="actions.insertSubscript()"
            >
              <PhTextSubscript :size="18" />
            </button>
            <button
              class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Superscript (Ctrl+Shift+U)"
              @click="actions.insertSuperscript()"
            >
              <PhTextSuperscript :size="18" />
            </button>
          </div>
        </div>

      </div>

      <!-- View Controls -->
      <div class="flex flex-col gap-1 items-end mb-1">
        <!-- <span class="text-[10px] text-gray-500 font-medium px-1 uppercase tracking-wider">View</span> -->
        <div class="flex items-center space-x-3 bg-gray-900/30 p-1.5 rounded-lg border border-gray-700/50 h-[38px]">
          <label class="flex items-center space-x-2 text-sm cursor-pointer select-none">
            <input
              :checked="autosave"
              type="checkbox"
              class="text-primary-500 focus:ring-primary-500 rounded border-gray-600 bg-gray-700 focus:ring-offset-gray-800"
              @change="$emit('update:autosave', ($event.target as HTMLInputElement).checked)"
            />
            <span class="text-gray-300 text-xs">Autosave</span>
          </label>

          <div class="h-4 w-px bg-gray-700" />

          <button
            class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Clear data"
            @click="$emit('clear-storage')"
          >
            <PhBroom :size="18" />
          </button>

          <button
            class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            :title="showPreview ? 'Hide Preview' : 'Show Preview'"
            @click="$emit('toggle-preview')"
          >
            <PhEyeSlash v-if="showPreview" :size="18" />
            <PhEye v-else :size="18" />
          </button>

          <button
            class="editor-toolbar-btn rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            :title="showEditor ? 'Hide Editor' : 'Show Editor'"
            @click="$emit('toggle-editor')"
          >
            <PhPencilSimple v-if="showEditor" :size="18" />
            <PhPencilSimpleSlash v-else :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filename Modal -->
    <FilenameModal
      :is-open="showFilenameModal"
      :default-filename="defaultFilename"
      @save="handleSaveAs"
      @cancel="showFilenameModal = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import type { EditorActions } from '../composables/useEditorActions'
  import {
    PhDownloadSimple,
    PhExport,
    PhFilePdf,
    PhFloppyDisk,
    PhTextB,
    PhTextItalic,
    PhTextStrikethrough,
    PhHighlighter,
    PhCode,
    PhCodeBlock,
    PhListBullets,
    PhListNumbers,
    PhCheckSquare,
    PhQuotes,
    PhNotePencil,
    PhListMagnifyingGlass,
    PhTextSubscript,
    PhTextSuperscript,
    PhLink,
    PhImage,
    PhEye,
    PhEyeSlash,
    PhPencilSimple,
    PhPencilSimpleSlash,
    PhBroom,
  } from '@phosphor-icons/vue'
  import EmojiPicker from './EmojiPicker.vue'
  import FilenameModal from './FilenameModal.vue'
  import HeadingPicker from './HeadingPicker.vue'

  interface Props {
    actions: EditorActions
    autosave: boolean
    showPreview: boolean
    showEditor: boolean
  }

  const props = defineProps<Props>()

  defineEmits<{
    'toggle-preview': []
    'toggle-editor': []
    'update:autosave': [value: boolean]
    'clear-storage': []
  }>()

  const showFilenameModal = ref(false)

  const defaultFilename = computed(() => {
    return `document-${new Date().toISOString().split('T')[0]}`
  })

  const handleSaveAs = (filename: string) => {
    props.actions.saveAsMarkdownFile(filename)
    showFilenameModal.value = false
  }

  const handleClickOutside = () => {
    // Add any global click outside logic here if needed
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>
