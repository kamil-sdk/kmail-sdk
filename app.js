'use strict';

const path = require('path');

global.__kmail_basedir = path.resolve(__dirname);
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const KmailSDK = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail.sdk'));
const KmailProtoLoader = require(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/kmail-proto-loader'));

/**
 * Create Express server.
 */
const app = express();

/*
 * Enable Compression
 */
app.use(compression());

/**
 * Enable CORS
 */
app.use(cors());

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8082);
app.set('appName', process.env.APP_NAME || 'Brokerage');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Routes
 */
app.get('/', (req, res) => {
  res.send(`Octopol.io - ${app.get('appName')} - version: "${process.env.NODE_ENV || 'development'}"`);
});

KmailProtoLoader.init().then(() => {  
  const licenseKey = '1decaa9d320b458b8f3d3d35b8536ef9';
  const identity = '@311111111126';
  const password = 'Neddj32kc!kfds#';
  const kmailIP = 'tcp://52.175.35.113';
  const commandSocketProt = '3040';
  const dataSocketProt = '3041';
  const company = 'Octopol';
  const kmail = new KmailSDK(kmailIP, company, commandSocketProt, dataSocketProt, licenseKey, identity, password);

  kmail.emitter.on('statusUpdate', (newStatus) => {
    //kmail.subscribeToAll();
    kmail.runQuery();
  });

  kmail.emitter.on('event', (event) => {
    console.log(`received an event object - "${event}"`);
  });

  kmail.emitter.on('eventUpdate', (eventUpdate) => {
    console.log(`received an eventUpdate object - "${eventUpdate}"`);
  });

  kmail.emitter.on('line', (line) => {
    console.log(`received an line object - "${line}"`);
  });

  kmail.emitter.on('betOffer', (betOffer) => {
    console.log(`received an betOffer object - "${betOffer}"`);
  });

  const promise = kmail.connect(); 
});

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
