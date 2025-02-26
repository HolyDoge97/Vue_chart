<template>
  <div class="flex-col">
    <input type="select">
    <input type="select">
    <input type="text">
    <input type="select">
    <input type="range">
    <input type="range">
    <input type="range">
    <input type="range">
    <input type="checkbox">
    <input type="checkbox">
    <!-- 
      모델 - 셀
      비율 - 셀
      타일 - 인
      출력확장자 - 셀
      노이즈 - 렌
      선명도 - 렌
      채도 - 렌
      노출 - 렌
      hdr - 체
      아티 - 체
    -->
  </div>
  
</template>

<script setup lang="js">
const props = defineProps({
  getElementWidth: {
    type: Number,
    required: true
  }
})

// const { width: `${props.getElementWidth}px` }

</script>

<style>

</style>