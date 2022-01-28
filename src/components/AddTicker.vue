<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="add"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
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
