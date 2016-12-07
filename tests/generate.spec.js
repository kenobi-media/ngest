'use strict'
let fs = require('fs');
let handler = require(process.cwd() + '/index.js');

describe('Test generate schema', function () {

    it('has base exporters', function () {
        expect(handler).toBeDefined();
    });

    it('can generate stuff', function (done) {
        let dest = process.cwd() + '/examples/results.json';
        let source = process.cwd() + '/examples/basic.json';
        handler(source, dest);
        fs.stat(dest, function (err, stats) {
            expect(stats).toBeDefined();
            done();

        });
    })

    it('makes definitions', function () {
        let file = process.cwd() + '/examples/results.json';
        let o = JSON.parse(fs.readFileSync(file));
        expect(o['$schema']).toBeDefined();
        expect(o.properties.uuid).toBeDefined();
        expect(o.properties.another_uuid).toBeDefined();
    })
})