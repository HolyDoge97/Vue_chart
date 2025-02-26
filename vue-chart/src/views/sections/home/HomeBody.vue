<template>
  <div class="section__body flex-col">
    <span>
      이미지를 업로드 후 옵션을 선택해주세요
    </span>
    <input 
      class="no-show"
      ref="imageInput" 
      accept="image/*"
      type="file"
      @change="handleImageUpload" 
    />
    <button class="button__basic h50 full-width" @click="uploadImage">
      <span>이미지 업로드</span>
    </button>

    <template v-if="selectedImage">
      <div class="image__container">
        <img 
          class="image__viewer"
          alt="Selected image" 
          :src="imagePreview" 
          :width="getElementWidth"
        />
        <div class="image__desc-container flex-row">
          <p>{{ selectedImage.name }}</p>
          <p>{{ getImageSize }}</p>
        </div>
      </div>
    </template>
    <option-selector :width="getElementWidth" v-if="selectedImage"/>
  </div>
  
</template>

<script setup lang="js">
import { ref, computed } from 'vue'
import OptionSelector from '@/views/sections/home/components/OptionSelector.vue';

const imageInput = ref(null)
const selectedImage = ref(null);
const imagePreview = ref('');

const getElementWidth = computed(() => {
  const targetElemet = document.querySelector('.section__body')
  return targetElemet?.offsetWidth * 1.6 || 500
})

const getImageSize = computed(() => {
  if (!selectedImage.value) return 0
  const size = (selectedImage.value.size / 1024).toFixed(1)
  if (size > 1024) {
    return `${(size / 1024)}MB`
  } else {
    return `${size}KB`
  }
})

const uploadImage = () => {
  imageInput.value.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  
  // 파일이 선택되었는지 확인
  if (!file) return;
  
  // 이미지 파일인지 확인 (추가 검증)
  if (!file.type.match('image.*')) {
    alert('이미지 파일만 선택할 수 있습니다.');
    event.target.value = ''; // input 비우기
    return;
  }
  
  // 선택된 이미지 저장
  selectedImage.value = file;
  
  // 이미지 미리보기 생성
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};
</script>

<style>

</style>