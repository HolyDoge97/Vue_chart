
<template>
  <div class="layout__container">
    <div class="not-found__main-layer">
      <span>4<strong>0</strong>4</span>
    </div>
    <div class="not-found__sub-layer">
      <span class="not--layer">페이지를 찾을 수 없습니다.</span>
      <button class="bu-basic full-width medium" @click="goToBackPage">
        메인 페이지로
      </button>
    </div>
  </div>
</template>

<script setup lang="js">
import router from '@/router';

const goToBackPage = () => {
  router.push({ name: 'UpscaleMain' })
}

</script>

<style lang="scss">
</style>