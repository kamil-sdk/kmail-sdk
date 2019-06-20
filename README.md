This is an SDK to the Kmail bet API
in this API you can connect, subscribe and query the active market, line and prices.
this project is a base project for working with Kmail API and will save time connecting and running you first requests to Kmail API

Contents
--------
* [Installation](#installation)<br />
  How to include kmail-sdk in your project.

* [Setup](#setup)<br />
  How to initiate kmail-sdk.

* [Usage](#usage)<br />
  A brief introduction to using the kmail-sdk.

Installation
---------------
```
$> npm install kmail-sdk [--save]
```

Setup
---------------
To initiate the package you'll need to run in init function to compile the .proto files:
```js
  const kmail = require('kmail-sdk');
  kmail.KmailProtoLoader.init().then(() => {
    //your code goes here
  });
  ```

Usage
---------------
In order use the SDK you need to take the kmailSDK and use it as follows:
```js
const Kmail = require('kmail-sdk');
Kmail.KmailProtoLoader.init().then(() => {  
  const licenseKey = 'zzz';
  const identity = 'xxx';
  const password = 'yyy';
  const kmailIP = 'tcp://1.0.0.127';
  const commandSocketProt = '1';
  const dataSocketProt = '2';
  const company = 'yourIdentity';
  // Creating the sdk object (you don't need more then 1)
  const kmail = new Kmail.KmailSDK(kmailIP, company, commandSocketProt, dataSocketProt, licenseKey, identity, password);

  kmail.emitter.on('statusUpdate', (newStatus) => {
    // Subscribe to all events coming from molly. in order to filter the needed object use the emitter and subscribe to the 
    // needed events
    kmail.subscribeToAll();
  });

  kmail.emitter.on('event', (event) => {
    console.log(`received an event object - "${event}"`);
  });

  kmail.connect(); 
});
```