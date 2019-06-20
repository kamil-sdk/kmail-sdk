'use strict';

const crypto = require('crypto');
const _ = require('lodash');
const long = require('long');

const reorderBytesB2L = (array) => {
  const newArray = [];
  newArray[0] = array[6];
  newArray[1] = array[7];
  newArray[2] = array[4];
  newArray[3] = array[5];
  newArray[4] = array[0];
  newArray[5] = array[1];
  newArray[6] = array[2];
  newArray[7] = array[3];
  return newArray;
};

const UUID = (data) => {
  const rtVal = {
    lo: 0,
    hi: 0
  }

  if (data.length !== 16) {
    return null;
  }
  const dataMsb = data.slice(0,8);
  const dataLsb = data.slice(8,16);

  const reorderedMsb = long.fromBytes(reorderBytesB2L(dataMsb));
  const reversedLsb = long.fromBytes(dataLsb.reverse());
  rtVal.hi = reversedLsb;
  rtVal.lo = reorderedMsb;
  return rtVal;
};

const randomUUID = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, randomBytes) => {
      if (err) {
        reject(err);
        return;
      }
      randomBytes[6]  &= 0x0f;  /* clear version        */
      randomBytes[6]  |= 0x40;  /* set to version 4     */
      randomBytes[8]  &= 0x3f;  /* clear variant        */
      randomBytes[8]  |= 0x80;  /* set to IETF variant  */
      resolve(UUID(randomBytes));
    });
  });
};

module.exports = {
  randomUUID
};
