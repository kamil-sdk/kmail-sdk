'use strict';

const path = require('path');
const _ = require('lodash');
const moment = require('moment');

const config = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-config.sdk'));
const PackageTransformer = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-package-transformer'));

const emitProtoChange = (emitter) => {
  emitter.emit('err', {error: 'Kmail might changed their .proto folder. if persist contact Kmail ASAP!'});
}

const keepAliveHandler = (decodedData, kmailSDK, dataChannel) => {
  if (dataChannel) {
    kmailSDK.dataKeepAlive = moment();
  } else {
    kmailSDK.commandKeepAlive = moment();
  }

  return true;
};

const commandStatusHandler = (decodedData, kmailSDK, dataChannel) => {
  if (_.get(decodedData, 'SecurityToken')) {
    kmailSDK.securityToken = decodedData.SecurityToken;
    kmailSDK.connectXSub(); 
    kmailSDK.startKeepAliveProcess();
    return true;
  }

  return false;
};

const subscriptionStatusHandler = (decodedData, kmailSDK, dataChannel) => {
  if (decodedData.Accepted) {
    kmailSDK.activate();
  }
};

const modelHandler = (decodedObject, kmailSDK, dataChannel, className) => {
  kmailSDK.emitter.emit(className, decodedObject);
}

const queryFinishedHandler = (decodedObject, kmailSDK, dataChannel, className) => {
  kmailSDK.emitter.emit(className, decodedObject.Count.toString());
};

const router = {};
router[config.keepAlive] = keepAliveHandler;
router[config.commandStatus] = commandStatusHandler;
router[config.subscriptionStatus] = subscriptionStatusHandler;
router[config.regionModel] = modelHandler;
router[config.leagueModel] = modelHandler;
router[config.teamModel] = modelHandler;
router[config.eventModel] = modelHandler;
router[config.eventUpdateModel] = modelHandler;
router[config.lineModel] = modelHandler;
//router[config.priceModel] = modelHandler;
router[config.queryStatusModel] = queryFinishedHandler;

const routeResponse = (frame2, frame3, frame4, kmailSDK, dataChannel) => {
  let decodedData = null;

  try{
    decodedData = PackageTransformer.extract(frame2, frame3, frame4);
  } catch (err) {
    kmailSDK.emitter.emit('err', err);
    emitProtoChange(kmailSDK.emitter);
  }

  if(!decodedData) {
    kmailSDK.emitter.emit('err', { error: 'Server Response Error: Error extracting the server response. '
      + 'Kmail might changed their .proto folder. if persist contact Kmail ASAP!' });
      emitProtoChange(kmailSDK.emitter);
  }

  if (router[decodedData.className]) {
    const emittedName = _.get(config, `commandsConvertTable.${decodedData.className}.emittedName`);
    return router[decodedData.className](decodedData.object, kmailSDK, dataChannel, emittedName);
  }
  else{
    kmailSDK.emitter.emit('err', { error:`Server Response Error: Received an object of class - `
      + `"${decodedData.className}". This is an unknown class` });
      emitProtoChange(kmailSDK.emitter);
  }

  return false;
};

module.exports = {
  routeResponse
};
