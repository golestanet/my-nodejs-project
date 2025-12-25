class CurrencyApp {
  constructor() {
    this.apiBaseUrl = "/api";
    this.refreshInterval = 60000; // 60 seconds
    this.lastUpdate = null;
    this.isRefreshing = false;
    this.demoMode = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.updatePersianDate();
    this.loadAllData();
    this.startAutoRefresh();
  }

  bindEvents() {
    document.getElementById("refreshBtn").addEventListener("click", () => {
      this.refreshAllData();
    });
  }

  // Update Persian date in header
  updatePersianDate() {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };

    // Using Intl for Persian locale
    const formatter = new Intl.DateTimeFormat("fa-IR", options);
    const persianDate = formatter.format(now);

    document.getElementById("farsiDate").textContent = persianDate;
  }

  // Load all data (primary rate + all rates)
  async loadAllData() {
    await Promise.all([this.fetchPrimaryRate(), this.fetchAllRates()]);
  }

  // Refresh all data
  async refreshAllData() {
    if (this.isRefreshing) return;

    this.setLoadingState(true);

    try {
      await Promise.all([
        this.fetchPrimaryRate(true),
        this.fetchAllRates(true),
      ]);

      this.showSuccess("نرخ‌ها با موفقیت بروزرسانی شدند");
    } catch (error) {
      console.error("Refresh error:", error);
      this.showError("خطا در بروزرسانی نرخ‌ها");
    } finally {
      this.setLoadingState(false);
    }
  }

  // Fetch primary USD rate
  async fetchPrimaryRate(forceRefresh = false) {
    try {
      const endpoint = forceRefresh
        ? "/rates/primary?refresh=true"
        : "/rates/primary";
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
      const data = await response.json();

      this.lastUpdate = new Date();
      this.updatePrimaryRateDisplay(data);

      this.demoMode = data.demo || false;

      if (!data.success && !data.demo) {
        throw new Error(data.error || "خطا در دریافت نرخ");
      }

      this.updateStatus("ok", "سرور آنلاین");
    } catch (error) {
      console.error("Primary rate fetch error:", error);
      this.updateStatus("error", "خطا در اتصال");

      if (!this.demoMode) {
        this.showError("خطا در دریافت نرخ اصلی. نمایش اطلاعات آزمایشی");
      }
    }
  }

  // Fetch all rates for the table
  async fetchAllRates(forceRefresh = false) {
    try {
      const endpoint = forceRefresh ? "/rates/usd?refresh=true" : "/rates/usd";
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
      const data = await response.json();

      if (data.success && data.data) {
        this.updateRatesTable(data.data);
        this.updateRatesCount(Object.keys(data.data).length);
      }
    } catch (error) {
      console.error("All rates fetch error:", error);
      // Don't show error for table, just log it
    }
  }

  // Update primary rate display
  updatePrimaryRateDisplay(data) {
    const rateData = data.data || data;

    // Update rate text
    const rateText = document.getElementById("rateText");
    if (rateData.formattedValue) {
      rateText.textContent = rateData.formattedValue;
      rateText.style.color = "#2c3e50";

      // Add animation
      rateText.style.transform = "scale(1.1)";
      setTimeout(() => {
        rateText.style.transform = "scale(1)";
      }, 300);
    }

    // Update change indicator
    const changeIndicator = document.getElementById("changeIndicator");
    const changeIcon = document.getElementById("changeIcon");
    const changeAmount = document.getElementById("changeAmount");

    if (rateData.change !== undefined) {
      changeAmount.textContent = rateData.formattedChange || rateData.change;

      if (rateData.changeDirection === "up") {
        changeIndicator.classList.add("up");
        changeIndicator.classList.remove("down");
        changeIcon.className = "fas fa-arrow-up";
        changeIcon.style.color = "#2ecc71";
      } else if (rateData.changeDirection === "down") {
        changeIndicator.classList.add("down");
        changeIndicator.classList.remove("up");
        changeIcon.className = "fas fa-arrow-down";
        changeIcon.style.color = "#e74c3c";
      } else {
        changeIndicator.classList.remove("up", "down");
        changeIcon.className = "fas fa-minus";
        changeIcon.style.color = "#95a5a6";
      }
    }

    // Update timestamps and info
    this.updateTimestamps(rateData);

    // Update source
    const rateSource = document.getElementById("rateSource");
    if (data.demo) {
      rateSource.textContent = "داده آزمایشی";
      rateSource.style.color = "#f39c12";
    } else {
      rateSource.textContent = "Navasan.tech";
      rateSource.style.color = "#3498db";
    }
  }

  // Update timestamps
  updateTimestamps(rateData) {
    const now = new Date();

    // Last checked time
    const lastChecked = document.getElementById("lastChecked");
    lastChecked.textContent = now.toLocaleTimeString("fa-IR");

    // Last updated time
    const lastUpdated = document.getElementById("lastUpdated");
    if (rateData.date) {
      // Convert Persian date to relative time
      const updateTime = new Date(rateData.date);
      const timeDiff = Math.floor((now - updateTime) / 1000);

      if (timeDiff < 60) {
        lastUpdated.querySelector("span").textContent = "هم اکنون";
      } else if (timeDiff < 3600) {
        const minutes = Math.floor(timeDiff / 60);
        lastUpdated.querySelector("span").textContent = `${minutes} دقیقه قبل`;
      } else if (timeDiff < 86400) {
        const hours = Math.floor(timeDiff / 3600);
        lastUpdated.querySelector("span").textContent = `${hours} ساعت قبل`;
      } else {
        lastUpdated.querySelector("span").textContent = rateData.date;
      }
    }

    // Rate date
    const rateDate = document.getElementById("rateDate");
    if (rateData.date) {
      rateDate.textContent = rateData.date;
    }
  }

  // Update rates table
  updateRatesTable(rates) {
    const tableBody = document.getElementById("ratesTableBody");

    if (!rates || Object.keys(rates).length === 0) {
      tableBody.innerHTML = `
              <tr>
                  <td colspan="4" style="text-align: center; padding: 40px; color: #666;">
                      هیچ نرخی یافت نشد
                  </td>
              </tr>
          `;
      return;
    }

    let rows = "";

    for (const [key, rate] of Object.entries(rates)) {
      if (!rate || !rate.value) continue;

      const changeClass =
        rate.change > 0 ? "up" : rate.change < 0 ? "down" : "";
      const changeIcon = rate.change > 0 ? "↑" : rate.change < 0 ? "↓" : "−";
      const changeDisplay = rate.formattedChange || rate.change || "0";

      rows += `
              <tr>
                  <td>
                      <strong>${this.formatRateName(key)}</strong>
                      <div class="rate-key">${key}</div>
                  </td>
                  <td>
                      <span class="rate-value">${
                        rate.formattedValue || rate.value
                      }</span>
                  </td>
                  <td class="${changeClass}">
                      <span class="change-display">
                          ${changeIcon} ${changeDisplay}
                      </span>
                  </td>
                  <td>
                      <span class="rate-time">${rate.date || "--:--"}</span>
                  </td>
              </tr>
          `;
    }

    tableBody.innerHTML = rows;
  }

  // Format rate name for display
  formatRateName(key) {
    const names = {
      usd_usdt: "دلار به ریال (تتر)",
      dolar_harat_sell: "دلار حواله (فروش)",
      dolar_harat_buy: "دلار حواله (خرید)",
      dolar_naghdi_sell: "دلار نقدی (فروش)",
      dolar_naghdi_buy: "دلار نقدی (خرید)",
      usd_sell: "دلار (فروش)",
      usd_buy: "دلار (خرید)",
    };

    return (
      names[key] ||
      key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  }

  // Update rates count
  updateRatesCount(count) {
    document.getElementById("ratesCount").textContent = count;
  }

  // Update status
  updateStatus(status, message) {
    const statusIcon = document.getElementById("statusIcon");
    const statusText = document.getElementById("statusText");

    switch (status) {
      case "ok":
        statusIcon.style.color = "#2ecc71";
        statusIcon.className = "fas fa-check-circle";
        break;
      case "error":
        statusIcon.style.color = "#e74c3c";
        statusIcon.className = "fas fa-times-circle";
        break;
      default:
        statusIcon.style.color = "#f39c12";
        statusIcon.className = "fas fa-sync-alt";
    }

    statusText.textContent = message;
  }

  // Set loading state
  setLoadingState(isLoading) {
    this.isRefreshing = isLoading;
    const refreshBtn = document.getElementById("refreshBtn");

    if (isLoading) {
      refreshBtn.classList.add("refreshing");
      refreshBtn.disabled = true;
      refreshBtn.innerHTML =
        '<i class="fas fa-sync-alt"></i> در حال بروزرسانی...';

      this.updateStatus("loading", "در حال بروزرسانی...");
    } else {
      refreshBtn.classList.remove("refreshing");
      refreshBtn.disabled = false;
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> بروزرسانی';
    }
  }

  // Show error message
  showError(message) {
    const errorAlert = document.getElementById("errorAlert");
    const errorTitle = document.getElementById("errorTitle");
    const errorMessage = document.getElementById("errorMessage");

    errorTitle.textContent = "خطا";
    errorMessage.textContent = message;
    errorAlert.style.display = "block";

    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.hideError();
    }, 10000);
  }

  // Show success message
  showSuccess(message) {
    const errorAlert = document.getElementById("errorAlert");
    const errorTitle = document.getElementById("errorTitle");
    const errorMessage = document.getElementById("errorMessage");

    errorTitle.textContent = "موفقیت";
    errorMessage.textContent = message;
    errorAlert.style.display = "block";
    errorAlert.style.background = "linear-gradient(135deg, #2ecc71, #27ae60)";

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  // Hide error message
  hideError() {
    const errorAlert = document.getElementById("errorAlert");
    errorAlert.style.display = "none";
    errorAlert.style.background = "linear-gradient(135deg, #e74c3c, #c0392b)";
  }

  // Start auto-refresh
  startAutoRefresh() {
    setInterval(() => {
      if (!this.isRefreshing) {
        this.loadAllData();
      }
    }, this.refreshInterval);
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  window.currencyApp = new CurrencyApp();
});

// Global function to hide error
window.hideError = function () {
  if (window.currencyApp) {
    window.currencyApp.hideError();
  }
};
