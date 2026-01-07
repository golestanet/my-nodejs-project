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
        value: "135850",
        change: -650,
        timestamp: 1767289355,
        date: "1404-10-11 21:12:35",
      },
      dolar_harat_sell: {
        value: "20250",
        change: 0,
        timestamp: 1765117658,
        date: "1404-09-16 17:57:38",
      },
      harat_naghdi_sell: {
        value: "133890",
        change: -200,
        timestamp: 1767286434,
        date: "1404-10-11 20:23:54",
      },
      harat_naghdi_buy: {
        value: "133490",
        change: -200,
        timestamp: 1767286434,
        date: "1404-10-11 20:23:54",
      },
      sekkeh: {
        value: "147800",
        change: -500,
        timestamp: 1767289346,
        date: "1404-10-11 21:12:26",
      },
      bahar: {
        value: "142300",
        change: -2200,
        timestamp: 1767289346,
        date: "1404-10-11 21:12:26",
      },
      nim: {
        value: "81200",
        change: -600,
        timestamp: 1767289346,
        date: "1404-10-11 21:12:26",
      },
      rob: {
        value: "48100",
        change: -400,
        timestamp: 1767289346,
        date: "1404-10-11 21:12:26",
      },
      abshodeh: {
        value: "61290",
        change: 200,
        timestamp: 1767289346,
        date: "1404-10-11 21:12:26",
      },
      gerami: {
        value: "21800",
        change: -100,
        timestamp: 1767289346,
        date: "1404-10-11 21:12:26",
      },
      "18ayar": {
        value: "14148160",
        change: 46170,
        timestamp: 1767289346,
        date: "1404-10-11 21:12:26",
      },
      usd_sell: {
        value: "135200",
        change: -100,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      usd_buy: {
        value: "134800",
        change: -100,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      usd_farda_sell: {
        value: "135200",
        change: -100,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      usd_farda_buy: {
        value: "134800",
        change: -100,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      dirham_dubai: {
        value: "37000",
        change: -770,
        timestamp: 1767255330,
        date: "1404-10-11 11:45:30",
      },
      cad_cash: {
        value: "78230",
        change: 0,
        timestamp: 1761047842,
        date: "1404-07-29 15:27:22",
      },
      hav_cad_my: {
        value: "100850",
        change: 0,
        timestamp: 1767289342,
        date: "1404-10-11 21:12:22",
      },
      aed_sell: {
        value: "37160",
        change: -30,
        timestamp: 1767287841,
        date: "1404-10-11 20:47:21",
      },
      usdt: {
        value: "135850",
        change: -650,
        timestamp: 1767289355,
        date: "1404-10-11 21:12:35",
      },
      usd_shakhs: {
        value: "138520",
        change: -110,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_sherkat: {
        value: "137220",
        change: -110,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      eur_hav: {
        value: "162070",
        change: -60,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      gbp_hav: {
        value: "183870",
        change: 90,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      aud_hav: {
        value: "91060",
        change: -80,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      myr_hav: {
        value: "33650",
        change: 0,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      cny_hav: {
        value: "19870",
        change: -40,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      try_hav: {
        value: "3240",
        change: 0,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      jpy_hav: {
        value: "890",
        change: 0,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      cad_hav: {
        value: "100500",
        change: 0,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      hav_cad_cheque: {
        value: "100600",
        change: 0,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      hav_cad_cash: {
        value: "100500",
        change: 0,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_pp: {
        value: "134600",
        change: -100,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      eur_pp: {
        value: "158630",
        change: -160,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_btc: {
        value: "11967496610",
        change: 3327400,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_eth: {
        value: "405617010",
        change: -64340,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_xrp: {
        value: "253560",
        change: 3250,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_bch: {
        value: "79909780",
        change: -1521950,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_ltc: {
        value: "10724750",
        change: 241030,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_eos: {
        value: "22050",
        change: 280,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_bnb: {
        value: "116643700",
        change: -1103730,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_dash: {
        value: "5777140",
        change: 122250,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      aed_note: {
        value: "37170",
        change: -30,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      aed: {
        value: "37160",
        change: -30,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      gbp_wht: {
        value: "181110",
        change: 90,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      aud_wht: {
        value: "87880",
        change: -70,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_doge: {
        value: "16920",
        change: 910,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_sol: {
        value: "16994950",
        change: -49330,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_ada: {
        value: "47750",
        change: 2370,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_shib: {
        value: "0.98833651226158",
        change: 0.04920163487738005,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_avax: {
        value: "1749390",
        change: 64530,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_matic: {
        value: "0",
        change: 0,
        timestamp: 1760691743,
        date: "1404-07-25 12:32:23",
      },
      usd_dot: {
        value: "267630",
        change: 24380,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_xlm: {
        value: "27930",
        change: 800,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_ton: {
        value: "228390",
        change: 4860,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_trx: {
        value: "38760",
        change: 80,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_uni: {
        value: "784380",
        change: 5920,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_link: {
        value: "1688690",
        change: 14240,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_atom: {
        value: "275030",
        change: 13190,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_xmr: {
        value: "57414580",
        change: -2414450,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_etc: {
        value: "1620950",
        change: 61060,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_fil: {
        value: "207660",
        change: 32850,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_icp: {
        value: "412360",
        change: 42290,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_hbar: {
        value: "15100",
        change: 560,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_vet: {
        value: "1480",
        change: 50,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_near: {
        value: "216920",
        change: 14220,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_qnt: {
        value: "9934450",
        change: 476150,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_mkr: {
        value: "191017320",
        change: 5396290,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_aave: {
        value: "20018810",
        change: 280610,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_grt: {
        value: "4800",
        change: 280,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_algo: {
        value: "16000",
        change: 900,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_axs: {
        value: "114380",
        change: 4660,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_stx: {
        value: "34840",
        change: 2000,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_egld: {
        value: "789560",
        change: 32300,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_sand: {
        value: "15340",
        change: 590,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd_theta: {
        value: "37500",
        change: 1580,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      btc: {
        value: "11967496610",
        change: 3327400,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      eth: {
        value: "405617010",
        change: -64340,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      xrp: {
        value: "253560",
        change: 3250,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      bch: {
        value: "79909780",
        change: -1521950,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      ltc: {
        value: "10724750",
        change: 241030,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      eos: {
        value: "22050",
        change: 280,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      bnb: {
        value: "116643700",
        change: -1103730,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      dash: {
        value: "5777140",
        change: 122250,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      doge: {
        value: "16920",
        change: 910,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      sol: {
        value: "16994950",
        change: -49330,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      ada: {
        value: "47750",
        change: 2370,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      shib: {
        value: "0.98833651226158",
        change: 0.04920163487738005,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      avax: {
        value: "1749390",
        change: 64530,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      matic: {
        value: "0",
        change: 0,
        timestamp: 1760691743,
        date: "1404-07-25 12:32:23",
      },
      dot: {
        value: "267630",
        change: 24380,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      xlm: {
        value: "27930",
        change: 800,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      ton: {
        value: "228390",
        change: 4860,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      trx: {
        value: "38760",
        change: 80,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      uni: {
        value: "784380",
        change: 5920,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      link: {
        value: "1688690",
        change: 14240,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      atom: {
        value: "275030",
        change: 13190,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      xmr: {
        value: "57414580",
        change: -2414450,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      etc: {
        value: "1620950",
        change: 61060,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      fil: {
        value: "207660",
        change: 32850,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      icp: {
        value: "412360",
        change: 42290,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      hbar: {
        value: "15100",
        change: 560,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      vet: {
        value: "1480",
        change: 50,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      near: {
        value: "216920",
        change: 14220,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      qnt: {
        value: "9934450",
        change: 476150,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      mkr: {
        value: "191017320",
        change: 5396290,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      aave: {
        value: "20018810",
        change: 280610,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      grt: {
        value: "4800",
        change: 280,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      algo: {
        value: "16000",
        change: 900,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      axs: {
        value: "114380",
        change: 4660,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      stx: {
        value: "34840",
        change: 2000,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      egld: {
        value: "789560",
        change: 32300,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      sand: {
        value: "15340",
        change: 590,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      theta: {
        value: "37500",
        change: 1580,
        timestamp: 1767292943,
        date: "1404-10-11 22:12:23",
      },
      usd: {
        value: "135200",
        change: -100,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      eur: {
        value: "158630",
        change: -160,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      gbp: {
        value: "181810",
        change: -160,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      jpy: {
        value: "860",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      aud: {
        value: "90180",
        change: -30,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      cad: {
        value: "98500",
        change: -140,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      chf: {
        value: "170370",
        change: -170,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ugx: {
        value: "37.32",
        change: -0.020000000000003126,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      cny: {
        value: "19320",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      myr: {
        value: "33320",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bgn: {
        value: "81120",
        change: -70,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      pgk: {
        value: "31720",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      irr: {
        value: "3.21",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      gmd: {
        value: "1825",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      xcd: {
        value: "50030",
        change: -30,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      htg: {
        value: "1030",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      top: {
        value: "56150",
        change: -40,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      vuv: {
        value: "1120",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      nok: {
        value: "13400",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      isk: {
        value: "1080",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      pkr: {
        value: "482.46",
        change: -0.35000000000002274,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      lbp: {
        value: "1.51",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      lyd: {
        value: "24950",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      awg: {
        value: "75010",
        change: -50,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mwk: {
        value: "77.91",
        change: -0.060000000000002274,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      cup: {
        value: "5100",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bwp: {
        value: "10290",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      rub: {
        value: "1710",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      brl: {
        value: "24510",
        change: -50,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      azn: {
        value: "79570",
        change: 20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      uyu: {
        value: "3450",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      stn: {
        value: "6480",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      djf: {
        value: "760",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mmk: {
        value: "64.33",
        change: -0.10000000000000853,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      qar: {
        value: "37140",
        change: -30,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      clp: {
        value: "150.2",
        change: -0.11000000000001364,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      sek: {
        value: "14650",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ils: {
        value: "42420",
        change: -40,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      kgs: {
        value: "1545",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      crc: {
        value: "271.99",
        change: -0.19999999999998863,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      fjd: {
        value: "59470",
        change: -50,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      cdf: {
        value: "62.45",
        change: -0.03999999999999915,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      hnl: {
        value: "5120",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      lkr: {
        value: "436.3",
        change: -0.3199999999999932,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      dkk: {
        value: "21240",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      xaf: {
        value: "241.95",
        change: -0.18000000000000682,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      tjs: {
        value: "14630",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mga: {
        value: "29.43",
        change: -0.030000000000001137,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      lrd: {
        value: "760",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ssp: {
        value: "86.02",
        change: 0,
        timestamp: 1698420813,
        date: "1402-08-05 19:03:33",
      },
      lsl: {
        value: "8160",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      scr: {
        value: "9790",
        change: -120,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      kwd: {
        value: "439400",
        change: -340,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      vnd: {
        value: "5.14",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      egp: {
        value: "2835",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      svc: {
        value: "15440",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ttd: {
        value: "19880",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ghs: {
        value: "12870",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mru: {
        value: "3400",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      tzs: {
        value: "54.73",
        change: -0.04000000000000625,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mnt: {
        value: "37.99",
        change: -0.030000000000001137,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      nzd: {
        value: "77780",
        change: -50,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ron: {
        value: "31150",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      pen: {
        value: "40170",
        change: -30,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      jod: {
        value: "190680",
        change: -170,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      iqd: {
        value: "103.13",
        change: -0.0799999999999983,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      cve: {
        value: "1440",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      lak: {
        value: "6.25",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      dop: {
        value: "2145",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      sar: {
        value: "36050",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      try: {
        value: "3145",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bdt: {
        value: "1105",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      pyg: {
        value: "20.58",
        change: -0.010000000000001563,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mad: {
        value: "14820",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      xpf: {
        value: "1330",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      aoa: {
        value: "147.44",
        change: -0.11000000000001364,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      yer: {
        value: "565",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      zar: {
        value: "8160",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      idr: {
        value: "8.1",
        change: -0.009999999999999787,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      kzt: {
        value: "266.46",
        change: -0.18999999999999773,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bob: {
        value: "19510",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bzd: {
        value: "67170",
        change: -50,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      kmf: {
        value: "321.9",
        change: -0.2400000000000091,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      all: {
        value: "1640",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      khr: {
        value: "33.72",
        change: -0.020000000000003126,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      czk: {
        value: "6570",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      thb: {
        value: "4295",
        change: 5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      php: {
        value: "2295",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      tmt: {
        value: "38520",
        change: -30,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      afn: {
        value: "2045",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      jmd: {
        value: "850",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      gip: {
        value: "181780",
        change: -570,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      szl: {
        value: "8160",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      npr: {
        value: "940",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      krw: {
        value: "93.59",
        change: -0.09000000000000341,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bhd: {
        value: "358650",
        change: -210,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      twd: {
        value: "4310",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      uah: {
        value: "3195",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      etb: {
        value: "870",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      srd: {
        value: "3545",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      syp: {
        value: "12.23",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ern: {
        value: "9010",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      sos: {
        value: "236.81",
        change: -0.1699999999999875,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      wst: {
        value: "48710",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mur: {
        value: "2925",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      huf: {
        value: "412.55",
        change: -0.9900000000000091,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ngn: {
        value: "93.54",
        change: -0.03999999999999204,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      rsd: {
        value: "1355",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mkd: {
        value: "2575",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      sbd: {
        value: "16620",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ang: {
        value: "75510",
        change: -60,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mop: {
        value: "16850",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bam: {
        value: "81150",
        change: -60,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      dzd: {
        value: "1045",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      pln: {
        value: "37590",
        change: -50,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      hrk: {
        value: "21080",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      byn: {
        value: "45990",
        change: -30,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ars: {
        value: "93.15",
        change: -0.0799999999999983,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      tnd: {
        value: "46330",
        change: -30,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bif: {
        value: "45.67",
        change: -0.030000000000001137,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      zmw: {
        value: "6090",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      gtq: {
        value: "17610",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bnd: {
        value: "105090",
        change: -80,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      sgd: {
        value: "105080",
        change: -100,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      hkd: {
        value: "17370",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      amd: {
        value: "354.25",
        change: -0.2699999999999818,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ves: {
        value: "454.04",
        change: -0.339999999999975,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bsd: {
        value: "135100",
        change: -100,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      gnf: {
        value: "15.44",
        change: -0.009999999999999787,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      gel: {
        value: "50170",
        change: -30,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      omr: {
        value: "351630",
        change: -260,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      cop: {
        value: "35.86",
        change: -0.030000000000001137,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mxn: {
        value: "7500",
        change: -20,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mdl: {
        value: "8030",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      nio: {
        value: "3670",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      gyd: {
        value: "645",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      rwf: {
        value: "92.72",
        change: -0.07000000000000739,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      sll: {
        value: "6.45",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mvr: {
        value: "8750",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      inr: {
        value: "1500",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      bbd: {
        value: "67080",
        change: -50,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      xof: {
        value: "241.95",
        change: -0.18000000000000682,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      uzs: {
        value: "11.25",
        change: -0.009999999999999787,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      pab: {
        value: "135100",
        change: -100,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      nad: {
        value: "8160",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      sdg: {
        value: "224.77",
        change: -0.1699999999999875,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mzn: {
        value: "2115",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      kes: {
        value: "1045",
        change: -5,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mro: {
        value: "140.9",
        change: 0,
        timestamp: 1701880094,
        date: "1402-09-15 19:58:14",
      },
      bmd: {
        value: "135200",
        change: -100,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      btn: {
        value: "1500",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      byr: {
        value: "6.9",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      clf: {
        value: "5892350",
        change: -4360,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      cuc: {
        value: "135200",
        change: -100,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      fkp: {
        value: "181780",
        change: -570,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ggp: {
        value: "181780",
        change: -570,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      imp: {
        value: "181780",
        change: -570,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      jep: {
        value: "181780",
        change: -570,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      kpw: {
        value: "150.22",
        change: -0.11000000000001364,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      kyd: {
        value: "162110",
        change: -120,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      ltl: {
        value: "45790",
        change: -30,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      lvl: {
        value: "223510",
        change: -170,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      shp: {
        value: "180200",
        change: -140,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      sle: {
        value: "5620",
        change: -10,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      std: {
        value: "6.53",
        change: -0.009999999999999787,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      vef: {
        value: "0.02",
        change: 0,
        timestamp: 1731429758,
        date: "1403-08-22 20:12:38",
      },
      xag: {
        value: "9699400",
        change: 16440,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      xau: {
        value: "585281390",
        change: 962630,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      xdr: {
        value: "194540",
        change: -150,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      zmk: {
        value: "15.02",
        change: -0.009999999999999787,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      zwl: {
        value: "419.88",
        change: -0.3100000000000023,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      cnh: {
        value: "19380",
        change: 0,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      xcg: {
        value: "74960",
        change: -60,
        timestamp: 1767284918,
        date: "1404-10-11 19:58:38",
      },
      mex_usd_sell: {
        value: "1241493",
        change: 0,
        timestamp: 1767289342,
        date: "1404-10-11 21:12:22",
      },
      mex_usd_buy: {
        value: "1229078",
        change: 0,
        timestamp: 1767289342,
        date: "1404-10-11 21:12:22",
      },
      mex_eur_sell: {
        value: "1459681",
        change: 0,
        timestamp: 1767289342,
        date: "1404-10-11 21:12:22",
      },
      mex_eur_buy: {
        value: "1445084",
        change: 0,
        timestamp: 1767289342,
        date: "1404-10-11 21:12:22",
      },
      usd_xau: {
        value: "4325.445",
        change: 6.755000000000109,
        timestamp: 1767292946,
        date: "1404-10-11 22:12:26",
      },
      bub_sekkeh: {
        value: "10146740",
        change: -613290,
        timestamp: 1767292946,
        date: "1404-10-11 22:12:26",
      },
      bub_bahar: {
        value: "4676740",
        change: -2313290,
        timestamp: 1767292946,
        date: "1404-10-11 22:12:26",
      },
      bub_nim: {
        value: "12366830",
        change: -656640,
        timestamp: 1767292946,
        date: "1404-10-11 22:12:26",
      },
      bub_rob: {
        value: "13668420",
        change: -428320,
        timestamp: 1767292946,
        date: "1404-10-11 22:12:26",
      },
      bub_18ayar: {
        value: "46840",
        change: 34560,
        timestamp: 1767292946,
        date: "1404-10-11 22:12:26",
      },
      bub_gerami: {
        value: "4848410",
        change: -113930,
        timestamp: 1767292946,
        date: "1404-10-11 22:12:26",
      },
      bub_abshodeh: {
        change_val: 0,
        change_pct: 0,
        date: 1767292946,
      },
      mob_usd: {
        value: "42000",
        change: 0,
        timestamp: 1560948147,
        date: "1398-03-29 17:12:27",
      },
      mob_gbp: {
        value: "54933",
        change: 0,
        timestamp: 1560948147,
        date: "1398-03-29 17:12:27",
      },
      mob_eur: {
        value: "48872",
        change: 0,
        timestamp: 1560948147,
        date: "1398-03-29 17:12:27",
      },
      mob_aed: {
        value: "11437",
        change: 0,
        timestamp: 1560948147,
        date: "1398-03-29 17:12:27",
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
