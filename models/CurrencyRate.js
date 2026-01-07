class CurrencyRate {
  constructor(data) {
    this.rates = data || {};
    this.timestamp = new Date();
    this.blackList = ["aave"];
    this.whiteList = [
      "sekkeh",
      "abshodeh",
      "18ayar",
      "bahar",
      "nim",
      "rob",
      "gerami",
      // arz
      "aed",
      "eur",
      "gbp",
      "iqd",
      "omr",
      "usd_usdt",
      // currency digit
      "btc",
      "eth",
      "ltc",
      "usdt",
    ];
  }

  getRate(key) {
    return this.rates[key];
  }

  getAllRates() {
    return this.rates;
  }

  _getCategory(key) {
    key = key.toLowerCase();

    if (key === "usd_usdt") return { category: "usd_usdt", unit: "هزار" };

    if (key === "eur" || key.startsWith("eur_") || key.includes("_eur")) {
      return { category: "eur", unit: "هزار" };
    }

    const cryptoPatterns = [
      "btc",
      "eth",
      "xrp",
      "bch",
      "ltc",
      "eos",
      "bnb",
      "dash",
      "doge",
      "sol",
      "ada",
      "shib",
      "avax",
      "matic",
      "dot",
      "xlm",
      "ton",
      "trx",
      "uni",
      "link",
      "atom",
      "xmr",
      "etc",
      "fil",
      "icp",
      "hbar",
      "vet",
      "near",
      "qnt",
      "mkr",
      "aave",
      "grt",
      "algo",
      "axs",
      "stx",
      "egld",
      "sand",
      "theta",
      "usdt",
    ];
    if (cryptoPatterns.includes(key)) {
      if (key.startsWith("btc")) {
        return { category: "crypto", unit: "میلیارد" };
      }
      return { category: "crypto", unit: "میلیون" };
    }

    // if (key.startsWith("usd_") && key !== "usd_usdt") {
    //   const afterUsd = key.replace("usd_", "");
    //   if (cryptoPatterns.includes(afterUsd)) {
    //     return {"crypto", "هزار"};
    //   }
    // }

    const goldPatterns = [
      "sekkeh",
      "bahar",
      "nim",
      "rob",
      "gerami",
      "18ayar",
      "abshodeh",
      "xau",
    ];
    if (goldPatterns.includes(key)) return { category: "gold", unit: "میلیون" };
    // if (key.startsWith("bub_")) return "gold";

    return { category: "other", unit: "هزار" };
  }

  getFormattedRates() {
    const entries = [];
    const formatted = {};

    for (const [key, rate] of Object.entries(this.rates)) {
      if (rate && rate.value) {
        if (!this.whiteList.includes(key) || this.blackList.includes(key)) {
          //   console.log(`${key} currency is not supported.`);
          continue;
        }
        var { category, unit } = this._getCategory(key);
        entries.push({
          key: key,
          rate: rate,
          category: category,
          unit: unit,
        });
      }
    }
    const categoryOrder = ["usd_usdt", "gold", "eur", "crypto", "other"];
    entries.sort((a, b) => {
      const catAIndex = categoryOrder.indexOf(a.category);
      const catBIndex = categoryOrder.indexOf(b.category);

      if (catAIndex === catBIndex) {
        return a.key.localeCompare(b.key);
      }

      return catAIndex - catBIndex;
    });

    entries.forEach(({ key, rate, category, unit }) => {
      formatted[key] = {
        ...rate,
        value: parseInt(rate.value) || 0,
        change: parseInt(rate.change) || 0,
        changeDirection:
          rate.change > 0 ? "up" : rate.change < 0 ? "down" : "neutral",
        formattedValue: new Intl.NumberFormat("en-US").format(
          parseInt(rate.value) || 0
        ),
        formattedChange: new Intl.NumberFormat("en-US", {
          signDisplay: "always",
        }).format(parseInt(rate.change) || 0),
        category: category,
        unit: unit,
      };
    });

    return formatted;
  }

  // Get main USD rates
  getUSDRates() {
    const usdRates = {};

    for (const [key, rate] of Object.entries(this.rates)) {
      if (
        key.toLowerCase().includes("usd") ||
        key.toLowerCase().includes("dolar")
      ) {
        usdRates[key] = {
          ...rate,
          value: parseInt(rate.value) || 0,
          formattedValue: new Intl.NumberFormat("en-US").format(
            parseInt(rate.value) || 0
          ),
        };
      }
    }

    return usdRates;
  }

  // Get primary USD rate (usd_usdt as per API)
  getPrimaryUSDRate() {
    const usd_usdt = this.rates["usd_usdt"];
    if (usd_usdt) {
      return {
        key: "usd_usdt",
        name: "USD to IRR (Tether)",
        value: parseInt(usd_usdt.value) || 0,
        change: parseInt(usd_usdt.change) || 0,
        timestamp: usd_usdt.timestamp,
        date: usd_usdt.date,
        formattedValue: new Intl.NumberFormat("en-US").format(
          parseInt(usd_usdt.value) || 0
        ),
        formattedChange: new Intl.NumberFormat("en-US", {
          signDisplay: "always",
        }).format(parseInt(usd_usdt.change) || 0),
      };
    }

    // Fallback to first available rate
    const firstRate = Object.entries(this.rates)[0];
    if (firstRate) {
      const [key, rate] = firstRate;
      return {
        key,
        name: key.replace(/_/g, " ").toUpperCase(),
        value: parseInt(rate.value) || 0,
        change: parseInt(rate.change) || 0,
        timestamp: rate.timestamp,
        date: rate.date,
        formattedValue: new Intl.NumberFormat("en-US").format(
          parseInt(rate.value) || 0
        ),
        formattedChange: new Intl.NumberFormat("en-US", {
          signDisplay: "always",
        }).format(parseInt(rate.change) || 0),
      };
    }

    return null;
  }

  // Check if data is fresh (within cache duration)
  isFresh(cacheDuration = 180000) {
    const now = new Date();
    const age = now - this.timestamp;
    return age < cacheDuration;
  }
}

module.exports = CurrencyRate;
