export const scrollLoadMore = (app: any) => {
  app.directive('loadmore', {
    mounted(el: any, binding: any, vnode: any) {
      const dom =
        vnode.children[0].component.refs.popperRef.contentRef.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
      function loadMores(this: any) {
        // 判断是否到底
        const isBottom = this.scrollHeight - this.scrollTop == this.clientHeight
        if (isBottom) {
          // 执行事件回调
          binding.value && binding.value() // 可以优化
        }
      }
      // 将获取到的dom和函数挂载  到el-select上，以便实例销毁时进行事件移除处理
      el._selectDom = dom
      el._selectLoadMore = loadMores
      // 监听滚动事件
      dom?.addEventListener('scroll', loadMores.bind(dom))
    },
    // 实例销毁
    beforeUnmount(el: any) {
      if (el._selectLoadMore) {
        el._selectDom.removeEventListener('scroll', el._selectLoadMore)
        delete el._selectDom
        delete el._selectLoadMore
      }
    }
  })
}
