<script lang="ts">
  import { defineComponent, h, onMounted, ref, toRef } from 'vue'
  import { useSafeHtml, type SafeHtmlKind } from '../composables/useSafeHtml'

  export default defineComponent({
    name: 'SafeHtml',
    inheritAttrs: false,
    props: {
      content: {
        type: String,
        required: true,
      },
      tag: {
        type: String,
        default: 'div',
      },
      kind: {
        type: String as () => SafeHtmlKind,
        default: 'html',
      },
    },
    setup(props, { attrs, expose }) {
      const element = ref<HTMLElement | null>(null)
      const { sanitizedContent } = useSafeHtml({
        content: toRef(props, 'content'),
        kind: toRef(props, 'kind'),
      })

      // Sanitizing needs a DOM, so SSR emits nothing. Vue does not patch innerHTML while
      // hydrating either, so the sanitized markup is applied to the element after mount.
      onMounted(() => {
        if (element.value && element.value.innerHTML !== sanitizedContent.value) {
          element.value.innerHTML = sanitizedContent.value
        }
      })

      expose({
        element,
      })

      return () =>
        h(props.tag, {
          ...attrs,
          ref: element,
          innerHTML: sanitizedContent.value,
        })
    },
  })
</script>
