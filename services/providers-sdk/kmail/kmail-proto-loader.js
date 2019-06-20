'use strict';

const _ = require('lodash');
const glob = require('glob');
const path = require('path');
const protobuf = require('protobufjs');

const models = {};

const globSearch = (template) => {
  return new Promise((resolve, reject) => {
    glob(template, (err, files) => {
      if(err) {
        reject(err);
        return;
      }

      resolve(files);
  })});
};

const init = async () => {
  const files = await globSearch(path.resolve(__kmail_basedir, 'services/providers-sdk/kmail/proto/*.proto'));
  const root = await protobuf.load(files);
  files.forEach((fp) => {
    const className = path.basename(fp, path.extname(fp));
    models[className] = root.lookup(className);
  });
};

const create = (className, data) => models[className].create(data);
const createAndEncode = (className, data) => models[className].encode(create(className,data)).finish();
const decode = (className, buffer) => {
  return models[className].decode(buffer);
};

module.exports = {
  init,
  create,
  createAndEncode,
  decode,
  models
};
