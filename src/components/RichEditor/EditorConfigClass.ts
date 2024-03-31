import {
  type IButtonMenu,
  type IDomEditor,
  type SlateElement,
  // type SlateDescendant,
  Boot,
  DomEditor
} from '@wangeditor/editor'
import { h, type VNode } from 'snabbdom'

/**
 * 插入填空菜单选项
 */
export class InsertGapFill implements IButtonMenu {
  title: string
  iconSvg?: string | undefined
  tag: string
  index: number
  constructor() {
    this.title = '插入填空' // 自定义菜单标题
    // this.iconSvg = '<svg>...</svg>' // 可选
    this.tag = 'button'
    this.index = 1
  }
  hotkey?: string | undefined
  alwaysEnable?: boolean | undefined
  width?: number | undefined

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(): string | boolean {
    return false
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(): boolean {
    return false
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor: IDomEditor): boolean {
    return false
  }

  // 点击菜单时触发的函数
  exec(editor: IDomEditor) {
    if (this.isDisabled(editor)) return

    // 1.填空节点结构
    const gapFill = {
      type: 'gapFill',
      value: `${this.index}`,
      children: [{ text: '' }] // void 元素必须有一个 children ，其中只有一个空字符串，重要！！！
    }

    this.index++
    editor.restoreSelection()
    editor.insertNode(gapFill)
    editor.move(1)

    console.log(editor.getHtml())
  }
}

const insertGapFill = {
  key: 'insertGapFilling', // 定义 menu key ：要保证唯一、不重复（重要）
  factory() {
    return new InsertGapFill() // 把 `YourMenuClass` 替换为你菜单的 class
  }
}
Boot.registerMenu(insertGapFill)

/**
 * 切换HTML
 */
export class SwitchHTMLMenu implements IButtonMenu {
  title: string
  iconSvg?: string | undefined
  tag: string
  constructor() {
    this.title = '切换HTML' // 自定义菜单标题
    this.iconSvg = `<svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-html"></use>
    </svg>`
    this.tag = 'button'
  }

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(): string | boolean {
    return false
  }

  // 菜单是否需要激活
  isActive(): boolean {
    return false
  }

  // 菜单是否需要禁用
  isDisabled(): boolean {
    return false
  }

  // 点击菜单时触发的函数
  exec(editor: IDomEditor): void {
    console.log(editor.getHtml())
  }
}
const switchHTMLMenu = {
  key: 'switchHTML', // 定义 menu key ：要保证唯一、不重复（重要）
  factory() {
    return new SwitchHTMLMenu() // 把 `YourMenuClass` 替换为你菜单的 class
  }
}
Boot.registerMenu(switchHTMLMenu)

/**
 * 2.将填空节点转为inline插件，元素默认为block
 * @param editor
 * @returns
 */
function withGapFill<T extends IDomEditor>(editor: T) {
  const { isInline, insertText, isVoid } = editor
  const newEditor = editor

  // 重写 insertText
  newEditor.insertText = (t) => {
    // 选过选中了 void 元素
    const elems = DomEditor.getSelectedElems(newEditor)
    const isSelectedVoidElem = elems.some((elem) => newEditor.isVoid(elem))
    if (isSelectedVoidElem) {
      insertText(t)
      return
    }

    insertText(t)
  }

  newEditor.isInline = (elem) => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'gapFill') return true // 针对 type: attachment ，设置为 inline
    return isInline(elem)
  }

  // 重写 isVoid
  newEditor.isVoid = (elem) => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'gapFill') {
      return true
    }

    return isVoid(elem)
  }

  return newEditor // 返回 newEditor ，重要！！！
}

//  3.注册插件
Boot.registerPlugin(withGapFill)

// 4.渲染新元素
/**
 * 渲染“填空”元素到编辑器
 * @param elem 附件元素，即上文的 gapFill
 * @param children 元素子节点，void 元素可忽略
 * @param editor 编辑器实例
 * @returns vnode 节点（通过 snabbdom.js 的 h 函数生成）
 */
function renderGapFill(
  elem: SlateElement
  // children: VNode[] | null,
  // editor: IDomEditor
): VNode {
  // 获取“附件”的数据，参考上文 gapFill 数据结构
  const { value = '' } = elem as any
  // text = ++index
  // 填空元素 vnode
  const gapFillVnode = h(
    // HTML tag
    'span',
    // HTML 属性、样式、事件
    {
      props: { contentEditable: false }, // HTML 属性，驼峰式写法
      style: {
        display: 'inline-block',
        padding: '0px 30px',
        borderBottom: '1px solid #ccc'
      } // style ，驼峰式写法
    },
    // 子节点
    `${value}`
  )

  return gapFillVnode
}
const renderElemConf = {
  type: 'gapFill', // 新元素 type ，重要！！！
  renderElem: renderGapFill
}
Boot.registerRenderElem(renderElemConf)

/**
 * 生成“填空”元素的 HTML
 * @param elem 附件元素，即上文的 myResume
 * @param childrenHtml 子节点的 HTML 代码，void 元素可忽略
 * @returns “附件”元素的 HTML 字符串
 */
function attachmentToHtml(elem: SlateElement): string {
  // 获取附件元素的数据
  const { value = '' } = elem as any

  // 生成 HTML 代码
  const html = `<span
          data-w-e-type="gapFill"
          data-w-e-is-void
          data-w-e-is-inline
          data-index="${value}"
          class="fill-span"
      >${value}</span>`

  return html
}

const elemToHtmlConf = {
  type: 'gapFill', // 新元素的 type ，重要！！！
  elemToHtml: attachmentToHtml
}

Boot.registerElemToHtml(elemToHtmlConf)
