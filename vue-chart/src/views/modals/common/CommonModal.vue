<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="modal"
        :class="[
          { 'modal--small': size === 'small' },
          { 'modal--large': size === 'large' },
          { 'modal--fullscreen': size === 'fullscreen' },
          themeClass
        ]"
        role="dialog"
        aria-modal="true"
        @click.self="closeIfClickOutside"
      >
        <div class="modal__backdrop" @click.self="closeIfClickOutside"></div>
        <div class="modal__container" :class="{ 'modal__container--scrollable': scrollable }">
          <div class="modal__content">
            <!-- 헤더 영역 -->
            <div v-if="$slots.header || title" class="modal__header">
              <slot name="header">
                <h3 class="modal__title">{{ title }}</h3>
              </slot>
              <button
                v-if="showCloseButton" 
                class="modal__close-button"
                @click="close"
                aria-label="모달 닫기"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            
            <!-- 본문 영역 -->
            <div class="modal__body">
              <slot></slot>
            </div>
            
            <!-- 푸터 영역 -->
            <div v-if="$slots.footer" class="modal__footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large, fullscreen
    validator: (value) => ['small', 'medium', 'large', 'fullscreen'].includes(value)
  },
  theme: {
    type: String,
    default: 'light', // light, dark
    validator: (value) => ['light', 'dark'].includes(value)
  },
  scrollable: {
    type: Boolean,
    default: false
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnBackdropClick: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const themeClass = computed(() => {
  return `modal--${props.theme}`;
});

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const closeIfClickOutside = (event) => {
  if (props.closeOnBackdropClick) {
    close();
  }
};

const handleEscKey = (event) => {
  if (event.key === 'Escape' && props.closeOnEsc && props.modelValue) {
    close();
  }
};

watch(() => props.modelValue, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey);
  document.body.style.overflow = '';
});
</script>

<style lang="scss">

</style>