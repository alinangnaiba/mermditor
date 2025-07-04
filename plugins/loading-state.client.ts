// This plugin helps manage loading state across the application
import { ref } from 'vue';

export default defineNuxtPlugin({
  name: 'app-loading',
  setup() {
    const isAppLoading = ref(true);
    const resourcesLoaded = ref({
      mermaid: false,
      katex: false,
      markdownIt: false,
      hljs: false
    });

    const checkAllLoaded = () => {
      const allLoaded = Object.values(resourcesLoaded.value).every(val => val);
      if (allLoaded) {
        isAppLoading.value = false;
      }
      return allLoaded;
    };

    const setResourceLoaded = (resourceName: keyof typeof resourcesLoaded.value) => {
      resourcesLoaded.value[resourceName] = true;
      return checkAllLoaded();
    };

    const forceLoadingComplete = () => {
      Object.keys(resourcesLoaded.value).forEach(key => {
        resourcesLoaded.value[key as keyof typeof resourcesLoaded.value] = true;
      });
      isAppLoading.value = false;
    };

    setTimeout(() => {
      if (isAppLoading.value) {
        forceLoadingComplete();
        console.log('Loading state was force-completed after timeout');
      }
    }, 5000);

    return {
      provide: {
        loading: {
          isAppLoading,
          resourcesLoaded,
          setResourceLoaded,
          forceLoadingComplete
        }
      }
    };
  }
});
