<template>
  <div>
    <h1>Empty view</h1>

    <button @click="showModal = !showModal">show modal</button>

    <ui-modal :is-open="showModal" @close="closeModal" @ok="closeModal">
      <template #header>
        <h2>Hello from ui-modal</h2>
      </template>
      <template #main>
        <div class="m-20">Main content</div>
      </template>
      <template #footer="{ submitModal }">
        <div class="flex">
          <input
            class="mr-5 border-blue-500 border-2 rounded px-2"
            type="text"
            :placeholder="$options.CONFIRMED_TEXT"
            v-model="warningCaptcha"
          />
          <button
            class="p-3 bg-green-300 rounded"
            :class="{ 'opacity-30': !submitIsAvailable }"
            :disabled="!submitIsAvailable"
            @click="submitModal"
          >
            OK
          </button>
        </div>
      </template>
    </ui-modal>
  </div>
</template>

<script>
import UiModal from "@/components/UiModal";

export default {
  name: "Empty",

  components: { UiModal },

  CONFIRMED_TEXT: "IUNDERSTAND",

  data: () => ({
    showModal: false,
    warningCaptcha: "",
  }),

  computed: {
    submitIsAvailable() {
      return this.warningCaptcha === this.$options.CONFIRMED_TEXT;
    },
  },

  methods: {
    closeModal() {
      this.showModal = false;
      this.warningCaptcha = "";
    },
  },
};
</script>

<style scoped></style>
