<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="500">
    <v-card>
      <v-card-title class="text-h5 pb-2">
        Editor Settings
      </v-card-title>
      <v-card-text>
        <v-list bg-color="transparent">
          <v-list-item>
            <template v-slot:prepend>
              <v-icon>mdi-format-font</v-icon>
            </template>
            <v-list-item-title>Font Size: {{ settings.fontSize }}px</v-list-item-title>
            <v-list-item-subtitle>
              <v-slider
                v-model="settings.fontSize"
                :min="12"
                :max="24"
                :step="1"
                thumb-label
              ></v-slider>
            </v-list-item-subtitle>
          </v-list-item>
          
          <v-list-item>
            <template v-slot:prepend>
              <v-icon>mdi-theme-light-dark</v-icon>
            </template>
            <v-list-item-title>Theme</v-list-item-title>
            <v-list-item-subtitle>
              <v-select
                v-model="settings.theme"
                :items="[
                  { title: 'Dark', value: 'dark' },
                  { title: 'Light', value: 'light' }
                ]"
                item-title="title"
                item-value="value"
                variant="outlined"
                hide-details
                density="compact"
              ></v-select>
            </v-list-item-subtitle>
          </v-list-item>
          
          <v-list-item>
            <template v-slot:prepend>
              <v-icon>mdi-content-save-outline</v-icon>
            </template>
            <v-list-item-title>Auto-save</v-list-item-title>
            <v-list-item-subtitle>
              Save content automatically every 30 seconds
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-switch
                v-model="settings.autoSave"
                color="primary"
                hide-details
              ></v-switch>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="cancel">Cancel</v-btn>
        <v-btn color="primary" @click="save">Apply Settings</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  initialSettings: {
    fontSize: number;
    theme: string;
    autoSave: boolean;
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', settings: { fontSize: number; theme: string; autoSave: boolean }): void;
}>();

// Create a copy of the settings to avoid mutation
const settings = ref({...props.initialSettings});

// Watch for changes to initialSettings and update our local copy
watch(() => props.initialSettings, (newSettings) => {
  settings.value = {...newSettings};
}, { deep: true });

// Save settings and close dialog
const save = () => {
  emit('save', settings.value);
  emit('update:modelValue', false);
};

// Cancel without saving
const cancel = () => {
  emit('update:modelValue', false);
};
</script>
