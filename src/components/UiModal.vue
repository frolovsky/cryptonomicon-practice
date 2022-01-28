<template>
  <div
    class="ui-modal"
    :class="{ 'ui-modal--opened': isOpen }"
    @click.self="$emit('close')"
  >
    <div v-if="isOpen" class="ui-modal__content">
      <div class="content-header">
        <slot name="header"></slot>
      </div>
      <div class="content-main">
        <slot name="main"></slot>
      </div>
      <div class="content-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UiModal",

  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    close: null,
  },
};
</script>

<style scoped lang="scss">
.ui-modal {
  display: none;
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &--opened {
    display: block;
  }

  &__content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(10, 140, 150, 0.3);
    padding: 20px;
    cursor: default;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
