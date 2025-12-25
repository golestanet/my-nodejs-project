class CurrencyRate {
  constructor(data) {
      this.rates = data || {};
      this.timestamp = new Date();
  }

  getRate(key) {
      return this.rates[key];
  }

  getAllRates() {
      return this.rates;
  }

  // Get formatted rates for display
  getFormattedRates() {
      const formatted = {};
      
      for (const [key, rate] of Object.entries(this.rates)) {
          if (rate && rate.value) {
              formatted[key] = {
                  ...rate,
                  value: parseInt(rate.value) || 0,
                  change: parseInt(rate.change) || 0,
                  changeDirection: rate.change > 0 ? 'up' : rate.change < 0 ? 'down' : 'neutral',
                  formattedValue: new Intl.NumberFormat('en-US').format(parseInt(rate.value) || 0),
                  formattedChange: new Intl.NumberFormat('en-US', {
                      signDisplay: 'always'
                  }).format(parseInt(rate.change) || 0)
              };
          }
      }
      
      return formatted;
  }

  // Get main USD rates
  getUSDRates() {
      const usdRates = {};
      
      for (const [key, rate] of Object.entries(this.rates)) {
          if (key.toLowerCase().includes('usd') || key.toLowerCase().includes('dolar')) {
              usdRates[key] = {
                  ...rate,
                  value: parseInt(rate.value) || 0,
                  formattedValue: new Intl.NumberFormat('en-US').format(parseInt(rate.value) || 0)
              };
          }
      }
      
      return usdRates;
  }

  // Get primary USD rate (usd_usdt as per API)
  getPrimaryUSDRate() {
      const usd_usdt = this.rates['usd_usdt'];
      if (usd_usdt) {
          return {
              key: 'usd_usdt',
              name: 'USD to IRR (Tether)',
              value: parseInt(usd_usdt.value) || 0,
              change: parseInt(usd_usdt.change) || 0,
              timestamp: usd_usdt.timestamp,
              date: usd_usdt.date,
              formattedValue: new Intl.NumberFormat('en-US').format(parseInt(usd_usdt.value) || 0),
              formattedChange: new Intl.NumberFormat('en-US', {
                  signDisplay: 'always'
              }).format(parseInt(usd_usdt.change) || 0)
          };
      }
      
      // Fallback to first available rate
      const firstRate = Object.entries(this.rates)[0];
      if (firstRate) {
          const [key, rate] = firstRate;
          return {
              key,
              name: key.replace(/_/g, ' ').toUpperCase(),
              value: parseInt(rate.value) || 0,
              change: parseInt(rate.change) || 0,
              timestamp: rate.timestamp,
              date: rate.date,
              formattedValue: new Intl.NumberFormat('en-US').format(parseInt(rate.value) || 0),
              formattedChange: new Intl.NumberFormat('en-US', {
                  signDisplay: 'always'
              }).format(parseInt(rate.change) || 0)
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