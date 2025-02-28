<template>
  <div  class="input__toggle-switch--containter">
    <input class="input__toggle-switch--input" :id="getElementId" type="checkbox">
    <label 
      class="input__toggle-switch--label"
      @click="toggleChanged"
      :for="getElementId"
    />
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps(['target'])
const emits = defineEmits(['toggled'])

const getElementId = computed(() => {
  return `toggle-switch-${props.target}`
})
const toggleChanged = () => {
  emits('toggled')
}
  
</script>