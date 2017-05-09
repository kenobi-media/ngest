'use strict'
jasmine.getEnv().addReporter(require('./support/reporter'));

let fs = require('fs');
let handler = require(process.cwd() + '/index.js');

describe('Test generate schema', function () {

  it('has base exporters', function () {
    expect(handler).toBeDefined();
  });

  it('can generate stuff', done => {
    let dest = process.cwd() + '/examples/results.json';
    let source = process.cwd() + '/examples/basic.json';
    handler(source, dest)
      .then(res => {
        expect(res).toBeDefined();
        done();
      })
      .catch(err => {
        expect(err).toBeUndefined();
        done();
      })
    
  })

  it('makes definitions', function () {

    let o = JSON.parse(fs.readFileSync(process.cwd() + '/examples/results.json'));

    // console.log(o)
    expect(o['$schema']).toBeDefined();
    expect(o.properties.uuid).toBeDefined();
    expect(o.properties.another_uuid).toBeDefined();
  })
})

describe('Test negatives', () => {

  it('handles no data source', done => {
    let sample = process.cwd() + '/examples/sample.json';
    let dest = process.cwd() + '/examples/results.json';
    let source = '';

    handler(source, dest, sample)
      .catch(err => {
        expect(err).toBeDefined()
        expect(err).toMatch('There is no source file')
        done()
      })

  })

  it('handles empty source', done => {
    let sample = process.cwd() + '/examples/sample.json';
    let dest = process.cwd() + '/examples/results.json';
    let source = process.cwd() + '/examples/basic_empty.json';
    handler(source, dest, sample)
      .catch(err => {
        expect(err).toBeDefined()
        done()
      })
  })

  it('handles no destination', done => {
    let sample = process.cwd() + '/examples/sample.json';
    let dest = '';
    let source = process.cwd() + '/examples/basic.json';
    handler(source, dest, sample)
      .catch(err => {
        expect(err).toBeDefined()
        expect(err).toMatch('Please specify a destination path')
        done()
      })

  })
})