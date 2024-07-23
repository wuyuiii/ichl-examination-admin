<script setup lang="ts">
import {
  Editify,
  AlexElement,
  type MenuConfigType,
  type ToolbarConfigType,
  mathformula
} from 'vue-editify'
import { h, onMounted, ref, watch } from 'vue'
import { useOptionStore } from '@/stores'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const optionStore = useOptionStore()

const props = defineProps({
  gapFill: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '<p></p>'
  }
})
const emits = defineEmits(['getGapFillCount', 'getEditorValue'])

const editorRef = ref()
const editorValue = ref(props.title)
watch(
  () => props.title,
  (newValue) => {
    editorValue.value = newValue
  }
)
const plugins = ref([
  mathformula({
    title: t('QUESTION.EDITOR_MATH')
  })
])
const menu: MenuConfigType = {
  mode: 'inner',
  undo: {
    // 撤销
    show: false
  },
  redo: {
    // 重做
    show: false
  },
  quote: {
    // 引用块
    show: false
  },
  separator: {
    // 分割线
    show: false
  },
  orderList: {
    // 有序列表
    show: false
  },
  unorderList: {
    // 无序列表
    show: false
  },
  task: {
    //任务列表
    show: false
  },
  underline: {
    // 下划线
    show: false
  },
  italic: {
    // 斜体
    show: false
  },
  strikethrough: {
    // 删除线
    show: false
  },
  code: {
    // 行内代码
    show: true
  },
  super: {
    // 上标
    show: true
  },
  sub: {
    // 下标
    show: true
  },
  formatClear: {
    // 清除格式
    show: false
  },
  codeBlock: {
    // 代码块
    show: true
  },
  bold: {
    // 加粗
    show: false
  },
  link: {
    // 插入链接
    show: false
  },
  sourceView: {
    // 代码视图
    show: true,
    leftBorder: false
  },
  fullScreen: {
    // 全屏
    show: false
  },
  heading: {
    // 标题
    show: false
  },
  indent: {
    // 缩进
    show: false
  },
  align: {
    // 对齐方式
    show: false
  },
  fontSize: {
    // 字号
    show: false
  },
  fontFamily: {
    // 字体
    show: false
  },
  lineHeight: {
    // 行高
    show: false
  },
  foreColor: {
    // 前景色
    show: false
  },
  backColor: {
    // 背景色
    show: false
  },
  image: {
    // 插入图片
    show: true
  },
  video: {
    // 插入视频
    show: true
  },
  table: {
    // 插入表格
    show: true
  },
  sequence: props.gapFill
    ? {
        //定义按钮的序列
        gapFillMenu: 0
      }
    : {},
  extends: {
    // 拓展菜单
    gapFillMenu: props.gapFill
      ? {
          title: t('QUESTION.EDITOR_GAP_FILL'),
          leftBorder: false,
          rightBorder: false,
          disabled: false,
          active: false,
          type: 'default',
          onOperate: () => {
            createGapFillElement()
          },
          default: (): any =>
            h(
              'svg',
              {
                class: 'icon',
                style: {
                  'font-size': '18px'
                },
                'aria-hidden': true
              },
              h('use', {
                'xlink:href': '#icon-fuwenbenbianjiqi_tiankong'
              })
            )
        }
      : {}
  }
}
const toolbar: ToolbarConfigType = {
  use: false
}
const gapFillCount = ref(0)
/**
 * 插入填空
 */
const createGapFillElement = () => {
  gapFillCount.value++
  // const parent = editorRef.value.editor.range.anchor.element.parent // 根据虚拟光标获取当前区域的父元素
  const span = AlexElement.create({
    type: 'text',
    parsedom: 'span',
    marks: { class: 'fill-span' },
    textcontent: gapFillCount.value + '',
    styles: {},
    locked: false
  })

  editorRef.value.editor.add
  editorRef.value.editor.insertElement(span, true)
  editorRef.value.editor.domRender(true)
  editorRef.value.editor.rangeRender()
  editorRef.value.editor.insertElement(AlexElement.getSpaceElement(), false)
  emits('getGapFillCount', gapFillCount.value)
}

onMounted(() => {
  // 监听删除键，如果删除填空则让答案选项减1
  editorRef.value.editor.on('keydown', (val: string, ele: KeyboardEvent) => {
    if (ele.keyCode === 8) {
      // 删除键
      setTimeout(() => {
        const stack = editorRef.value.editor.stack
        stack.forEach((stackItem: any) => {
          gapFillCount.value = stackItem.children.filter(
            (childrenItem: any) => childrenItem.marks?.class === 'fill-span'
          ).length
        })
        emits('getGapFillCount', gapFillCount.value)
      }, 0)
    }
  })
})

/**
 * 获取编辑器值
 */
const getValue = (newValue: string) => {
  emits('getEditorValue', newValue)
}
</script>

<template>
  <div
    class="rich-editor-container"
    :style="{ borderColor: optionStore.themeSwitch ? '#4C4D4F' : '#ccc' }"
  >
    <Editify
      v-model="editorValue"
      ref="editorRef"
      :placeholder="$t('QUESTION.QUESTION_TITLE_PLACEHOLDER')"
      :menu="menu"
      :toolbar="toolbar"
      :plugins="plugins"
      :dark="optionStore.themeSwitch"
      @change="getValue"
      :locale="optionStore.languageSwitch ? 'en_US' : 'zh_CN'"
    />
  </div>
</template>

<style lang="scss" scoped>
.rich-editor-container {
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #ccc;
  border-radius: 0.375rem;
  overflow: hidden;
  max-width: 31.25rem;

  :deep(.editify-content) {
    height: 15rem !important;
  }
}
</style>
