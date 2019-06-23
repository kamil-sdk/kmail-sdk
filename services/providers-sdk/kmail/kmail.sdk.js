'use strict';

const _ = require('lodash');
const path = require('path');
const zmq = require('zeromq');
const eventEmitter = require('events');
const moment = require('moment');

const CommandCreator = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-commands-creator'));
const PackageTransformer = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-package-transformer'));
const ResponseHandler = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-response-handler'));
const {Deferred} = require(path.resolve(__kmail_basedir, 'utils/general/deferred'));

class KmailSDK {
  constructor(ipAddress, consumerName, commandPort, dataPort, licenseKey, identity, password) {
    this.ipAddress = ipAddress;
    this.commandPort = commandPort;
    this.dataPort = dataPort;
    this.licenseKey = licenseKey;
    this.identity = identity;
    this.password = password;
    this.emitter = new eventEmitter();
    this.commandSocket = zmq.socket('dealer');
    this.commandSocket.identity = `${consumerName}_Command`;
    this.dataSocket = zmq.socket('xsub');
    this.dataSocket.identity = `${consumerName}_Data`;
    this.securityToken = null;
    this.dataKeepAlive = null;
    this.commandKeepAlive = null;
    this.promiseDeferred = null;
  }

  async connectXSub() {
    await this.dataSocket.connect(`${this.ipAddress}:${this.dataPort}`);
  
    this.dataSocket.on('message', (frame1, frame2, frame3, frame4) => {
      ResponseHandler.routeResponse(frame2, frame3, frame4, this, true);
    });

    await this.dataSocket.send(PackageTransformer.prepareXSubConnectBuffer(this.securityToken));
  }
  
  async connect() {
    this.promiseDeferred = new Deferred();

    if (this.isActive) {
      this.promiseDeferred.resolve(this.emitter);
      return this.promiseDeferred.promise;
    }

    const connectCommand = CommandCreator.createConnectCommand(this);
    const buffer = await PackageTransformer.prepare(connectCommand.className, connectCommand.data);
    this.commandSocket.connect(`${this.ipAddress}:${this.commandPort}`);
    
    this.commandSocket.on('message', (frame1, frame2, frame3, frame4) => {
      ResponseHandler.routeResponse(frame2, frame3, frame4, this, false);
    });

    this.commandSocket.send(buffer);

    setTimeout(() => {
      if (!this.isActive) {
        this.promiseDeferred.reject('Timed out');
      }
    }, 3 * 1000);

    return this.promiseDeferred.promise;
  }

  activate() {
    this.promiseDeferred.resolve(this.emitter);
    setTimeout(() => {
      this.isActive = true;
      this.emitter.emit('statusUpdate', {status: 'active'});
    }, 200);
  }

  async runQuery(entityTypeInteger, sports) {
    if (!entityTypeInteger) {
      entityTypeInteger = 3198; // all types
    }

    if (!sports) {
      sports = 1;// soccer
    }

    const queryRegion = CommandCreator.createRegionQuery(this.securityToken, entityTypeInteger, sports);
    const buffer = await PackageTransformer.prepare(queryRegion.className, queryRegion.data);
    this.commandSocket.send(buffer);
  }

  async subscribeToAll() {
    const subscribeCommand = CommandCreator.createSubscribeCommand(this.securityToken);
    const buffer = await PackageTransformer.prepare(subscribeCommand.className, subscribeCommand.data);
    this.commandSocket.send(buffer);
  }

  async startKeepAliveProcess() {
    const keepAlive = CommandCreator.createKeepAliveCommand();
    const buffer = await PackageTransformer.prepare(keepAlive.className, keepAlive.data);

    const interval = setInterval(() => {
      if (!this.isActive || !this.healthCheck()) {
        clearInterval(interval)
        return;
      }

      this.commandSocket.send(buffer);
    }, 1000 * 5);
  }

  healthCheck() {
    const now = moment()
    let rtVal = true;
    if (this.commandKeepAlive) {
      const diff = now.diff(this.commandKeepAlive, 'seconds');

      rtVal = diff < 10;
    }

    if (!rtVal && this.dataKeepAlive) {
      const diff = now.diff(this.dataKeepAlive, 'seconds');

      rtVal = diff < 10;
    }

    if (!rtVal) {
      this.isActive = false;
      rtVal = false;
      eventEmitter.emit('statusUpdate', {status: 'inactive', reconnecting: true});
      this.connect();
    }

    return rtVal;
  }

  disconnect() {
    this.isActive = false;
    eventEmitter.emit('statusUpdate', {status: 'inactive', reconnecting: false});
  }
}

module.exports = KmailSDK;
