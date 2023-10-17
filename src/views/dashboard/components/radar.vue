<template>
  <!-- 雷达图  图表必须给高和宽度-->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// 按需加载过程
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])
export default {

  // 页面渲染完毕事件
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv)
    myChart.setOption({
      title: {
        text: 'Basic Radar Chart'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // 每个区域的最高值
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极程度', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [80, 90, 40, 80, 10, 30],
              name: '张三'
            },
            {
              value: [90, 90, 90, 95, 90, 0],
              name: '李四'
            }
          ]
        }
      ]
    })
  }
}
</script>

<style>
.radar-echart{
    width: 600px;
    height: 400px;
}
</style>
