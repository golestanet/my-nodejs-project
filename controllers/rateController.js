const apiService = require("../services/apiService");

class RateController {
  async getAllRates(req, res) {
    try {
      const rates = await apiService.getFormattedRates();
      console.log("ta getAllRates\n");
      console.table(rates);
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: rates,
        count: Object.keys(rates).length,
      });
    } catch (error) {
      console.error("Controller Error (getAllRates):", error.message);

      res.status(503).json({
        success: false,
        error: "Service temporarily unavailable",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Get specific rate
  async getRate(req, res) {
    try {
      const { key } = req.params;
      const rates = await apiService.getFormattedRates();
      const rate = rates[key];

      if (!rate) {
        return res.status(404).json({
          success: false,
          error: "Rate not found",
          availableKeys: Object.keys(rates),
        });
      }

      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: rate,
      });
    } catch (error) {
      console.error("Controller Error (getRate):", error.message);

      res.status(503).json({
        success: false,
        error: "Service temporarily unavailable",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Get USD rates
  async getUSDRates(req, res) {
    try {
      const rates = await apiService.getUSDRates();

      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: rates,
        count: Object.keys(rates).length,
      });
    } catch (error) {
      console.error("Controller Error (getUSDRates):", error.message);

      res.status(503).json({
        success: false,
        error: "Service temporarily unavailable",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Get primary USD rate (main display)
  async getPrimaryRate(req, res) {
    try {
      const rate = await apiService.getPrimaryUSDRate();
      console.table(rate);
      if (!rate) {
        throw new Error("No rates available");
      }

      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: rate,
        source: "navasan.tech",
      });
    } catch (error) {
      console.error("Controller Error (getPrimaryRate):", error.message);

      // Fallback to demo data
      res.json({
        success: false,
        error: "Using demo data",
        message: error.message,
        timestamp: new Date().toISOString(),
        demo: true,
        data: {
          key: "usd_usdt_demo",
          name: "USD to IRR (Demo)",
          value: 135300,
          change: -1300,
          formattedValue: "135,300",
          formattedChange: "-1,300",
          changeDirection: "down",
          date: new Date().toLocaleString("fa-IR"),
        },
      });
    }
  }

  // Refresh rates (force update)
  async refreshRates(req, res) {
    try {
      const rates = await apiService.refreshRates();

      res.json({
        success: true,
        message: "Rates refreshed successfully",
        timestamp: new Date().toISOString(),
        count: Object.keys(rates.getAllRates()).length,
      });
    } catch (error) {
      console.error("Controller Error (refreshRates):", error.message);

      res.status(500).json({
        success: false,
        error: "Failed to refresh rates",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Health check
  async healthCheck(req, res) {
    try {
      const cached = apiService.getCachedRates();

      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        cache: {
          hasCache: !!cached,
          isFresh: cached ? cached.isFresh() : false,
          age: cached ? new Date() - cached.timestamp : null,
        },
        environment: process.env.NODE_ENV,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
  }
}

module.exports = new RateController();
