<template>
  <div class="input__range-container half">
    <input 
      class="input__range-slider"
      type="range" 
      :min="min" 
      :max="max"
      :step="interval"
      v-model="rangePercent" 
      :style="sliderStyle"
    >
    <div class="h4-container">
      <div class="h4-subcontainer">
        <span :style="h4Style">
          {{ rangePercent }}
          <span :style="spanStyle" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  interval: {
    type: Number,
    default: 1
  },
  modelValue: {
    type: Number,
    default: ''
  }
});

onMounted(() => {
  rangePercent.value = props.modelValue
})

const rangePercent = ref(0);

const spanStyle = computed(() => ({
  filter: `hue-rotate(-${currnetPercent.value}deg)`
}));

const sliderStyle = computed(() => ({
  filter: `hue-rotate(-${currnetPercent.value}deg)`
}));

const h4Style = computed(() => ({
  transform: `translateX(-50%) scale(${1 + rangePercent.value / 4})`,
  left: `${rangePercent.value}%`
}));

const currnetPercent = computed(() => {
  return ((rangePercent.value - props.min) / (props.max - props.min)) * 100
})

watch(() => rangePercent.value, (value) => {
  emits('update:modelValue', value)
})
</script>

<style lang="scss">

</style>