<script lang="ts" setup>
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  type GridComponentOption
} from 'echarts/components'
import { LineChart, type LineSeriesOption } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { onMounted } from 'vue'
import { getChartsDataAPI } from '@/api/home'
import type { ChartsData } from '@/interface/chartsCom'

echarts.use([
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  TitleComponent,
  TooltipComponent
])

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption
>

const getChartsData = async () => {
  const { data: res } = await getChartsDataAPI()
  if (res.status === 200) {
    handleChartsData(res.data)
  }
}

// 数据处理
const handleChartsData = (data: ChartsData) => {
  // 补全 userData
  data.days.forEach((day) => {
    if (day <= new Date().getDate()) {
      const found = data.userData.find((item) => parseInt(item.name) === day)
      if (!found) {
        data.userData.push({ name: `${day}日`, value: '0' })
      }
    }
  })
  data.userData.sort((a, b) => parseInt(a.name) - parseInt(b.name))

  // 补全 questionData
  const allMonths = Array.from({ length: new Date().getMonth() }, (_, i) =>
    String(i + 2).padStart(2, '0')
  )
  data.questionData.sort((a, b) => parseInt(a.name) - parseInt(b.name)) // 按月份排序
  allMonths.forEach((month) => {
    const found = data.questionData.find((item) => item.name === month)
    if (!found) {
      data.questionData.push({ name: `${+month}月`, value: '0' })
    }
  })

  getCharts(data)
}

// 生成ECharts
const getCharts = (data: ChartsData) => {
  const userOption: EChartsOption = {
    title: {
      left: 'center',
      text: '用户活跃度'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: data.days
    },
    yAxis: {},
    series: [
      {
        data: data.userData,
        type: 'line'
      }
    ]
  }
  const user = document.getElementById('user')!
  const userChart = echarts.init(user)
  userOption && userChart.setOption(userOption)

  const timu = document.getElementById('timu')!
  const timuChart = echarts.init(timu)
  const timuOption: EChartsOption = {
    title: {
      left: 'center',
      text: '题目月数量'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12'
      ]
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: data.questionData,
        type: 'line'
      }
    ]
  }
  timuOption && timuChart.setOption(timuOption)
}

onMounted(() => {
  getChartsData()
})
</script>

<template>
  <div class="charts-container">
    <div class="charts-user" id="user"></div>
    <div class="charts-timu" id="timu"></div>
  </div>
</template>

<style lang="scss" scoped>
.charts-container {
  .charts-user {
    width: 100%;
    height: 600px;
    margin-bottom: 20px;
  }
  .charts-timu {
    width: 100%;
    height: 600px;
  }
}
</style>
