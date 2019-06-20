'use strict';

const moment = require('moment');
const long = require('long');

const getNowDateTime = () => {
  const dateTime = moment().valueOf();

  return {
    scale: 4,
    value: long.fromInt(dateTime)
  };
}

module.exports = {
  getNowDateTime
};
