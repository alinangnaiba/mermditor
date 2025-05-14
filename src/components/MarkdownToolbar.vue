<template>  <v-card flat color="primary" class="toolbar-container">
    <v-toolbar density="compact" color="primary">
      <v-tooltip location="bottom" text="Bold">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="applyFormat('bold')">
            <v-icon>mdi-format-bold</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      
      <v-tooltip location="bottom" text="Italic">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="applyFormat('italic')">
            <v-icon>mdi-format-italic</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      
      <v-tooltip location="bottom" text="Heading">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="applyFormat('heading')">
            <v-icon>mdi-format-header-1</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      
      <v-divider vertical class="mx-2" />
      
      <v-tooltip location="bottom" text="Bulleted List">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="applyFormat('bulletList')">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      
      <v-tooltip location="bottom" text="Numbered List">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="applyFormat('numberList')">
            <v-icon>mdi-format-list-numbered</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      
      <v-divider vertical class="mx-2" />
      
      <v-tooltip location="bottom" text="Link">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="applyFormat('link')">
            <v-icon>mdi-link</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      
      <v-tooltip location="bottom" text="Image">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="applyFormat('image')">
            <v-icon>mdi-image</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      
      <v-divider vertical class="mx-2" />
      
      <v-tooltip location="bottom" text="Code Block">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="applyFormat('codeBlock')">
            <v-icon>mdi-code-braces</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      
      <v-tooltip location="bottom" text="Mermaid Diagram">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="applyFormat('mermaid')">
            <v-icon>mdi-chart-timeline-variant</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-toolbar>
  </v-card>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'format', formatType: string, selection: { start: number; end: number; text: string }): void;
}>();

/**
 * Apply formatting based on selected format type
 * @param formatType - The type of formatting to apply
 */
const applyFormat = (formatType: string) => {
  // Get textarea element to work with selection
  const textArea = document.querySelector('.markdown-input textarea') as HTMLTextAreaElement;
  
  if (!textArea) {
    console.error('Textarea element not found');
    return;
  }

  const start = textArea.selectionStart;
  const end = textArea.selectionEnd;
  const selectedText = textArea.value.substring(start, end);

  // Emit event with formatting data
  emit('format', formatType, { start, end, text: selectedText });
};
</script>

<style scoped>
.toolbar-container {
  margin-bottom: 8px;
  border-radius: 4px;
}
</style>
