<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <base-input
          v-model:model-value="ticker"
          v-model:example-value="ticker"
          label="Тикер"
          placeholder="Например DOGE"
        />

        <div
          v-if="ticker && hints.length"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            v-for="hint in hints"
            :key="hint"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
            @click="addFromHint(hint)"
          >
            {{ hint }}
          </span>
        </div>
        <div v-if="errorText" class="text-sm text-red-600">
          {{ errorText }}
        </div>
      </div>
    </div>
    <add-button @click="add" class="my-4" />
  </section>
</template>

<script>
import AddButton from "@/components/AddButton";
import BaseInput from "@/components/BaseInput";

export default {
  name: "AddTicker",

  data: () => ({
    ticker: "",
  }),

  props: {
    errorText: {
      type: String,
      default: "",
    },
    coinList: {
      type: Object,
      default: () => {},
    },
  },

  components: {
    AddButton,
    BaseInput,
  },

  computed: {
    hints() {
      return Object.keys(this.coinList).reduce((acc, key) => {
        if (acc.length < 4) {
          const coin = this.coinList[key];
          if (coin.FullName.toLowerCase().includes(this.ticker.toLowerCase())) {
            acc.push(coin.Symbol);
          }
        }
        return acc;
      }, []);
    },
  },

  methods: {
    add() {
      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },

    addFromHint(t) {
      this.ticker = t;
      this.add();
    },
  },
};
</script>

<style scoped></style>
