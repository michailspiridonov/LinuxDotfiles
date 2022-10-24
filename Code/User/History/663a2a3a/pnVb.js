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

const { isFileExist, findFiles } = require("cy-verify-downloads");
const cypressPostgress = require("cypress-postgres");

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  let data = {
    createdDocumentId: "",
  };

  // setter and getter for storing value in node.js and share between tests if needed
  on("task", {
    setValue: (params) => {
      const { key, value } = params;
      data[key] = value;
      return value;
    },
    getValue: (params) => {
      const { key } = params;
      return data[key] || null;
    },
  });

  on("task", { isFileExist, findFiles });

  on("task", {
    dbQuery: (query) => cypressPostgress(query.query, query.connection),
  });

  on("task", {
    "gmail:check": async args => {
      const { from, to, subject } = args;
      const email = await gmail.check_inbox(
        path.resolve(__dirname, "credentials.json"), // credentials.json is inside plugins/ directory.
        path.resolve(__dirname, "gmail_token.json"), // gmail_token.json is inside plugins/ directory.
        subject,
        from, 
        to,
        5,                                          // Poll interval (in seconds)
        30                                           // Maximum poll interval (in seconds). If reached, return null, indicating the completion of the task().
      );
      return email;
    }
  });
};
