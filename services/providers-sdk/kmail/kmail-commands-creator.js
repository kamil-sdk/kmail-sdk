'use strict';

const path = require('path');

const config = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-config.sdk'));
const KmailProtoLoader = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-proto-loader'));

const createConnectCommand = () => {
  const createCommand = config.connectCommand;
  return {
    data: {
      LicenseKey: config.LicenseKey,
      Identity: config.Identity,
      Password: config.Password,
      ApiMajorVersion: 1,
      ApiMinorVersion: 1
    },
    className: createCommand
  };
};

const createSubscribeCommand = (securityToken) => {
  const subscribeCommand = config.subscribeCommand;
  const SportFilter = KmailProtoLoader.create('SportFilter', {Sports: [1]});
  const filter = KmailProtoLoader.create('IEntityFilter', {SportFilter});
  return {
    data: {
      SecurityToken: securityToken,
      EntityTypes : 7343134,
      Filters: [filter]
    },
    className: subscribeCommand
  };
};

const createRegionQuery = (securityToken, entityTypes, sports) => {
  const queryCommand = config.queryCommand;
  const SportFilter = KmailProtoLoader.create('SportFilter', {Sports: [sports]});
  const filter = KmailProtoLoader.create('IEntityFilter', {SportFilter});
  return {
    data: {
      SecurityToken: securityToken,
      EntityTypes: entityTypes,
      Filters: [filter],
      IncludeRegionLeagueTeamReferences: true
    },
    className: queryCommand
  };
};

const createKeepAliveCommand = () => {
  const keepAlive = config.keepAlive;
  return {
    data: {
    },
    className: keepAlive
  };
};

module.exports = {
  createConnectCommand,
  createSubscribeCommand,
  createRegionQuery,
  createKeepAliveCommand
};
