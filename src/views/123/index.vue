<template>
  <div>
    <div class="block">
      <span class="demonstration">显示间断点{{ id }}</span>
      <el-slider v-model="value2" :min="20" :step="10" :show-stops="false" @change="change" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
      value2: 0
    }
  },
  beforeCreate() {
    console.log(this.$route)
  },
  created() {
    console.log(this.$route)
  },
  methods: {
    change() {
      console.log(this.value2)
    }
  }
}
</script>

<style></style>
