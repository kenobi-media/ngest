'use strict';

let fs = require('fs');
let base, data;

function addToDefinitions(refprop) {

    let title = refprop['title'];
    // remove the title
    delete refprop.title;

    if (base.hasOwnProperty("definitions")) {
        console.log(title);

        base.definitions[title] = refprop;
    } else {

        let defs = 'definitions';
        //  let prop = title;
        base[defs] = { [title]: refprop };
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
        }
        else {
            // Fetch base URL
        }
    }
}

/**
 * Extracts schema fragment
 */
function getSchema(current_key_val) {

    // Check $ref attributes and parse them
    let fragment = current_key_val.substring(current_key_val.indexOf("#") + 1);
    let base_url = current_key_val.substring(0, current_key_val.indexOf("#"));

    //   getRemoteUrl();

    if (typeof fragment !== 'undefined') {
        // Fetch from file system
        console.log('Using schema specified in fragment ' + fragment);
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
            if (current_key == '$ref' && current_key_val.indexOf('#') !== -1 && current_key_val.indexOf('definitions') === -1) {

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

function getSourceData(path) {
    return JSON.parse(fs.readFileSync(path));
}

function writeOut(data, path) {
    fs.writeFile(path, data, function (error) {
        if (error) {
            console.error("write error:  " + error.message);
        } else {
            console.log("Successful Write to " + path);
        }
    });
}

function generate(source, destination) {

    // let origin = source;
    let path = destination;
    base = getSourceData(source);
    if (typeof base !== 'undefined') {
        data = JSON.stringify(resolveReference(base));
        if (typeof data !== 'undefined') {
            writeOut(data, path);
        } else {
            throw new Error('me nah know');
        }
    }
}

module.exports = generate;
