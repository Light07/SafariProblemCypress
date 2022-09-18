const { defineConfig } = require("cypress");

const browserify = require('@cypress/browserify-preprocessor')
const fs = require('fs-extra')
const path = require('path')


// add environment switch support
function getConfigurationByFile (file) {
  const pathToConfigFile = path.resolve(process.cwd(), '././envs', `cypress.${file}.json`)
  return fs.readJson(pathToConfigFile)
}



module.exports = defineConfig({
  e2e: {
    baseUrl: null,
    "specPattern": "src/tests/**/*.cy.js",
    "excludeSpecPattern":  [
      '**/snapshots/*',
      '**/__image_snapshots__/*',
    ],
    "fixturesFolder": "src/configs",
    "supportFile": "src/support/e2e.js",
    "experimentalSessionAndOrigin":true,
    setupNodeEvents(on, config) {
      require('cypress-failed-log/on')(on);
      const options = browserify.defaultOptions
      on('file:preprocessor', browserify(options))
      on('before:browser:launch', (browser = {}, launchOptions) => {
        launchOptions.args = require('cypress-log-to-output').browserLaunchHandler(browser, launchOptions.args);
        if (browser.name === 'chrome') {
          launchOptions.args.push('--auto-open-devtools-for-tabs')
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-dev-shm-usage');
          return launchOptions;
        }
        return launchOptions;
      })

      let file = config.env.testEnv || 'dev'

      return getConfigurationByFile(file)
    },
  },
  "projectId": "",
  "env": {},
  "video": false,
  "videoUploadOnPasses": false,
  "defaultCommandTimeout": 8000,
  "pageLoadTimeout": 60000,
  "requestTimeout": 15000,
  "numTestsKeptInMemory": 1,
  "responseTimeout": 60000,
  "viewportWidth": 1440,
  "viewportHeight": 900,
  "waitForAnimations": true,
  "taskTimeout": 60000,
  "trashAssetsBeforeRuns": false,
  "experimentalWebKitSupport": true,
  "retries": {
    "runMode": 1,
    "openMode": 0
  },
  "screenshotsFolder": "src/screenshots",
});
