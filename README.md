# Bevoice Connector

This plugin helps action and skill developers to implement the Bevoice Analytics metrics system in their voice assistants.

At the current stage, this solution is compatible with the following platforms:

- Amazon Alexa
- Google Dialogflow
- Google Actions

If you want Bevoice Analytics to be able to support other platforms, create a new issue so that we can evaluate a quick implementation for you or your company.

## Howto

Those connectors essentially have one function: to send and register the request and, optionally, the response data to your Bevoice Analytics account.

## Setup

On your voice assistant project folder, copy the corresponding bevoiceConnector.js file into your project (usually inside the "src" folder). Once copied, just import the connector as following:

```
const bevoiceConnector = require('./bevoiceConnector')

or

import bevoiceConnector from './bevoiceConnector'
```

Once imported, you need to call the track method, setting the parameters correctly.

```
bevoiceConnector.track({
    ApiKey: 'ABCDEFGH1234567890', // Set your API Key registered in Bevoice Analytics
    request: {}, // Change by the original object containing the user's request, coming from the wizard for your API
    response: {} // Change by the original object containing the response produced by your API for the helper
})
```

Attention: It is not necessary to instantiate the Bevoice Connector using "new".

## Troubleshoot

This product is still in the testing phase. We appreciate any feedback and are here to help you with any problems you may have while installing or using the tool. Please feel free to open an issue reporting your problem if you need help.
