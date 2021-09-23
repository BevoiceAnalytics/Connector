"use strict";

const https = require("https");
const { Plugin } = require("jovo-core");

class BevoiceAnalytics extends Plugin {
  config = {
    apiKey: null,
  };

  constructor(config) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  install(app) {
    app.middleware("request").use(this.sendRequest.bind(this));
  }

  async track(handleRequest) {
    if (!handleRequest.host) {
      console.error("BevoiceAnalytics error :: payload is missing");
      return;
    }

    const requestObj = handleRequest.host.$request || null;
    const responseObj = handleRequest.host.$response || null;

    // avoiding health check requests
    const { payload } = requestObj.originalDetectIntentRequest;
    let inputArgs = payload.inputs.arguments || undefined;
    if (Array.isArray(inputArgs)) {
      if (inputArgs[0].name === "is_health_check") {
        return;
      }
    }

    const obj = {
      request: requestObj,
      response: responseObj,
      type: "Dialogflow",
      ApiKey: this.config.apiKey,
      requestTime: new Date().toISOString(),
    };

    await this.post({ body: JSON.stringify(obj) })
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

  async post(data) {
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
