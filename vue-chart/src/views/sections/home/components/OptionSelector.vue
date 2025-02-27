<template>
  <div class="option__container" :style="getImageWidth">
    <div class="option__block">
      <!-- 모델 -->
      <input-select-box
        :datas="modelList"
        v-model="selectedValue"
        @update:modelValue="newValue => selectedModel = newValue"
        :placeholder="'모델 선택'"
      />
      <!-- 비율 -->
      <input-select-box
        :datas="ratioList"
        v-model="selectedRatio"
        @update:modelValue="selectedRatio = $event"
        :placeholder="'비율 선택'"
      />
    </div>
    <div class="option__block">
      <!-- 타일 -->
      <input-text-box
        v-model="tileSize"
        :placeholder="'타일 입력'"
        @update:modelValue="tileSize = $event" 
      />
      <!-- 확장자 -->
      <input-select-box
        :datas="exportExtList"
        v-model="selectedExt"
        @update:modelValue="selectedExt = $event"
        :placeholder="'확장자 선택'"
      />
    </div>
    <div class="option__block">
      <!-- 노이즈 (0-100)-->
      <input-range :min="1" :max="100" :interval="1" />
      <!-- 선명도 (0-2)-->
      <input-range :min="0" :max="2" :interval="0.1" />
    </div>
    <div class="option__block">
      <!-- 채도 (0-2)-->
      <input-range :min="0" :max="2" :interval="0.1" />
      <!-- 노출 (0-2)-->
      <input-range :min="0" :max="2" :interval="0.1" />
    </div>
    <div class="option__block">
      <!-- 대비 (0-2) -->
      <input-range :min="0" :max="2" :interval="0.1" />
      <!-- HDR -->
      <input type="checkbox">
    </div>
  </div>
  
</template>

<script setup lang="js">
import InputSelectBox from '@/views/components/inputs/InputSelectBox.vue'
import InputTextBox from '@/views/components/inputs/InputTextBox.vue'
import InputRange from '@/views/components/inputs/InputRange.vue'
import { computed, ref } from 'vue'

const modelList = ref([
  { label: "Bicubic", value: "BICU" },
  { label: "Srcnn", value: "SRCN" },
  { label: "Edsr", value: "EDSR" }
])

const ratioList = ref( [
  { label: "X2배", value: "X2" },
  { label: "X4배", value: "X4" }
])

const exportExtList = ref([
  { label: "*.jpg", value: "jpg" },
  { label: "*.jpeg", value: "jpeg" },
  { label: "*.png", value: "png" },
  { label: "*.bmp", value: "bmp" },
  { label: "*.tiff", value: "tiff" }
])

const selectedModel = ref(undefined)
const selectedRatio = ref(undefined)
const selectedExt = ref(undefined)
const tileSize = ref(undefined)

const getElementWidth = computed(() => {
  const targetElemet = document.querySelector('.section__body')
  return targetElemet?.offsetWidth * 1.6 || 0
})

const getImageWidth = computed(() => {
  if (getElementWidth) {
    return { width: `${getElementWidth.value}px`, alignSelf: 'center' }
  } else {
    return { width: '500px', alignSelf: 'center' }
  }
})

</script>

<style>

</style>