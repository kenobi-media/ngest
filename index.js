'use strict';

let fs = require('fs');

let base = JSON.parse(fs.readFileSync(process.cwd() + '/examples/basic.json'));


// TODO fs check filetype, if dir loop through all files
//

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
            let base_url, fragment, fetch_url, schema= "";
            if (current_key == '$ref' && current_key_val.indexOf('#') !== -1) {
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


let newjson = JSON.stringify(resolveReference(base));
let path = process.cwd() + '/test.json';

fs.writeFile(path, newjson, function(error) {
    if (error) {
        console.error("write error:  " + error.message);
    } else {
        console.log("Successful Write to " + path);
    }
});
