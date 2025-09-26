<template>
  <div class="flex-shrink-0 border-b border-gray-700 bg-gray-800 px-4 py-2">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <!-- Formatting Buttons - Two Rows -->
      <div class="flex flex-col gap-2">
        <!-- First Row -->
        <div class="flex flex-wrap items-center gap-1 space-x-1 sm:space-x-2">
          <!-- File Operations -->
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Import Markdown (Ctrl+O)"
            @click="actions.importMarkdownFile()"
          >
            <PhDownloadSimple :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Export Markdown (Ctrl+Shift+S)"
            @click="actions.exportMarkdownFile()"
          >
            <PhExport :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Save As..."
            @click="showFilenameModal = true"
          >
            <PhFloppyDisk :size="16" />
          </button>

          <div class="mx-2 h-6 w-px bg-gray-700" />

          <!-- Text Formatting -->
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Bold (Ctrl+B)"
            @click="actions.insertFormat('**', '**')"
          >
            <PhTextB :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Italic (Ctrl+I)"
            @click="actions.insertFormat('*', '*')"
          >
            <PhTextItalic :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Strikethrough"
            @click="actions.insertFormat('~~', '~~')"
          >
            <PhTextStrikethrough :size="16" />
          </button>
          <!-- Headings -->
          <HeadingPicker :actions="{ insertHeading: props.actions.insertHeading }" />
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Highlight (Ctrl+Shift+H)"
            @click="actions.insertHighlight()"
          >
            <PhHighlighter :size="16" />
          </button>

          <div class="mx-2 h-6 w-px bg-gray-700" />

          <!-- Code -->
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Inline Code (Ctrl+`)"
            @click="actions.insertFormat('`', '`')"
          >
            <PhCode :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Code Block (Ctrl+Shift+~)"
            @click="actions.insertCodeBlock()"
          >
            <PhCodeBlock :size="16" />
          </button>
        </div>

        <!-- Second Row -->
        <div class="flex flex-wrap items-center gap-1 space-x-1 sm:space-x-2">
          <!-- Lists & Structure -->
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Bullet List"
            @click="actions.insertList('-')"
          >
            <PhListBullets :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Numbered List"
            @click="actions.insertList('1.')"
          >
            <PhListNumbers :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Task List (Ctrl+Shift+L)"
            @click="actions.insertTaskList()"
          >
            <PhCheckSquare :size="16" />
          </button>

          <div class="mx-2 h-6 w-px bg-gray-700" />

          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Blockquote (Ctrl+Q)"
            @click="actions.insertBlockquote()"
          >
            <PhQuotes :size="16" />
          </button>

          <!-- Extended Features -->
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Footnote"
            @click="actions.insertFootnote()"
          >
            <PhNotePencil :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Definition List (Ctrl+Shift+R)"
            @click="actions.insertDefinitionList()"
          >
            <PhListMagnifyingGlass :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Subscript (Ctrl+Shift+Y)"
            @click="actions.insertSubscript()"
          >
            <PhTextSubscript :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Superscript (Ctrl+Shift+U)"
            @click="actions.insertSuperscript()"
          >
            <PhTextSuperscript :size="16" />
          </button>

          <div class="mx-2 h-6 w-px bg-gray-700" />

          <!-- Emoji Picker -->
          <EmojiPicker :actions="{ insertEmoji: actions.insertEmoji }" />

          <!-- Links & Images -->
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Link (Ctrl+K)"
            @click="actions.insertFormat('[](', ')')"
          >
            <PhLink :size="16" />
          </button>
          <button
            class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Image (Ctrl+Shift+M)"
            @click="actions.insertFormat('![](', ')')"
          >
            <PhImage :size="16" />
          </button>
        </div>
      </div>

      <!-- View Controls -->
      <div class="flex items-center space-x-4">
        <label class="flex items-center space-x-2 text-sm">
          <input
            :checked="autosave"
            type="checkbox"
            class="text-primary-500 focus:ring-primary-500 rounded border-gray-600 bg-gray-700 focus:ring-offset-gray-800"
            @change="$emit('update:autosave', ($event.target as HTMLInputElement).checked)"
          />
          <span class="text-gray-300">Autosave</span>
        </label>

        <button
          class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          title="Clear data"
          @click="$emit('clear-storage')"
        >
          <PhBroom :size="16" />
        </button>

        <button
          class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          :title="showPreview ? 'Hide Preview' : 'Show Preview'"
          @click="$emit('toggle-preview')"
        >
          <PhEyeSlash v-if="showPreview" :size="16" />
          <PhEye v-else :size="16" />
        </button>

        <button
          class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          :title="showEditor ? 'Hide Editor' : 'Show Editor'"
          @click="$emit('toggle-editor')"
        >
          <PhPencilSimple v-if="showEditor" :size="16" />
          <PhPencilSimpleSlash v-else :size="16" />
        </button>
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
