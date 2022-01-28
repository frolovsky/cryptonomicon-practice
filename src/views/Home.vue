<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div
      v-if="false"
      class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center"
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div class="container">
      <add-ticker
        @add-ticker="add"
        :coin-list="coinList"
        :error-text="errorText"
      />

      <section class="filters">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div class="filter-controls">
          <button
            v-if="page > 1"
            @click="page -= 1"
            class="my-4 mr-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Назад
          </button>
          <button
            v-if="hasNextPage"
            @click="page += 1"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Вперед
          </button>
        </div>
        <label>Фильтр: <input v-model="filter" /></label>
      </section>
      <template v-if="tickerList.length > 0">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in filteredTickers"
            :key="t.name"
            :class="{
              'border-purple-800':
                selectedTicker && selectedTicker.name === t.name,
            }"
            class="bg-white overflow-hidden shadow rounded-lg border-solid border-4 cursor-pointer"
            @click="selectTicker(t)"
          >
            <div
              :class="[t.isValid ? '' : 'bg-red-100']"
              class="px-4 py-5 sm:p-6 text-center"
            >
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(t.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
              @click.stop="removeTicker(t)"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg
              >Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <ticker-graph
        v-if="selectedTicker !== null"
        :graph="graph"
        :ticker-name="selectedTicker.name"
        @splice-graph="spliceGraph"
        @close-graph="selectedTicker = null"
      />
    </div>
  </div>
</template>

<script>
import { subscribeTicker, unsubscribeTicker } from "@/api.js";
import AddTicker from "@/components/AddTicker.vue";
import TickerGraph from "@/components/TickerGraph";

export default {
  name: "Home",

  components: { TickerGraph, AddTicker },

  data: () => ({
    tickerList: [],
    selectedTicker: null,
    coinList: {},
    graph: [],
    errorText: "",
    filter: "",
    page: 1,
  }),

  async created() {
    const urlData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    Object.keys(urlData).forEach((param) => {
      if (param in this) {
        this[param] = urlData[param];
      }
    });

    const storedTickers = JSON.parse(
      localStorage.getItem("cryptonomicon-list")
    );
    if (storedTickers) {
      this.tickerList = storedTickers;
      this.tickerList.forEach((ticker) => {
        subscribeTicker(ticker.name, this.updateTicker);
      });
    }
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/all/coinlist?summary=true",
      {
        method: "POST",
      }
    );
    const { Data } = await response.json();
    if (Data) this.coinList = Data;
  },

  computed: {
    filteredBySearch() {
      return this.tickerList.filter((t) =>
        t.name.includes(this.filter.toUpperCase())
      );
    },

    filteredTickers() {
      const start = (this.page - 1) * 6;
      const end = this.page * 6;
      return this.filteredBySearch.slice(start, end);
    },

    hasNextPage() {
      return this.filteredBySearch.length > this.page * 6;
    },

    pageStateOptions() {
      return {
        page: this.page,
        filter: this.filter,
      };
    },
  },

  methods: {
    add(ticker) {
      if (!this.validateTicker(ticker)) {
        return undefined;
      }

      const currentTicker = {
        name: ticker.toUpperCase(),
        price: "-",
        isValid: true,
      };
      subscribeTicker(currentTicker.name, this.updateTicker);
      this.tickerList.push(currentTicker);
    },

    updateTicker(tickerName, tickerData) {
      let ticker = this.tickerList.find((t) => t.name === tickerName);
      if (ticker) {
        ticker = Object.assign(ticker, tickerData);
      }
      if (this.selectedTicker?.name === tickerName && tickerData.price) {
        this.graph.push(tickerData.price);
      }
    },

    selectTicker(ticker) {
      this.selectedTicker = ticker;
    },

    removeTicker(ticker) {
      const targetIndex = this.tickerList.findIndex(
        (t) => t.name === ticker.name
      );
      if (targetIndex !== -1) {
        this.tickerList.splice(targetIndex, 1);
        this.selectedTicker = null;
        unsubscribeTicker(ticker.name, [this.updateTicker]);
      }
    },

    validateTicker(ticker) {
      this.errorText = "";
      const containsTicker = this.tickerList.find(
        (item) => item.name === ticker.toUpperCase()
      );
      if (containsTicker) {
        this.errorText = "Такой тикер уже существует";
        return false;
      }
      return true;
    },

    formatPrice(price) {
      if (typeof price === "string") return price;
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },

    spliceGraph(maxGraphElements) {
      if (this.graph.length > maxGraphElements) {
        this.graph.splice(0, this.graph.length - maxGraphElements);
      }
    },
  },
  watch: {
    selectedTicker() {
      this.graph = [];
    },

    tickerList: {
      deep: true,
      handler() {
        localStorage.setItem(
          "cryptonomicon-list",
          JSON.stringify(this.tickerList)
        );
      },
    },

    filteredTickers() {
      if (this.filteredTickers.length === 0) {
        this.page = Math.max(1, this.page - 1);
      }
    },

    filter() {
      this.page = 1;
    },

    pageStateOptions({ filter, page }) {
      window.history.pushState(
        {},
        document.title,
        `${window.location.pathname}?filter=${filter}&page=${page}`
      );
    },
  },
};
</script>
