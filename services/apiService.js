const axios = require("axios");
const CurrencyRate = require("../models/CurrencyRate");

class ApiService {
  constructor() {
    this.apiKey = process.env.API_KEY || "free9jQw5bSFJS0OjHRLidO9YytRkUUY";
    this.baseUrl = process.env.API_BASE_URL || "http://api.navasan.tech/latest";
    this.cache = null;
    this.cacheDuration = parseInt(process.env.CACHE_DURATION) || 60000; // 1 minute

    this.demoMode = process.env.DEMO_MODE === "true" || false;
    console.log(`Demo mode: ${this.demoMode ? "ON" : "OFF"}`);
  }

  // Fetch rates from external API
  async fetchRates() {
    try {
      console.log("Fetching rates from external API...");

      if (this.demoMode) {
        console.log("Using demo data (DEMO_MODE is true)");
        return this.getDemoData();
      }

      const response = await axios.get(this.baseUrl, {
        params: {
          api_key: this.apiKey,
        },
        timeout: 10000, // 10 second timeout
        headers: {
          "User-Agent": "CurrencyRateApp/1.0",
          Accept: "application/json",
        },
      });

      if (response.data && typeof response.data === "object") {
        this.cache = new CurrencyRate(response.data);
        console.log("Rates fetched successfully");
        return this.cache;
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("API Service Error:", error.message);

      // Return cached data if available and fresh
      if (this.cache && this.cache.isFresh(this.cacheDuration)) {
        console.log("Returning cached data");
        return this.cache;
      }

      throw new Error(`Failed to fetch rates: ${error.message}`);
    }
  }

  getDemoData() {
    const demoRates = {
      usd_usdt: {
        value: "135300",
        change: -1300,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
      dolar_harat_sell: {
        value: "202500",
        change: -1500,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
      dolar_harat_buy: {
        value: "201800",
        change: -1200,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
      dolar_naghdi_sell: {
        value: "203000",
        change: -1000,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
      dolar_naghdi_buy: {
        value: "201000",
        change: -800,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
      usd_sell: {
        value: "202000",
        change: -1100,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
      usd_buy: {
        value: "200500",
        change: -900,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
      euro_sell: {
        value: "215000",
        change: -2000,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
      euro_buy: {
        value: "213000",
        change: -1800,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
      derham_sell: {
        value: "55000",
        change: -500,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
      derham_buy: {
        value: "54000",
        change: -400,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
      },
    };

    // Add some random variation for realism
    if (this.cache && this.cache.isFresh(30000)) {
      // 30 seconds
      // Keep cached demo data fresh
      return this.cache;
    }

    const currencyRate = new CurrencyRate(demoRates);
    this.cache = currencyRate;
    return currencyRate;
  }

  getCurrentPersianDateTime() {
    const now = new Date();
    const year = now.getFullYear() - 621; // Convert to Persian year
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Get cached rates (if fresh)
  getCachedRates() {
    if (this.cache && this.cache.isFresh(this.cacheDuration)) {
      return this.cache;
    }
    return null;
  }

  // Force refresh rates
  async refreshRates() {
    return await this.fetchRates();
  }

  // Get specific rate
  async getRate(key) {
    const rates = await this.fetchRates();
    return rates.getRate(key);
  }

  // Get all rates
  async getAllRates() {
    const rates = await this.fetchRates();
    return rates.getAllRates();
  }

  // Get formatted rates
  async getFormattedRates() {
    const rates = await this.fetchRates();
    return rates.getFormattedRates();
  }

  // Get USD rates
  async getUSDRates() {
    const rates = await this.fetchRates();
    return rates.getUSDRates();
  }

  // Get primary USD rate
  async getPrimaryUSDRate() {
    const rates = await this.fetchRates();
    return rates.getPrimaryUSDRate();
  }
}

module.exports = new ApiService();
