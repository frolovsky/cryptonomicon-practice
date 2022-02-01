<template>
  <div>
    <label :for="inputId" class="block text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <div class="mt-1 relative rounded-md shadow-md">
      <input
        class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        type="text"
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <div class="mt-1 relative rounded-md shadow-md">
      <input
        class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        type="text"
        :id="inputId + '2'"
        :value="exampleValue"
        :placeholder="placeholder"
        @input="$emit('update:exampleValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import generateId from "@/utils/generateId";

export default {
  name: "BaseInput",

  props: {
    label: {
      type: String,
      default: "",
    },
    exampleValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
  },

  data: () => ({
    inputId: generateId(),
  }),
};
</script>
