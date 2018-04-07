# mongo-to-csv [![Build Status](https://travis-ci.org/yasharma/mongo-to-csv.svg?branch=master)](https://travis-ci.org/yasharma/mongo-to-csv)
Export the mongodb collection to csv using mongoexport and nodejs

## Usage
```bash
1. $ npm install mongo-to-csv --save
```
```javascript
'use strict';
const mongotocsv = require('mongo-to-csv');
let options = {
	database: 'users', // required
	collection: 'pets', // required
	fields: ['name','cost'], // required
	output: './output/pets.csv', // required
	allValidOptions: '-q \'{ "name": "cat" }\'' // optional
};
mongotocsv.export(options, function (err, success) {
	console.log(err);
	console.log(success);
});
```
This libaray uses the [`mongoexport`](https://docs.mongodb.com/manual/reference/program/mongoexport/)command provided by mongodb and execute command through nodejs [`child_process`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)

#### you can pass all the available options of mongoexport command here through `allValidOptions` property.

### Run test
1. clone the repo
```bash 
$ git cone https://github.com/yasharma/mongo-to-csv.git
```

2. `cd mongo-to-csv`

3. `npm install`

4. `npm test`