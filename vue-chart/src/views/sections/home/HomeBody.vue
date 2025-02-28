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
      <span v-if="selectedImage">이미지 변경</span>
      <span v-else>이미지 업로드</span>
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
    <template v-if="selectedImage">
      <option-selector ref="optionSelectorRef" />
      <button class="button__basic h50 full-width" @click="upscaleOptConfirm">
        <span>옵션 결정</span>
      </button>
    </template>
    <common-modal 
      v-model="isShowModal"
      :title="modalData.title"
      :size="modalData.size"
      theme="light"
      :scrollable="true"
    >
      <div v-html="modalData.content" />
      
      <template #footer>
        <button 
          v-if="modalData.origin === 'START'"
          class="button__basic full-width negative" 
          @click="initModalData(modalData)"
        >
          취소
        </button>
        <button 
          class="button__basic full-width" 
          @click="initModalData(modalData, true)"
        >
          확인
        </button>
      </template>
    </common-modal>
  </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted } from 'vue'
import { ImageApi } from '@/apis'
import OptionSelector from '@/views/sections/home/components/OptionSelector.vue';
import CommonModal from '@/views/modals/common/CommonModal.vue'

const DEFAULT_MODAL_DATA = { title: '', content: '', size: 'small', origin: '' }

const optionSelectorRef = ref(null)
const imageInput = ref(null)
const selectedImage = ref(null);
const imagePreview = ref('');
const isShowModal = ref(false)
const upscaleParams = ref(undefined)
const modalData = ref(DEFAULT_MODAL_DATA)

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

const checkServerStatus = async () => {
  await ImageApi.checkServerStatus().then(({ data }) => {
    console.log(data)
  })
}

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
  setTimeout(() => {
    scrollDown()
  }, 500)
};

const upscaleOptConfirm = async () => {
  const params = await optionSelectorRef.value.getParams()
  if (!validateParama(params)) return

  const preUpscaleInfos = {
    title: '시작 전 정보',
    size: 'medium',
    origin: 'START',
    content: `
      <div>선택한 옵션은 아래와 같습니다.<div>
      <ul>
        <li>모델: <span style="color: #006400">${params.model}</span></li>  
        <li>비율: <span style="color: #006400">${params.ratio}</span></li>  
        <li>타일: <span style="color: #006400">${params.tileSize}</span></li>  
        <li>출력 확장자: <span style="color: #006400">${params.ext}</span></li>  
        <li>노이즈 감소: <span style="color: #006400">${params.denoise}</span></li>  
        <li>선명도: <span style="color: #006400">${params.sharpen}</span></li>  
        <li>채도: <span style="color: #006400">${params.chroma}</span></li>  
        <li>노출: <span style="color: #006400">${params.expose}</span></li>  
        <li>대비: <span style="color: #006400">${params.contrast}</span></li>  
        <li>
          HDR여부: 
          <span style="color: #006400">
            ${params.hdr ? '적용' : '적용 안함'}
          </span>
        </li>  
        <li>
          JPEG 아티팩트 제거여부: 
          <span style="color: #006400">
            ${params.artifact ? '제거' : '제거 안함'}
          </span>
        </li>  
      </ul>
      <div>위와 같은 정보로 업스케일을 시작합니다.<div>
      <strong>본 작업은 시간이 소요될 수 있습니다.</strong>
    `
  }
  setModalData(preUpscaleInfos)
  upscaleParams.value = params
}

const validateParama = (params) => {
  const { model, ratio, ext, tileSize } = params
  let title, content
   if (!model) {
    title = '필수값 누락'
    content = '모델을 선택해주세요.'
    origin = 'VALID'
    setModalData({ title, content })
    return false
   }
   else if (!ratio) {
    title = '필수값 누락'
    content = '비율을 선택해주세요.'
    origin = 'VALID'
    setModalData({ title, content })
    return false
   }
   else if (tileSize !== 0 && !tileSize ) {
    title = '필수값 누락'
    content = '타일 사이즈를 입력해주세요.'
    origin = 'VALID'
    setModalData({ title, content })
    return false
   }
   else if (isNaN(tileSize)) {
    title = '잘못된 형식'
    content = '타일 사이즈엔 숫자만 입력할 수 있습니다.'
    origin = 'VALID'
    setModalData({ title, content })
    return false
   }
   else if (!ext) {
    title = '필수값 누락'
    content = '확장자를 선택해주세요.'
    origin = 'VALID'
    setModalData({ title, content })
    return false
   }
   return true
}

const setModalData = (datas) => {
  isShowModal.value = true
  modalData.value = datas
}

const initModalData = (modalData, flag) => {
  isShowModal.value = false
  modalData.value = DEFAULT_MODAL_DATA
  if (flag && modalData.origin === 'START') {
    startUpsacle()
  }
}

const startUpsacle = async () => {
  if (!upscaleParams) return
  const formData = new FormData()
  
  formData.append('file', selectedImage.value)
  formData.append('model_type', upscaleParams.value.model)
  formData.append('scale_factor', +upscaleParams.value.ratio)
  formData.append('ext', upscaleParams.value.ext)
  formData.append('tile_size', +upscaleParams.value.tileSize)
  formData.append('denoise', +upscaleParams.value.denoise)
  formData.append('sharpen', +upscaleParams.value.sharpen)
  formData.append('color', +upscaleParams.value.chroma)
  formData.append('brightness', +upscaleParams.value.expose)
  formData.append('contrast', +upscaleParams.value.contrast)
  formData.append('hdr', upscaleParams.value.hdr)
  formData.append('remove_artifacts', upscaleParams.value.artifact)

  await ImageApi.startImageUpscale(formData).then(({ data }) => {
    // if 
  }).finally(() => {})
}

const scrollDown = () => {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}

onMounted(() => {
  checkServerStatus()
})
</script>

<style>

</style>