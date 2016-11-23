'use strict'
let fs = require('fs');
let handler = require(process.cwd() + '/index.js');

describe('Test generate schema', function() {

    it('has base exporters', function() {
        expect(handler).toBeDefined();
    });

    it('can generate stuff', function() {
        let dest = process.cwd() + '/examples/results.json';
        let source = process.cwd() + '/examples/uuid.json';
        handler(source, dest);
        let stats = fs.statSync(dest)
        expect(stats).toBeDefined();
    })
})
