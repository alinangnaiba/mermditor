<template>
  <div class="space-y-6">
    <h2 class="mb-6 border-b border-gray-700 pb-2 text-2xl font-semibold">Keyboard Shortcuts</h2>
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-800">
            <th class="px-6 py-3">Action</th>
            <th class="px-6 py-3">Windows/Linux</th>
            <th class="px-6 py-3">macOS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="shortcut in editorShortcuts" :key="shortcut.action">
            <td class="px-6 py-4">{{ shortcut.action }}</td>
            <td class="px-6 py-4">
              <kbd
                class="rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-200"
                >{{ shortcut.keys[0] }}</kbd
              >
              <span v-if="shortcut.keys[1]" class="mx-1">+</span>
              <kbd
                v-if="shortcut.keys[1]"
                class="rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-200"
                >{{ shortcut.keys[1] }}</kbd
              >
              <span v-if="shortcut.keys[2]" class="mx-1">+</span>
              <kbd
                v-if="shortcut.keys[2]"
                class="rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-200"
                >{{ shortcut.keys[2] }}</kbd
              >
            </td>
            <td class="px-6 py-4">
              <kbd
                class="rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-200"
                >{{ shortcut.macKeys[0] }}</kbd
              >
              <span v-if="shortcut.macKeys[1]" class="mx-1">+</span>
              <kbd
                v-if="shortcut.macKeys[1]"
                class="rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-200"
                >{{ shortcut.macKeys[1] }}</kbd
              >
              <span v-if="shortcut.macKeys[2]" class="mx-1">+</span>
              <kbd
                v-if="shortcut.macKeys[2]"
                class="rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-200"
                >{{ shortcut.macKeys[2] }}</kbd
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const editorShortcuts = ref([
  { action: 'Toggle Bold', keys: ['Ctrl', 'B'], macKeys: ['⌘', 'B'] },
  { action: 'Toggle Italic', keys: ['Ctrl', 'I'], macKeys: ['⌘', 'I'] },
  { action: 'Insert Link', keys: ['Ctrl', 'K'], macKeys: ['⌘', 'K'] },
  { action: 'Toggle Strikethrough', keys: ['Ctrl', 'Shift', 'X'], macKeys: ['⌘', 'Shift', 'X'] },
  { action: 'Toggle Blockquote', keys: ['Ctrl', 'Shift', 'B'], macKeys: ['⌘', 'Shift', 'B'] },
  { action: 'Toggle Inline Code', keys: ['Ctrl', 'E'], macKeys: ['⌘', 'E'] },
  {
    action: 'Insert Fenced Code Block',
    keys: ['Ctrl', 'Shift', 'C'],
    macKeys: ['⌘', 'Shift', 'C'],
  },
  { action: 'Toggle Heading 1', keys: ['Ctrl', 'Shift', '1'], macKeys: ['⌘', 'Shift', '1'] },
  { action: 'Toggle Heading 2', keys: ['Ctrl', 'Shift', '2'], macKeys: ['⌘', 'Shift', '2'] },
  { action: 'Toggle Heading 3', keys: ['Ctrl', 'Shift', '3'], macKeys: ['⌘', 'Shift', '3'] },
  { action: 'Toggle Heading 4', keys: ['Ctrl', 'Shift', '4'], macKeys: ['⌘', 'Shift', '4'] },
  { action: 'Toggle Heading 5', keys: ['Ctrl', 'Shift', '5'], macKeys: ['⌘', 'Shift', '5'] },
  { action: 'Toggle Heading 6', keys: ['Ctrl', 'Shift', '6'], macKeys: ['⌘', 'Shift', '6'] },
  { action: 'Indent Line/Selection', keys: ['Tab'], macKeys: ['Tab'] },
  { action: 'Outdent Line/Selection', keys: ['Shift', 'Tab'], macKeys: ['Shift', 'Tab'] },
]);
</script>
