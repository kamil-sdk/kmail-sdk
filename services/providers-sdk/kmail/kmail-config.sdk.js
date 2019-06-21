'use strict';

exports.LicenseKey = '1decaa9d320b458b8f3d3d35b8536ef9';
exports.Identity = '@311111111126';
exports.Password = 'Neddj32kc!kfds#';
exports.kmailIP = 'tcp://52.175.35.113';
exports.commandSocketProt = '3040';
exports.dataSocketProt = '3041';

// Constants of commands names
exports.connectCommand = 'ApiConnectCommand';
exports.commandStatus = 'ApiCommandStatus';
exports.keepAlive = 'KeepAlive';
exports.subscriptionStatus = 'SubscriptionStatus';
exports.subscribeCommand = 'ApiSubscribeCommand';
exports.queryCommand = 'ApiQueryCommand';
exports.queryStatusModel = 'ApiQueryStatusModel';
exports.regionModel = 'ApiRegionModel';
exports.leagueModel = 'ApiLeagueModel';
exports.teamModel = 'ApiTeamModel';
exports.eventModel = 'ApiEventModel';
exports.eventUpdateModel = 'ApiEventUpdateModel';
exports.lineModel = 'ApiLineModel';
exports.priceModel = 'ApiLinePriceModel';

// Commands convert table
const commandsConvertTable = {};
commandsConvertTable[exports.connectCommand] = {
  id: 4000
};
commandsConvertTable[exports.commandStatus] = {
  id: 4030
};
commandsConvertTable[exports.subscribeCommand] = {
  id: 4003
};
commandsConvertTable[exports.queryCommand] = {
  id: 4002
};
commandsConvertTable[exports.queryStatusModel] = {
  id: 4100,
  emittedName: 'queryFinish'
};
commandsConvertTable[exports.keepAlive] = {
  id: -10,
  isEmpty: true
};
commandsConvertTable[exports.subscriptionStatus] = {
  id: -12
};
commandsConvertTable[exports.regionModel] = {
  id: 4110,
  emittedName: 'region'
};
commandsConvertTable[exports.leagueModel] = {
	id: 4111,
  emittedName: 'league'
};
commandsConvertTable[exports.teamModel] = {
	id: 4112,
  emittedName: 'team'
};
commandsConvertTable[exports.eventModel] = {
	id: 4113,
  emittedName: 'event'
};
commandsConvertTable[exports.eventUpdateModel] = {
	id: 4114,
  emittedName: 'eventUpdate'
};
commandsConvertTable[exports.lineModel] = {
	id: 4115,
  emittedName: 'line'
};
commandsConvertTable[exports.priceModel] = {
	id: 4116,
  emittedName: 'betOffer'
};

exports.commandsConvertTable = commandsConvertTable;

// Constants part end

exports.commandSocketIdentity = 'Octopol_Command';
exports.dataSocketIdentity = 'Octopol_Data';
