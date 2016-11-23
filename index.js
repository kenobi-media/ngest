'use strict';

let fs = require('fs');

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
            obj[current_key] = resolveReference(current_key_val);
        } else {
            let base_url, fragment, fetch_url, schema = "";
            // only review $ref keys, which have a value with a hash and the value does not include a definitions as definitions are usually insitu
            if (current_key == '$ref' && current_key_val.indexOf('#') !== -1 && current_key_val.indexOf('definitions') === -1) {
                // Check $ref attributes and parse them
                fragment = current_key_val.substring(current_key_val.indexOf("#") + 1);
                base_url = current_key_val.substring(0, current_key_val.indexOf("#"));

                // if (typeof base_url != 'undefined') {
                //       if (typeof fragment != 'undefined') {
                //         fetch_url = base_url + '/' + fragment;
                //         // Go fetch URL
                //       }
                //       else {
                //         // Fetch base URL
                //       }
                // }

                if (typeof fragment != 'undefined') {
                    // Fetch from file system
                    console.log('Using schema specified in fragment');
                    schema = JSON.parse(fs.readFileSync(process.cwd() + '/' + fragment));
                }

                // Make some amends to our sub-schema
                delete schema["$schema"];

                // Recurse on the sub-schema
                return resolveReference(schema);
            }

        }

    }

    return obj;
}

function getSourceData(path) {
    return JSON.parse(fs.readFileSync(path));
}

function writeOut(data, path) {
    fs.writeFile(path, data, function(error) {
        if (error) {
            console.error("write error:  " + error.message);
        } else {
            console.log("Successful Write to " + path);
        }
    });
}

function generate(source, destination) {
    let base, data;

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

module.exports =  generate;
