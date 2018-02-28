'use strict';

const fs = require('fs');
const path = require('path')
let base, data;

/**
 *
 *
 * @param {any} refprop
 */
function addToDefinitions(refprop) {

  let title = refprop['title'];
  // remove the title
  delete refprop.title;

  if (base.hasOwnProperty("definitions")) {
    base.definitions[title] = refprop;
  } else {

    let defs = 'definitions';
    base[defs] = {
      [title]: refprop
    };
  }
}

/**
 *
 */
function getRemoteUrl() {
  if (typeof base_url != 'undefined') {
    if (typeof fragment != 'undefined') {
      fetch_url = base_url + '/' + fragment;
      // Go fetch URL
    } else {
      // Fetch base URL
    }
  }
}

/**
 * Extracts schema fragment
 *
 *
 * @param {string} current_key_val
 * @returns
 */
function getSchema(current_key_val) {

  // Check $ref attributes and parse them
  let fragment = current_key_val.substring(current_key_val.indexOf("#") + 1);
  let base_url = current_key_val.substring(0, current_key_val.indexOf("#"));

  //   getRemoteUrl();

  if (typeof fragment !== 'undefined') {
    // Fetch from file system
    // console.log('Using schema specified in fragment ' + fragment);
    let schema = JSON.parse(fs.readFileSync(process.cwd() + '/' + fragment));

    // we don't need the $schema property when represented in the definitions'
    delete schema["$schema"];

    // at this time neither the id
    delete schema["id"];
    let definition_title = '#/definitions/' + schema['title'];

    // need to add this to definitions
    addToDefinitions(schema);
    return {
      'new_key_value': definition_title,
      'new_schema': schema.properties
    }
  }
}


/**
 * Resolves the references contained within an object
 *
 * @param {object} obj
 * @returns
 */
function resolveReference(obj) {

  if (typeof obj == 'undefined') {
    return;
  }

  let props = Object.keys(obj);

  for (let key in props) {

    let current_key = props[key];
    let current_key_val = obj[props[key]];

    if (typeof current_key_val == 'object') {
      // Recurse on any child objects
      // obj[current_key] = resolveReference(current_key_val);
      resolveReference(current_key_val);
    } else {
      let res, schema = "";
      // only review $ref keys, which have a value with a hash and the value does not include a definitions as definitions are usually insitu
      if (current_key == '$ref' && current_key_val.indexOf('definitions') === -1) {

        res = getSchema(current_key_val);
        if (res) {
          // Make some amends to our sub-schema
          obj[props[key]] = res.new_key_value;

          // Rec    urse on the sub-schema
          resolveReference(res.new_schema);
        }
      }
    }
  }

  return obj;
}


/**
 * Reads source path
 *
 * @param {string} source
 * @returns
 */
function getSourceData(source) {
  return new Promise((resolve, reject) => {
    fs.readFile(source, (err, data) => {
      if (err) return reject(err)
      return resolve(JSON.parse(data));
    })
  })
}


/**
 *
 *
 * @param {any} data
 * @param {any} destination
 */
function writeOut(data, destination) {

  return new Promise((resolve, reject) => {
    let dir = path.dirname(destination)

    fs.mkdir(dir, (err) => {
      if (err && err.code != 'EEXIST') return reject(err); // ignore the error if the folder already exists
    });

    fs.writeFile(destination, data, (error) => {
      if (error) {
        reject(new Error("write error:  " + error.message));
      } else {
        resolve(true);
      }
    })
  })
}



/**
 * Generate the ingested schema
 *
 * @param {string} source
 * @param {string} destination
 * @param {string} sample
 */
function generate(source, destination) {

  return new Promise((resolve, reject) => {

    // let path = destination;
    if (!source) {
      return reject(new Error('There is no source file'));
    }

    if (!destination) {
      return reject(new Error('Please specify a destination path'));
    }

    getSourceData(source)
      .then(res => {
        base = res;
        return base;
      })
      .then(res => {
        data = JSON.stringify(resolveReference(base));
        return data;
      })
      .then(res => {
        if (typeof res !== 'undefined') {
          resolve(writeOut(data, destination));
        } else {
          return reject(new Error('Nothing resolved from references'))
        }
      })
      .catch(err => {
        reject(err);
      })
  })
}


module.exports = generate;