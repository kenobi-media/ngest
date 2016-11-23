# ngest

 [![CircleCI](https://circleci.com/gh/kenobi-media/ngest/tree/master.svg?style=shield)](https://circleci.com/gh/kenobi-media/ngest/tree/master) [![Build Status](https://travis-ci.org/kenobi-media/ngest.svg?branch=master)](https://travis-ci.org/kenobi-media/ngest)
> Ingests multiple JSON schemas into one schema, by resolving $ref property data. Will ingest absolute  and relative references

## What is it for?

You know those times when you have loads of json schema and sub-schema that you need to use but don't want to or can't have them on an open network location, well this script allows you to download or ingest them and produce one composite schema, that you can put in that secure location.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i ngest --save-dev
```

## Usage

```js
var ngest = require('ngest');
ngest(source, destination);
```

Both the source and destination are file locations currently. The script will only ready from a local file system.

## Roadmap

- Accept remote locations for source and destination
- Download schemas from http locations
- Return composite schema instead of writing to a file

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/kenobi-media/ngest/issues)

## Authors

**Morlene Fisher**

* [github/morlenefisher](https://github.com/morlenefisher)
* [twitter/morlenefisher](http://twitter.com/morlenefisher)


**David Toth**

* [github/dvdtoth](https://github.com/dvdtoth)
* [twitter/dvdtoth](http://twitter.com/dvdtoth)

## License

Copyright © 2016 [Kenobi Media Ltd]()
Licensed under the MIT license.
