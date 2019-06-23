This is an SDK to the Kmail bet API
in this API you can connect, subscribe and query the active market, line and prices.
this project is a base project for working with Kmail API and will save time connecting and running you first requests to Kmail API

**General Note**
This package track only soccer events, but can be changed to track every sport type.

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
  kmail.KmailProtoLoader.init(location).then(() => {
    //your code goes here
  });
  ```
* The `location` is the folder you keep the .proto directory Kmail had provided you. 
* `location` argument is optional and will take a default directory if not given or empty.

Keep in mind that if you your .proto folder is much different then the default one then this could be an indication this package isn't up to date and you might need to clone it and update the parts you need

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

Here is the entities list you can register to and their meaning:
| Entity Name | Proto Entity | Note
|------------|-----------------------------------|------------------------
| queryFinish | queryStatusModel | received this entity when a query is done
| region | regionModel | the region entity. countries and united nations
| league | leagueModel | the league entity. containing region id
| team | teamModel | the team entity.
| event | eventModel | the game entity. contain home team, away team, and league
| eventUpdate | eventUpdateModel | an update to the event model (goals, time, red cards)
| line | lineModel | the bet line entity. contain event id
| betOffer | priceModel | the bet entity. contain line id
| statusUpdate | N/A | received this entity when the status of the SDK changed (active, inactive)
| err | N/A | error occur in the SDK