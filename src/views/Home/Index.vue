<script lang="ts" setup>
import { ref } from 'vue'
import ChartsCom from './components/ChartsCom.vue'
import { getCardDataAPI } from '@/api/home'

const cardData: any = ref({})
const getCardData = async () => {
  const { data: res } = await getCardDataAPI()
  if (res.status === 200) {
    cardData.value = res.data
  }
}
getCardData()
</script>

<template>
  <div class="home-container">
    <div class="home-panel-group">
      <el-card class="home-panel" body-class="home-panel-body">
        <div class="home-panel-left icon-renshu">
          <svg
            class="icon home-panel-icon"
            aria-hidden="true"
            style="fill: #e58585"
          >
            <use xlink:href="#icon-renshu"></use>
          </svg>
        </div>
        <div class="home-panel-right">
          <span class="home-panel-title">学生人数</span>
          {{ cardData.studentCount }}
        </div>
      </el-card>
      <el-card class="home-panel" body-class="home-panel-body">
        <div class="home-panel-left icon-timu">
          <svg
            class="icon home-panel-icon"
            aria-hidden="true"
            style="fill: #2a6ce8"
          >
            <use xlink:href="#icon-timu"></use>
          </svg>
        </div>
        <div class="home-panel-right">
          <span class="home-panel-title">题目总数</span>
          {{ cardData.questionCount }}
        </div>
      </el-card>
      <el-card class="home-panel" body-class="home-panel-body">
        <div class="home-panel-left icon-shijuan">
          <svg
            class="icon home-panel-icon"
            aria-hidden="true"
            style="fill: #a32a1f"
          >
            <use xlink:href="#icon-he_39shijuanguanli"></use>
          </svg>
        </div>
        <div class="home-panel-right">
          <span class="home-panel-title">试卷总数</span>
          {{ cardData.paperCount }}
        </div>
      </el-card>
      <el-card class="home-panel" body-class="home-panel-body">
        <div class="home-panel-left icon-dajuan">
          <svg
            class="icon home-panel-icon"
            aria-hidden="true"
            style="fill: #a7eaac"
          >
            <use xlink:href="#icon-chakandajuan"></use>
          </svg>
        </div>
        <div class="home-panel-right">
          <span class="home-panel-title">答卷总数</span>
          {{ cardData.answerPaperCount }}
        </div>
      </el-card>
    </div>
    <div class="home-charts-group">
      <ChartsCom></ChartsCom>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-container {
  .home-panel-group {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 1.25rem;
    .home-panel {
      border: 0;
      border-radius: 8px !important;
      overflow: hidden;
      flex: 1;
      margin-right: 1rem;
      border-radius: 0;
      min-height: 6.25rem;
      cursor: pointer;

      &:hover {
        .home-panel-icon {
          font-size: 4rem;
          fill: #fff !important;
        }
        .icon-renshu {
          background-color: #e58585;
        }
        .icon-timu {
          background-color: #2a6ce8;
        }
        .icon-shijuan {
          background-color: #a32a1f;
        }
        .icon-dajuan {
          background-color: #a7eaac;
        }
      }
      &:last-child {
        margin-right: 0;
      }
      &:deep(.home-panel-body) {
        padding: 1rem 1.25rem;
        min-height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .home-panel-left {
          padding: 20px;
          transition: all 0.3s ease-out;
          border-radius: 0.375rem;
          .home-panel-icon {
            transition: all 0.3s ease-out;
            font-size: 4rem;
          }
        }
        .home-panel-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-weight: 1000;
          color: #666565;
          .home-panel-title {
            font-weight: 800;
            color: #878787;
            margin-bottom: 0.625rem;
          }
        }
      }
    }
  }
  .home-charts-group {
    margin-top: 2.5rem;
  }
}
</style>
