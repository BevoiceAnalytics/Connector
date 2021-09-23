"use strict";

const https = require("https");
let bconfig = require("./bevoice.config");
let { analytics } = require("./config");

class BevoiceAnalytics {
  config = {
    key: null,
  };

  constructor() {
    if (analytics.BevoiceAnalytics) {
      this.config = { ...this.config, ...analytics.BevoiceAnalytics };
    } else if (bconfig) {
      this.config = { ...this.config, ...bconfig };
    } else {
      console.error("BevoiceAnalytics error :: config is missing");
    }
  }

  async track(convObject) {
    if (!convObject.$request) {
      console.error("BevoiceAnalytics error :: payload is missing");
      return;
    }

    const obj = {
      request: convObject.$request || null,
      response: convObject.$response || null,
      type: "Alexa",
      ApiKey: this.config.key,
      requestTime: new Date().toISOString(),
    };

    await this._post({ body: JSON.stringify(obj) })
      .then((response) => {
        if (response.data.response == "API key not found") {
          console.log("Bevoice error :: API key not found");
        }
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  async _post(data) {
    const dataReady = JSON.stringify(data);
    const options = {
      protocol: "https:",
      hostname: "metricservice.bevoice.ai",
      port: 443,
      path: "/live/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": dataReady.length,
      },
    };
    return new Promise((resolve, reject) => {
      let data = "";
      const req = https.request(options, (res) => {
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(dataReady);
      req.end();
      resolve(data);
    });
  }
}

module.exports = new BevoiceAnalytics();
