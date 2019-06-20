'use strict';

const path = require('path');

global.__kmail_basedir = path.resolve(__dirname);
const KmailSDK = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail.sdk'));
const KmailProtoLoader = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-proto-loader'));


module.exports.initApp = (app) => {
  
  module.exports.app = require('./exports/app.exports')(app);
};

module.exports = {
  KmailSDK,
  KmailProtoLoader
};
