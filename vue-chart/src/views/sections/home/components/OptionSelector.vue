<template>
  <div class="option__container" :style="getImageWidth">
    <div class="option__block">
      <!-- 모델 -->
      <div class="input-wrapper">
        <label class="input-label">모델</label>
        <input-select-box
          :datas="modelList"
          v-model="selectedValue"
          @update:modelValue="newValue => selectedModel = newValue"
          :placeholder="'모델 선택'"
        />
      </div>
      <!-- 비율 -->
      <div class="input-wrapper">
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
      <div class="input-wrapper">
        <label class="input-label">타일 사이즈</label>
        <input-text-box
          v-model="tileSize"
          :placeholder="'타일 입력'"
          @update:modelValue="tileSize = $event" 
        />
      </div>
      <!-- 확장자 -->
      <div class="input-wrapper">
        <label class="input-label">확장자</label>
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
      <div class="input-wrapper">
        <label class="input-label">노이즈 감소 (1-100)</label>
        <input-range :min="1" :max="100" :interval="1" />
      </div>
      <!-- 선명도 (0-2)-->
      <div class="input-wrapper">
        <label class="input-label">선명도 (0-2)</label>
        <input-range :min="0" :max="2" :interval="0.1" />
      </div>
    </div>
    <div class="option__block">
      <!-- 채도 (0-2)-->
      <div class="input-wrapper">
        <label class="input-label">채도 (0-2)</label>
        <input-range :min="0" :max="2" :interval="0.1" />
      </div>
      <!-- 노출 (0-2)-->
      <div class="input-wrapper">
        <label class="input-label">노출 (0-2)</label>
        <input-range :min="0" :max="2" :interval="0.1" />
      </div>
    </div>
    <div class="option__block">
      <!-- 대비 (0-2) -->
      <div class="input-wrapper">
        <label class="input-label">대비 (0-2)</label>
        <input-range :min="0" :max="2" :interval="0.1" />
      </div>
      <!-- HDR -->
      <div class="input-wrapper checkbox-wrapper">
        <label class="input-label">HDR</label>
        <input type="checkbox">
      </div>
    </div>
  </div>
</template>
