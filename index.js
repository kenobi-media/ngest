'use strict';

let fs = require('fs');

let base = JSON.parse(fs.readFileSync(process.cwd() + '/examples/basic.json'));


// TODO fs check filetype, if dir loop through all files
//
//
//
 function addToDefinitions(refprop){
   if (base.hasOwnProperty("definitions")){
     base.definitions[refprop['title']] = refprop;
   }
 }

function changeCurrentValToDefinition(refprop){

}
function getSchema(current_key_val){

  // Check $ref attributes and parse them
  let fragment = current_key_val.substring(current_key_val.indexOf("#") + 1);
  let base_url = current_key_val.substring(0, current_key_val.indexOf("#"));

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
      let schema = JSON.parse(fs.readFileSync(process.cwd() + '/' + fragment));
      delete schema["$schema"];

      // need to add this to definitions
      addToDefinitions(schema);
      changeCurrentValToDefinition(schema);

      return {
        'new_key_value': '#/definitions/' + schema['title'],
        'new_schema': schema
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
            let res, schema= "";
            // only review $ref keys, which have a value with a hash and the value does not include a definitions as definitions are usually insitu
            if (current_key == '$ref' && current_key_val.indexOf('#') !== -1 && current_key_val.indexOf('definitions') === -1) {

                res = getSchema( current_key_val);
                if (res){
                  // Make some amends to our sub-schema
                  obj[props[key]] = res.new_key_value;
                  // Recurse on the sub-schema
                  resolveReference(res.new_schema);
                }

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
