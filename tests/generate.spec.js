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

     it('can generate samples', function (done) {
        let sample = process.cwd() + '/examples/sample.json';
        let dest = process.cwd() + '/examples/results.json';
        let source = process.cwd() + '/examples/basic.json';
        handler(source, dest, sample);
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

describe('Test negatives', () => {

    it('handles no data source', () =>{
       let sample = process.cwd() + '/examples/sample.json';
        let dest = process.cwd() + '/examples/results.json';
        let source = '';
        expect( () => {
             handler(source, dest, sample);
        }).toThrow('There is no source file');
        
    })
    
    it('handles empty source', () =>{
       let sample = process.cwd() + '/examples/sample.json';
        let dest = process.cwd() + '/examples/results.json';
        let source = process.cwd() + '/examples/basic_empty.json';
        expect( () => {
             handler(source, dest, sample);
        }).toThrow('me nah know');
        
    })
    
    it('handles no destination', () =>{
       let sample = process.cwd() + '/examples/sample.json';
        let dest = '';
        let source = process.cwd() + '/examples/basic.json';
        expect( () => {
             handler(source, dest, sample);
        }).toThrow('Please specify a destination path');
        
    })
})