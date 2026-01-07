class CurrencyListApp {
  constructor() {
    this.apiBaseUrl = "/api";
    this.refreshInterval = 60000; // 60 seconds
    this.lastUpdate = null;
    this.isRefreshing = false;
    this.isDemoMode = false;
    this.currencies = {};
    this.filteredCurrencies = {};
    this.currentPage = 1;
    this.itemsPerPage = 20;
    this.currentFilter = "all";
    this.currentSort = "default";
    this.currentView = "grid";
    this.searchQuery = "";

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateTime();
    this.updateDate();
    this.loadCurrencies();
    this.startAutoRefresh();
    this.setupIntersectionObserver();
  }

  bindEvents() {
    // Refresh button
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.loadCurrencies(true);
      });
    }

    // Search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.filterCurrencies();
        this.updateClearButton();
      });
    }

    // Clear search button
    const clearSearch = document.getElementById("clearSearch");
    if (clearSearch) {
      clearSearch.addEventListener("click", () => {
        searchInput.value = "";
        this.searchQuery = "";
        this.filterCurrencies();
        this.updateClearButton();
      });
    }

    // Filter tags
    const filterTags = document.querySelectorAll(".filter-tag");
    filterTags.forEach((tag) => {
      tag.addEventListener("click", (e) => {
        filterTags.forEach((t) => t.classList.remove("active"));
        e.target.classList.add("active");
        this.currentFilter = e.target.dataset.filter;
        this.filterCurrencies();
      });
    });

    // Sort select
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.sortCurrencies();
      });
    }

    // View toggle
    const viewBtns = document.querySelectorAll(".view-btn");
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        viewBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentView = e.target.dataset.view;
        this.updateView();
      });
    });

    // Alert modal
    const closeAlert = document.getElementById("closeAlert");
    const alertConfirm = document.getElementById("alertConfirm");
    if (closeAlert) {
      closeAlert.addEventListener("click", () => {
        this.hideAlert();
      });
    }
    if (alertConfirm) {
      alertConfirm.addEventListener("click", () => {
        this.hideAlert();
      });
    }
  }

  setupIntersectionObserver() {
    // Lazy load images if needed
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            element.classList.add("visible");
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe currency cards when they're added
    this.observer = observer;
  }

  async loadCurrencies(forceRefresh = false) {
    if (this.isRefreshing) return;

    this.setLoadingState(true);

    try {
      const endpoint = forceRefresh ? "/rates?refresh=true" : "/rates";
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      this.lastUpdate = new Date();
      this.currencies = data.data || data;

      if (data.success === false && !data.demo) {
        throw new Error(data.error || "خطا در دریافت نرخ‌ها");
      }

      this.isDemoMode = data.demo || false;

      if (this.isDemoMode) {
        this.showAlert("توجه", "در حال نمایش اطلاعات آزمایشی", "info");
      } else {
        this.hideAlert();
      }

      this.processCurrencies();
      this.filterCurrencies();
      this.updateStats();
      this.updateLastUpdateTime();
    } catch (error) {
      console.error("خطا در دریافت نرخ‌ها:", error);
      this.showAlert(
        "خطا",
        "خطا در دریافت نرخ‌ها. نمایش اطلاعات آزمایشی",
        "error"
      );

      // Fallback to demo data
      this.currencies = this.generateDemoData();
      this.isDemoMode = true;
      this.processCurrencies();
      this.filterCurrencies();
      this.updateStats();
      this.updateLastUpdateTime();
    } finally {
      this.setLoadingState(false);
    }
  }

  generateDemoData() {
    const demoData = {
      usd_usdt: {
        value: "135850",
        change: -650,
        timestamp: Math.floor(Date.now() / 1000),
        date: this.getCurrentPersianDateTime(),
        unit: "هزار",
        category: "usd_usdt",
      },
    };

    return demoData;
  }

  processCurrencies() {
    Object.keys(this.currencies).forEach((key) => {
      const currency = this.currencies[key];
      if (!currency) return;

      // Convert value to number
      currency.numericValue = parseFloat(currency.value) || 0;

      // Format value
      currency.formattedValue = `${this.formatNumber(currency.numericValue)} ${
        currency.unit
      } `;

      // Format change
      currency.formattedChange = this.formatNumber(
        Math.abs(currency.change || 0),
        true
      );

      // Determine change direction
      currency.changeDirection =
        currency.change > 0 ? "up" : currency.change < 0 ? "down" : "neutral";

      // Determine category
      currency.category = this.getCurrencyCategory(key);

      // Format name
      currency.displayName = this.getCurrencyDisplayName(key);

      // Get icon
      currency.icon = this.getCurrencyIcon(key);
    });
  }

  getCurrencyCategory(key) {
    const currency = this.currencies[key];
    if (currency && currency.category) {
      return currency.category;
    }
  }

  getCurrencyDisplayName(key) {
    const names = {
      // USD
      usd_usdt: "دلار آمریکا",
      usd_sell: "دلار (فروش)",
      usd_buy: "دلار (خرید)",
      usd_pp: "دلار پی‌پال",

      // Euro
      eur: "یورو",
      eur_hav: "یورو حواله",
      eur_pp: "یورو پی‌پال",

      // Other currencies
      gbp: "پوند انگلیس",
      jpy: "ین ژاپن",
      cad: "دلار کانادا",
      aud: "دلار استرالیا",
      aed: "درهم امارات",
      try: "لیر ترکیه",
      cny: "یوان چین",
      rub: "روبل روسیه",
      iqd: "دینار عراق",
      omr: "ریال عمان",

      // Crypto
      btc: "بیت‌کوین",
      eth: "اتریوم",
      xrp: "ریپل",
      bnb: "بایننس کوین",
      sol: "سولانا",
      ada: "کاردانو",
      doge: "دوج کوین",
      dot: "پولکادات",
      ltc: "لایت کوین",
      usdt: "تتر",

      // Gold and coins
      sekkeh: "سکه تمام بهار آزادی - امامی",
      bahar: "سکه بهار آزادی",
      nim: "نیم سکه",
      rob: "ربع سکه",
      gerami: "سکه گرمی",
      "18ayar": "گرم طلای ۱۸ عیار",
      abshodeh: "مثقال طلای آب شده",
    };

    return (
      names[key] ||
      key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  }

  getCurrencyIcon(key) {
    const icons = {
      // USD
      usd_usdt: "fa-dollar-sign",
      usd_sell: "fa-dollar-sign",
      usd_buy: "fa-dollar-sign",
      usd_pp: "fa-credit-card",

      // Euro
      eur: "fa-euro-sign",
      eur_hav: "fa-euro-sign",
      eur_pp: "fa-credit-card",

      // Other currencies
      gbp: "fa-pound-sign",
      jpy: "fa-yen-sign",
      cad: "fa-dollar-sign",
      aud: "fa-dollar-sign",
      aed: "fa-money-bill-wave",
      try: "fa-lira-sign",
      cny: "fa-yen-sign",
      rub: "fa-ruble-sign",
      iqd: "fa-iqd-sign",
      omr: "fa-omr-sign",

      // Crypto
      btc: "fa-btc",
      eth: "fa-ethereum",
      xrp: "fa-bolt",
      bnb: "fa-chart-line",
      sol: "fa-sun",
      ada: "fa-chart-bar",
      doge: "fa-dog",
      dot: "fa-circle",
      ltc: "fa-ltc",
      usdt: "fa-coins",

      // Gold and coins
      sekkeh: "fa-gem",
      bahar: "fa-gem",
      nim: "fa-gem",
      rob: "fa-gem",
      gerami: "fa-gem",
      "18ayar": "fa-gem",
      abshodeh: "fa-fire",
    };

    return icons[key] || "fa-money-bill-wave";
  }

  filterCurrencies() {
    let filtered = Object.keys(this.currencies)
      .filter((key) => {
        const currency = this.currencies[key];
        if (!currency) return false;

        // Apply search filter
        if (this.searchQuery) {
          const searchTerm = this.searchQuery.toLowerCase();
          const nameMatches = currency.displayName
            .toLowerCase()
            .includes(searchTerm);
          const keyMatches = key.toLowerCase().includes(searchTerm);
          if (!nameMatches && !keyMatches) return false;
        }

        // Apply category filter
        if (this.currentFilter !== "all") {
          if (currency.category !== this.currentFilter) return false;
        }

        return true;
      })
      .reduce((obj, key) => {
        obj[key] = this.currencies[key];
        return obj;
      }, {});

    this.filteredCurrencies = filtered;
    this.currentPage = 1;
    this.sortCurrencies();
  }

  sortCurrencies() {
    const keys = Object.keys(this.filteredCurrencies);

    keys.sort((a, b) => {
      const currencyA = this.filteredCurrencies[a];
      const currencyB = this.filteredCurrencies[b];

      switch (this.currentSort) {
        case "name":
          return currencyA.displayName.localeCompare(currencyB.displayName);

        case "price-high":
          return currencyB.numericValue - currencyA.numericValue;

        case "price-low":
          return currencyA.numericValue - currencyB.numericValue;

        case "change-high":
          return (
            Math.abs(currencyB.change || 0) - Math.abs(currencyA.change || 0)
          );

        case "change-low":
          return (
            Math.abs(currencyA.change || 0) - Math.abs(currencyB.change || 0)
          );

        default:
          return 0;
      }
    });

    // Recreate filteredCurrencies with sorted keys
    const sortedCurrencies = {};
    keys.forEach((key) => {
      sortedCurrencies[key] = this.filteredCurrencies[key];
    });

    this.filteredCurrencies = sortedCurrencies;
    this.displayCurrencies();
  }

  displayCurrencies() {
    const currencyList = document.getElementById("currencyList");
    if (!currencyList) return;

    const keys = Object.keys(this.filteredCurrencies);
    const totalItems = keys.length;

    // Show empty state if no results
    const emptyState = document.getElementById("emptyState");
    if (emptyState) {
      if (totalItems === 0) {
        emptyState.style.display = "block";
        emptyState.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-search"></i>
            <h3>نتیجه‌ای یافت نشد</h3>
            <p>موردی با جستجوی "${this.searchQuery}" پیدا نشد</p>
          </div>
        `;
      } else {
        emptyState.style.display = "none";
      }
    }

    // Hide loading state
    const loadingState = currencyList.querySelector(".loading-state");
    if (loadingState) {
      loadingState.style.display = "none";
    }

    // Calculate pagination
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, totalItems);
    const pageKeys = keys.slice(startIndex, endIndex);

    // Update list view class
    currencyList.className = `currency-list ${this.currentView}-view`;

    // Clear existing content
    currencyList.innerHTML = "";

    // Add currency cards
    pageKeys.forEach((key) => {
      const currency = this.filteredCurrencies[key];
      if (!currency) return;

      const card = this.createCurrencyCard(key, currency);
      currencyList.appendChild(card);

      // Observe for animations
      if (this.observer) {
        this.observer.observe(card);
      }
    });

    // Update pagination
    this.updatePagination(totalItems, totalPages);

    // Update counter
    this.updateCounter(totalItems);
  }

  createCurrencyCard(key, currency) {
    const card = document.createElement("div");
    card.className = `currency-card ${this.currentView}-view`;

    const changeClass = currency.changeDirection;
    const changeIcon =
      currency.changeDirection === "up"
        ? "fa-arrow-up"
        : currency.changeDirection === "down"
        ? "fa-arrow-down"
        : "fa-minus";

    if (this.currentView === "grid") {
      card.innerHTML = `
              <div class="currency-header">
                  <div class="currency-name-row">
                      <div class="currency-name">
                          <div class="currency-icon">
                              <i class="fas ${currency.icon}"></i>
                          </div>
                          <div class="currency-title">
                              <h3>${currency.displayName}</h3>
                              <p>${key}</p>
                          </div>
                      </div>
                      <span class="currency-tag ${
                        currency.category
                      }">${this.getCategoryLabel(currency.category)}</span>
                  </div>
              </div>
              <div class="currency-body">
                  <div class="price-display">
                      <span class="price-label">قیمت</span>
                      <div class="price-value">
                      ${this.toPersianNumbers(currency.formattedValue)}
                      <span class="price-unit">تومان</span>
                      </div>
                  </div>
                  <div class="change-display">
                      <span class="change-value ${changeClass}">
                          <i class="fas ${changeIcon}"></i>
                          ${this.toPersianNumbers(currency.formattedChange)}
                      </span>
                  </div>
              </div>
              <div class="currency-footer">
                  <div class="update-time">
                      <i class="fas fa-clock"></i>
                      <span>${currency.date.split(" ")[1]}</span>
                  </div>
                  <!--
                  <div class="currency-actions">
                      <button class="action-btn" title="ذخیره">
                          <i class="fas fa-bookmark"></i>
                      </button>
                      <button class="action-btn" title="اشتراک‌گذاری">
                          <i class="fas fa-share-alt"></i>
                      </button>
                  </div>
                  -->
                  
              </div>
          `;
    } else {
      // List view
      card.innerHTML = `
              <div class="currency-header list-view">
                  <div class="currency-name-row">
                      <div class="currency-name">
                          <div class="currency-icon">
                              <i class="fas ${currency.icon}"></i>
                          </div>
                          <div class="currency-title">
                              <h3>${currency.displayName}</h3>
                              <p>${key}</p>
                          </div>
                      </div>
                      <span class="currency-tag ${
                        currency.category
                      }">${this.getCategoryLabel(currency.category)}</span>
                  </div>
              </div>
              <div class="currency-body list-view">
                  <div class="price-display">
                      <span class="price-label">قیمت</span>
                      <div class="price-value">
                          <span class="price-unit">تومان</span>
                          ${this.toPersianNumbers(currency.formattedValue)}
                      </div>
                  </div>
                  <div class="change-display">
                      <span class="change-value ${changeClass}">
                          <i class="fas ${changeIcon}"></i>
                          ${this.toPersianNumbers(currency.formattedChange)}
                      </span>
                  </div>
              </div>
              <div class="currency-footer list-view">
                  <div class="update-time">
                      <i class="fas fa-clock"></i>
                      <span>${currency.date.split(" ")[1]}</span>
                  </div>
                  <div class="currency-actions">
                      <button class="action-btn" title="ذخیره">
                          <i class="fas fa-bookmark"></i>
                      </button>
                      <button class="action-btn" title="اشتراک‌گذاری">
                          <i class="fas fa-share-alt"></i>
                      </button>
                  </div>
              </div>
          `;
    }

    return card;
  }

  getCategoryLabel(category) {
    const labels = {
      usd: "دلار",
      usd_usdt: "دلار",
      eur: "یورو",
      crypto: "رمزارز",
      gold: "طلا و سکه",
      other: "سایر",
    };
    return labels[category] || "سایر";
  }

  updatePagination(totalItems, totalPages) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let html = "";

    // Previous button
    html += `
          <button class="pagination-btn" ${
            this.currentPage === 1 ? "disabled" : ""
          } 
                  onclick="app.goToPage(${this.currentPage - 1})">
              <i class="fas fa-chevron-right"></i>
          </button>
      `;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      html += `
              <button class="pagination-btn ${
                i === this.currentPage ? "active" : ""
              }" 
                      onclick="app.goToPage(${i})">
                  ${this.toPersianNumbers(i.toString())}
              </button>
          `;
    }

    // Next button
    html += `
          <button class="pagination-btn" ${
            this.currentPage === totalPages ? "disabled" : ""
          } 
                  onclick="app.goToPage(${this.currentPage + 1})">
              <i class="fas fa-chevron-left"></i>
          </button>
      `;

    // Page info
    html += `
          <div class="pagination-info">
              ${this.toPersianNumbers(totalItems.toString())} نتیجه | 
              صفحه ${this.toPersianNumbers(
                this.currentPage.toString()
              )} از ${this.toPersianNumbers(totalPages.toString())}
          </div>
      `;

    pagination.innerHTML = html;
  }

  goToPage(page) {
    if (
      page < 1 ||
      page >
        Math.ceil(
          Object.keys(this.filteredCurrencies).length / this.itemsPerPage
        )
    ) {
      return;
    }

    this.currentPage = page;
    this.displayCurrencies();

    // Scroll to top of list
    const currencyList = document.getElementById("currencyList");
    if (currencyList) {
      currencyList.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  updateView() {
    this.displayCurrencies();
  }

  updateStats() {
    const keys = Object.keys(this.currencies);
    const total = keys.length;

    let increasing = 0;
    let decreasing = 0;

    keys.forEach((key) => {
      const currency = this.currencies[key];
      if (!currency) return;

      if (currency.change > 0) {
        increasing++;
      } else if (currency.change < 0) {
        decreasing++;
      }
    });

    // Update stat cards
    const activeRates = document.getElementById("activeRates");
    const increasingRates = document.getElementById("increasingRates");
    const decreasingRates = document.getElementById("decreasingRates");

    if (activeRates)
      activeRates.textContent = this.toPersianNumbers(total.toString());
    if (increasingRates)
      increasingRates.textContent = this.toPersianNumbers(
        increasing.toString()
      );
    if (decreasingRates)
      decreasingRates.textContent = this.toPersianNumbers(
        decreasing.toString()
      );

    // Update counter
    this.updateCounter(total);

    // Find top volatile currencies
    this.updateTopVolatile();
  }

  updateTopVolatile() {
    const volatileDiv = document.getElementById("topVolatile");
    if (!volatileDiv) return;

    const currenciesArray = Object.keys(this.currencies)
      .map((key) => ({
        key,
        ...this.currencies[key],
        changeAbs: Math.abs(this.currencies[key].change || 0),
      }))
      .sort((a, b) => b.changeAbs - a.changeAbs)
      .slice(0, 3);

    if (currenciesArray.length === 0) {
      volatileDiv.innerHTML = "<p>اطلاعاتی موجود نیست</p>";
      return;
    }

    let html = "";
    currenciesArray.forEach((currency) => {
      const changeIcon =
        currency.change > 0
          ? "fa-arrow-up text-green"
          : currency.change < 0
          ? "fa-arrow-down text-red"
          : "fa-minus text-gray";
      const changeClass =
        currency.change > 0 ? "up" : currency.change < 0 ? "down" : "neutral";

      html += `
              <div class="volatile-item">
                  <span class="volatile-name">${currency.displayName}</span>
                  <span class="volatile-change ${changeClass}">
                      <i class="fas ${changeIcon}"></i>
                      ${this.toPersianNumbers(
                        this.formatNumber(Math.abs(currency.change), true)
                      )}
                  </span>
              </div>
          `;
    });

    volatileDiv.innerHTML = html;
  }

  updateCounter(count) {
    const countElement = document.getElementById("currenciesCount");
    if (countElement) {
      countElement.textContent =
        this.toPersianNumbers(count.toString()) + " ارز";
    }
  }

  updateTime() {
    const now = new Date();
    const timeElement = document.getElementById("currentTime");

    if (timeElement) {
      const timeString = now.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      timeElement.querySelector("span").textContent = timeString;
    }

    // Update every second
    setTimeout(() => this.updateTime(), 1000);
  }

  updateDate() {
    const now = new Date();
    const dateElement = document.getElementById("currentDate");

    if (dateElement) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      };
      const formatter = new Intl.DateTimeFormat("fa-IR", options);
      dateElement.textContent = formatter.format(now);
    }
  }

  updateLastUpdateTime() {
    const lastUpdateTime = document.getElementById("lastUpdateTime");
    const footerUpdateTime = document.getElementById("footerUpdateTime");

    if (this.lastUpdate) {
      const timeString = this.lastUpdate.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      if (lastUpdateTime) lastUpdateTime.textContent = timeString;
      if (footerUpdateTime) footerUpdateTime.textContent = timeString;
    }
  }

  setLoadingState(isLoading) {
    this.isRefreshing = isLoading;
    const refreshBtn = document.getElementById("refreshBtn");

    if (refreshBtn) {
      if (isLoading) {
        refreshBtn.classList.add("refreshing");
        refreshBtn.disabled = true;
        refreshBtn.innerHTML =
          '<i class="fas fa-sync-alt"></i><span>در حال بروزرسانی...</span>';
      } else {
        refreshBtn.classList.remove("refreshing");
        refreshBtn.disabled = false;
        refreshBtn.innerHTML =
          '<i class="fas fa-sync-alt"></i><span>بروزرسانی نرخ‌ها</span>';
      }
    }
  }

  showAlert(title, message, type = "info") {
    const modal = document.getElementById("alertModal");
    const alertTitle = document.getElementById("alertTitle");
    const alertMessage = document.getElementById("alertMessage");
    const alertIcon = document.getElementById("alertIcon");

    if (!modal || !alertTitle || !alertMessage) return;

    alertTitle.textContent = title;
    alertMessage.textContent = message;

    // Set icon based on type
    switch (type) {
      case "error":
        alertIcon.className = "fas fa-exclamation-circle";
        alertIcon.style.color = "#E74C3C";
        break;
      case "success":
        alertIcon.className = "fas fa-check-circle";
        alertIcon.style.color = "#2ECC71";
        break;
      default:
        alertIcon.className = "fas fa-info-circle";
        alertIcon.style.color = "#3498DB";
    }

    modal.style.display = "flex";

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideAlert();
    }, 5000);
  }

  hideAlert() {
    const modal = document.getElementById("alertModal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  updateClearButton() {
    const clearButton = document.getElementById("clearSearch");
    if (clearButton) {
      clearButton.style.display = this.searchQuery ? "flex" : "none";
    }
  }

  startAutoRefresh() {
    setInterval(() => {
      if (!this.isRefreshing) {
        this.loadCurrencies();
      }
    }, this.refreshInterval);
  }

  formatNumber(number, withSign = false) {
    if (number === undefined || number === null) return "0";

    const num = parseFloat(number);
    if (isNaN(num)) return "0";

    if (Math.abs(num) >= 1000000000) {
      const formatted = (num / 1000000000).toFixed(2);
      return withSign ? `${num >= 0 ? "+" : "−"}${formatted}` : `${formatted}`;
    } else if (Math.abs(num) >= 1000000) {
      const formatted = (num / 1000000).toFixed(2);
      return withSign ? `${num >= 0 ? "+" : "−"}${formatted}` : `${formatted}`;
    } else if (Math.abs(num) >= 1000) {
      const formatted = (num / 1000).toFixed(1);
      return withSign ? `${num >= 0 ? "+" : "−"}${formatted}` : `${formatted}`;
    } else {
      const formatted = new Intl.NumberFormat("en-US").format(Math.abs(num));
      return withSign ? `${num >= 0 ? "+" : "−"}${formatted}` : formatted;
    }
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

  toPersianNumbers(text) {
    if (!text) return "";
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return text.toString().replace(/\d/g, (digit) => persianDigits[digit]);
  }
}

// Initialize app
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new CurrencyListApp();
  window.app = app; // Make app globally available
});
