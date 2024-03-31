<script lang="ts" setup>
import { onBeforeUnmount, ref, shallowRef, watch, type PropType } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import './EditorConfigClass'
import type { CreateQuestionType } from '@/interface'

const props = defineProps({
  form: {
    type: Object as PropType<CreateQuestionType>,
    required: true
  }
})
const formValue = ref<CreateQuestionType>(props.form)
// 监听 title 变化，判断填空元素个数，生成填空答案选项
watch(
  () => formValue.value.title,
  (newV) => {
    const count = (newV.match(/<span\b[^>]*>/g) || []).length
    if (count === 0) {
      return (formValue.value.items = [])
    }
    const items = []
    for (let i = 0; i < count; i++) {
      const item = {
        content: formValue.value.items[i]?.content || '',
        prefix: `${i + 1}`
      }
      items.push(item)
    }
    formValue.value.items = items
  }
)

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const toolbarConfig = {
  toolbarKeys: ['switchHTML', '|', 'insertGapFilling']
}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
</script>

<template>
  <div class="editor-container">
    <Toolbar
      class="toolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="simple"
    />
    <Editor
      style="height: 300px"
      v-model="formValue.title"
      :defaultConfig="editorConfig"
      mode="simple"
      @onCreated="handleCreated"
    />
  </div>
</template>

<style lang="scss" scoped>
.editor-container {
  border: 1px solid var(--el-border-color);
  width: 600px;
  .toolbar {
    border-bottom: 1px solid var(--el-border-color);
  }

  .w-e-bar-divider {
    background-color: var(--el-border-color);
  }

  &:deep(.w-e-bar-item button:hover) {
    background-color: transparent;
    color: var(--el-color-primary);
  }
}
</style>
