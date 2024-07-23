<script lang="ts" setup></script>

<template>
  <div class="footer-container">
    <div class="lianxi">
      <el-tooltip
        class="item"
        effect="dark"
        :content="`${$t('FOOTER.WX')}：hhh4413_`"
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
        :content="$t('FOOTER.GITEE')"
        placement="top"
      >
        <a href="https://gitee.com/xiaoyin001" target="_blank">
          <svg class="icon font" aria-hidden="true">
            <use xlink:href="#icon-gitee"></use>
          </svg>
        </a>
      </el-tooltip>
    </div>
    <div class="beian">
      <a href="https://beian.miit.gov.cn" target="_blank">
        粤ICP备2023073501号
      </a>
    </div>
    <div style="flex: 1"></div>
  </div>
</template>

<style lang="scss" scoped>
.footer-container {
  height: 100%;
  border-top: 1px solid var(--el-border-color);
  padding: 0.625rem 1.25rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.875rem;
  .lianxi {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    .font {
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s;
      fill: #cac9c9;
      &:hover {
        fill: #fcfcfc;
      }
    }
  }
  .beian {
    flex: 1;
    text-align: center;
    a {
      transition: all 0.2s ease-in-out;
      color: #cac9c9;

      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>
