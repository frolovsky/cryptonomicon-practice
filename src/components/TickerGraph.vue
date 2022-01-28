<template>
  <section class="relative">
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ tickerName }} - USD
    </h3>
    <div
      ref="graph-wrapper"
      class="flex items-end border-gray-600 border-b border-l h-64"
    >
      <div
        v-for="(graph, idx) in normalizedGraph"
        :key="idx"
        class="bg-purple-800 border"
        :style="{
          height: `${graph + 5}%`,
          width: `${graphElementWidth}px`,
        }"
      ></div>
    </div>
    <close-button @click="$emit('close-graph')" />
  </section>
</template>

<script>
import CloseButton from "@/components/CloseButton";

export default {
  name: "TickerGraph",

  components: { CloseButton },

  data: () => ({
    maxGraphElements: 1,
  }),

  emits: {
    closeGraph: null,
    spliceGraph: (maxGraphElements) => typeof maxGraphElements === "number",
  },

  props: {
    tickerName: {
      type: String,
      default: "",
      required: true,
    },

    graph: {
      type: Array,
      default: () => [],
    },

    graphElementWidth: {
      type: Number,
      default: 38,
    },
  },

  mounted() {
    window.addEventListener("resize", this.calculateMaxGraphElements);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphElements);
  },

  computed: {
    normalizedGraph() {
      const max = Math.max(...this.graph);
      const min = Math.min(...this.graph);

      if (max === min) return this.graph.map(() => 50);

      return this.graph.map((price) => ((price - min) * 100) / (max - min));
    },
  },

  methods: {
    calculateMaxGraphElements() {
      if (!this.$refs["graph-wrapper"]) {
        return;
      }
      this.maxGraphElements =
        this.$refs["graph-wrapper"].clientWidth / this.graphElementWidth;
    },
  },

  watch: {
    graph: {
      deep: true,
      handler() {
        this.$emit("splice-graph", this.maxGraphElements);
      },
    },

    maxGraphElements: {
      handler() {
        this.$emit("splice-graph", this.maxGraphElements);
      },
    },

    tickerName: {
      immediate: true,
      handler() {
        this.$nextTick().then(this.calculateMaxGraphElements);
      },
    },
  },
};
</script>

<style scoped></style>
