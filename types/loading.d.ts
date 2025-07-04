import { Ref } from 'vue';

export interface ResourceLoadState {
  mermaid: boolean;
  katex: boolean;
  markdownIt: boolean;
  hljs: boolean;
}

export interface LoadingState {
  isAppLoading: Ref<boolean>;
  resourcesLoaded: Ref<ResourceLoadState>;
  setResourceLoaded: (resourceName: keyof ResourceLoadState) => boolean;
  forceLoadingComplete: () => void;
}

declare module '#app' {
  interface NuxtApp {
    $loading: LoadingState;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $loading: LoadingState;
  }
}
