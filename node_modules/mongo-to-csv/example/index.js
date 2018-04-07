'use strict';
const mongotocsv = require('../mongotocsv');
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