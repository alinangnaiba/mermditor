<template>
  <div :id="section.id" class="guide-block">
    <div class="block-heading">{{ section.title }}</div>
    <p v-if="section.description" class="block-desc" v-html="section.description" />

    <table v-if="section.tableHeaders && section.tableRows" class="ref-table">
      <thead>
        <tr>
          <th v-for="header in section.tableHeaders" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in section.tableRows" :key="`${section.id}-${rowIndex}`">
          <td
            v-for="(cell, cellIndex) in row"
            :key="`${section.id}-${rowIndex}-${cellIndex}`"
            :class="cellIndex === 1 ? 'ref-output' : cellIndex === row.length - 1 && row.length > 2 ? 'ref-note' : ''"
            v-html="cell"
          />
        </tr>
      </tbody>
    </table>

    <div v-if="section.codeSample" class="code-example">
      <div class="code-example-header"><span class="code-lang">{{ section.codeLang }}</span></div>
      <pre>{{ section.codeSample }}</pre>
    </div>

    <div v-if="section.callout" class="guide-callout" v-html="section.callout" />
  </div>
</template>

<script setup lang="ts">
  import type { GuideSectionData } from '../utils/guideSections'

  defineProps<{
    section: GuideSectionData
  }>()
</script>
