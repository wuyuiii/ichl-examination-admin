<script lang="ts" setup></script>

<template>
  <div class="footer-container">
    <div class="lianxi">
      <el-tooltip
        class="item"
        effect="dark"
        content="微信：hhh4413_"
        placement="top"
      >
        <svg class="icon font" aria-hidden="true">
          <use xlink:href="#icon-weixin"></use>
        </svg>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="QQ：1195923419"
        placement="top"
      >
        <svg class="icon font" aria-hidden="true">
          <use xlink:href="#icon-QQ"></use>
        </svg>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="访问我的gitee"
        placement="top"
      >
        <a href="https://gitee.com/xiaoyin001" target="_blank">
          <svg class="icon font" aria-hidden="true">
            <use xlink:href="#icon-gitee"></use>
          </svg>
        </a>
      </el-tooltip>
    </div>
    <a href="https://beian.miit.gov.cn" class="beian" target="_blank">
      粤ICP备2023073501号
    </a>
  </div>
</template>

<style lang="scss" scoped>
.footer-container {
  height: 100%;
  border-top: 1px solid var(--el-border-color);
  padding: 0.625rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 0.875rem;
  .lianxi {
    display: flex;
    justify-content: center;
  }
  .font {
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
  }
  .beian {
    color: #cac9c9;
  }
}
</style>
