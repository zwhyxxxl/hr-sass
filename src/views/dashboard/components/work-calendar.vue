<template>
  <!-- 工作日历 -->
  <div>
    <!-- 年和月 -->
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width:120px" @change="dateChange">
        <!-- 年  用组件的给定一个日期，用日期获取年，去他的前五年+后五年-->
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width:120px;margin-left:10px" @change="dateChange">
        <!-- 循环12个数 -->
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <!-- 放一个日历组件 -->
    <el-calendar v-model="currentDate">
      <template #dateCell="{date,data }">
        <!-- date是当前单元格的日期，data（包括 type，isSelected，day 属性） -->
        <div class="date-content">
          <span class="text">
            {{ data.day|getDay }}
          </span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  // 过滤器
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()// 没有传递startdate就取当前时间
    }
  },
  data() {
    return {
      yearList: [], // 要遍历年的数组
      currentYear: null, // 当前年份
      currentMonth: null, // 当前月份
      currentDate: null
    }
  },

  created() {
    // 获取当前的年份
    this.currentYear = this.startDate.getFullYear()
    // 获取当前的月份
    this.currentMonth = this.startDate.getMonth() + 1
    // 获取当前时间
    this.dateChange
    // 快速生成素组的方法
    this.yearList = Array.from(Array(11), (v, i) => i + this.currentYear - 5)
  },
  methods: {
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`) // 以当前月的1号为起始
    },
    /**
     * 判断当前是否是周末
     */
    isWeek(date) {
      return date.getDay() === 0 || date.getDay() === 6
    }
  }
}
</script>

<style  scoped>
 ::v-deep .el-calendar-day {
  height:  auto;
 }
 ::v-deep .el-calendar-table__row td,::v-deep .el-calendar-table tr td:first-child,  ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 ::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 ::v-deep .el-calendar__header {
   display: none
 }
</style>
