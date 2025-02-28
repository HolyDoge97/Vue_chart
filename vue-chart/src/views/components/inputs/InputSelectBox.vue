<template>
  <div class="input__select-container half">
    <svg
      y="0"
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      width="100"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      height="100"
      class="input__select-icon"
    >
      <path
        stroke-width="4"
        stroke-linejoin="round"
        stroke-linecap="round"
        fill="none"
        d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
        class="svg-stroke-primary"
      ></path>
    </svg>
    <select
      class="input__select-selector"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        value=""
        selected
        disabled
      >
        {{ placeholder }}
      </option>
      <option 
        v-for="data in datas" 
        :key="data.value"
        :value="data.value"
      >
        {{ data.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['placeholder', 'datas', 'modelValue'])

const emits = defineEmits(['update:modelValue'])
const getPlaceHolder  = computed(() => {
  return { label: props.placeholder, value: undefined }
})

</script>