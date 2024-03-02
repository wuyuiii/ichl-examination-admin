<script lang="ts" setup></script>

<template>
  <div class="home-container">
    <div class="home-panel-group">
      <el-card
        class="home-panel"
        shadow="never"
        body-class="home-panel-body"
        v-for="(item, index) in 6"
        :key="index"
      >
        <div class="home-panel-left">logo</div>
        <div class="home-panel-right">
          <span class="home-panel-title">1</span>
          {{ item }}
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-container {
  height: 1000px;
  .home-panel-group {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 1.25rem;
    .home-panel {
      flex: 1;
      margin-right: 1rem;
      border-radius: 0;
      min-height: 6.25rem;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &:deep(.home-panel-body) {
        min-height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .home-panel-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
  }
}
</style>
