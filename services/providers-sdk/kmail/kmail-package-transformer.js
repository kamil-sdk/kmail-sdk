'use strict';

const path = require('path');
const _ = require('lodash');

const KmailProtoLoader = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-proto-loader'));
const config = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-config.sdk'));
const uuid = require(path.resolve(__kmail_basedir, 'utils/general/uuid'));
const dateTimeProtoConverter = require(path.resolve(__kmail_basedir, 'utils/general/dateTimeProtoConverter'));

const emptyBuffer = Buffer.from('');

const addUUID = async (rawData) => {
  const processedData = rawData
  const connectGuidMessageId = await uuid.randomUUID();
  processedData.RequestId = KmailProtoLoader.create('Guid', connectGuidMessageId);
  return processedData;
};

const convertTable = config.commandsConvertTable;
convertTable[config.connectCommand].additionalWork = addUUID;
convertTable[config.subscribeCommand].additionalWork = addUUID;
convertTable[config.queryCommand].additionalWork = addUUID;
const idToClassName = {};
_.keys(convertTable).forEach((key) => {idToClassName[convertTable[key].id] = key});

const createEnvelop = async (id) => {
  const connectGuidMessageId = await uuid.randomUUID();

  const envelope = {
    PayloadType: id,
    Origin: config.commandSocketIdentity,
    Timestamp: KmailProtoLoader.create('DateTime', dateTimeProtoConverter.getNowDateTime()),
    MessageId: KmailProtoLoader.create('Guid', connectGuidMessageId)
  };

  return KmailProtoLoader.createAndEncode('MessageEnvelope', envelope)
}

const decodeEnvelop = envelopBuffer => KmailProtoLoader.decode('MessageEnvelope', envelopBuffer);

const prepare = async (className, data) => {
  const convertor = convertTable[className];
  let payloadData = data;

  if (!convertor) {
    throw Error('Unknown class');
  }

  if (convertor.additionalWork) {
    payloadData = await convertor.additionalWork(data);
  }

  let payload = [];

  if (!_.isEmpty(payloadData)) {
    payload = KmailProtoLoader.createAndEncode(className, payloadData);
  }
  const envelop = await createEnvelop(convertor.id);

  return [emptyBuffer, envelop, payload];
};

const extract = (frame2, frame3, frame4) => {
  let envelop = frame3;
  let payload = frame4;

  if (!payload) {
    payload = frame3;
    envelop = frame2;
  }

  if (!envelop || ! payload) {
    throw Error('Invalid Data!');
  }

  const envelopObject = decodeEnvelop(envelop);
  const className = idToClassName[envelopObject.PayloadType];

  if (!className) {
    throw Error('Unknown class id! can\'t decode');
  }

  let retObject = undefined; 
  if (!convertTable[className].isEmpty) {
    try {
      retObject = KmailProtoLoader.decode(className, payload);
    } catch (err) {
      console.log(`could not decode object of id ${envelopObject.PayloadType} - ${className}`)
      //throw err;
    }
  }

  return {
    object: retObject,
    className
  };
};

const prepareXSubConnectBuffer = (securityToken) => {
  const buf = Buffer.from(securityToken, 'utf8');
  return [Buffer.concat([Buffer.from([1]), buf])];
};

module.exports = {
  prepare,
  prepareXSubConnectBuffer,
  extract
};
