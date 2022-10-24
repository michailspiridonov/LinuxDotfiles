/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
	// `on` is used to hook into various events Cypress emits
	// `config` is the resolved Cypress config
};

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
	// optional: register cypress-grep plugin code
	// https://github.com/cypress-io/cypress-grep
	require("cypress-grep/src/plugin")(config);
	return config;
};

const { install, ensureBrowserFlags } = require("@neuralegion/cypress-har-generator");

module.exports = (on, config) => {
	install(on, config);
  
	on("before:browser:launch", (browser = {}, launchOptions) => {
		ensureBrowserFlags(browser, launchOptions);
		return launchOptions;
	});
};
