<template>
  <div class="option__container" :style="getImageWidth">
    <div class="option__block">
      <!-- 모델 -->
      <div class="input-wrapper half">
        <label class="input-label">모델</label>
        <input-select-box
          :datas="modelList"
          v-model="selectedValue"
          @update:modelValue="newValue => selectedModel = newValue"
          :placeholder="'모델 선택'"
        />
      </div>
      <!-- 비율 -->
      <div class="input-wrapper half">
        <label class="input-label">비율</label>
        <input-select-box
          :datas="ratioList"
          v-model="selectedRatio"
          @update:modelValue="selectedRatio = $event"
          :placeholder="'비율 선택'"
        />
      </div>
    </div>
    <div class="option__block">
      <!-- 타일 -->
      <div class="input-wrapper half">
        <label class="input-label">타일 사이즈</label>
        <input-text-box
          v-model="tileSize"
          :placeholder="'타일 입력'"
          @update:modelValue="tileSize = $event" 
        />
      </div>
      <!-- 확장자 -->
      <div class="input-wrapper half">
        <label class="input-label">출력 확장자</label>
        <input-select-box
          :datas="exportExtList"
          v-model="selectedExt"
          @update:modelValue="selectedExt = $event"
          :placeholder="'확장자 선택'"
        />
      </div>
    </div>
    <div class="option__block">
      <!-- 노이즈 (0-100)-->
      <div class="input-wrapper half">
        <label class="input-label">노이즈 감소 (1-100)</label>
        <input-range
          v-model="denoiseValue"
          :min="1" 
          :max="100"
          :interval="1"
          @update:modelValue="denoiseValue = $event"
        />
      </div>
      <!-- 선명도 (0-2)-->
      <div class="input-wrapper half">
        <label class="input-label">선명도 (0-2)</label>
        <input-range
          v-model="sharpenValue"
          :min="0"
          :max="2"
          :interval="0.1"
          @update:modelValue="sharpenValue = $event"
        />
      </div>
    </div>
    <div class="option__block">
      <!-- 채도 (0-2)-->
      <div class="input-wrapper half">
        <label class="input-label">채도 (0-2)</label>
        <input-range
          v-model="chromaValue"
          :min="0"
          :max="2"
          :interval="0.1"
          @update:modelValue="chromaValue = $event"
        />
      </div>
      <!-- 노출 (0-2)-->
      <div class="input-wrapper half">
        <label class="input-label">노출 (0-2)</label>
        <input-range
          v-model="exposeValue"
          :min="0"
          :max="2"
          :interval="0.1"
          @update:modelValue="exposeValue = $event"
        />
      </div>
    </div>
    <div class="option__block">
      <!-- 대비 (0-2) -->
      <div class="input-wrapper half">
        <label class="input-label">대비 (0-2)</label>
        <input-range
          v-model="contrastValue"
          :min="0"
          :max="2"
          :interval="0.1"
          @update:modelValue="contrastValue = $event"
        />
      </div>
      <!-- HDR -->
      <div class="input-wrapper checkbox-wrapper" style="width: 18%">
        <label class="input-label">HDR</label>
        <toggle-switch
          :target="'HDR'"
          @toggled="isHdrUse = !isHdrUse"
        />
      </div>
      <div class="input-wrapper checkbox-wrapper" style="width: 28%">
        <label class="input-label">JPG아티펙트 제거</label>
        <toggle-switch
          :target="'ARTIFACT'"
          @toggled="isRemoveArtifact = !isRemoveArtifact"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="js">
import InputSelectBox from '@/views/components/inputs/InputSelectBox.vue'
import InputTextBox from '@/views/components/inputs/InputTextBox.vue'
import InputRange from '@/views/components/inputs/InputRange.vue'
import ToggleSwitch from '@/views/components/inputs/ToggleSwitch.vue'
import { computed, ref, defineExpose } from 'vue'

const modelList = ref([
  { label: "Bicubic", value: "bicubic" },
  { label: "Srcnn", value: "srcnn" },
  { label: "Edsr", value: "edsr" }
])

const ratioList = ref( [
  { label: "X2배", value: 2 },
  { label: "X4배", value: 4 }
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
const denoiseValue = ref(5)
const sharpenValue = ref(1)
const chromaValue = ref(1)
const exposeValue = ref(1)
const contrastValue = ref(1)
const isHdrUse = ref(false)
const isRemoveArtifact = ref(false)

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

const getParams = () => {
  const params = {
    model: selectedModel.value,
    ratio: selectedRatio.value,
    ext: selectedExt.value,
    tileSize: tileSize.value,
    denoise: denoiseValue.value,
    sharpen: sharpenValue.value,
    chroma: chromaValue.value,
    expose: exposeValue.value,
    contrast: contrastValue.value,
    hdr: isHdrUse.value,
    artifact: isRemoveArtifact.value
  }
  return params
}

defineExpose({ getParams })
</script>

<style lang="scss">

</style>