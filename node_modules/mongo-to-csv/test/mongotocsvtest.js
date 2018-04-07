'use strict';
const 
assert 		= require('assert'),
mongotocsv 	= require('../mongotocsv');
let options = {
	database: 'users', // required
	collection: 'pets', // required
	fields: ['name','cost'], // required
	output: './output/pets.csv', // required
	allValidOptions: '-q \'{ "name": "cat" }\'' // optional
};


describe('mongotocsv', function(){

	it('it should fails without options and callback', function(done){
		try {
			mongotocsv.export();	
		} catch (err){
			done();
		}
	});

	it('it should fails with options and without callback', function(done){
		
		try {
			mongotocsv.export(options);	
		} catch (err){
			done();
		}	
		
	});

	it('it should fails with empty options object', function(done){
		try {
			mongotocsv.export({});	
		} catch (err){
			done();
		}
	});

	it('it should fails with incomplete options object without collection name', function(done){
		mongotocsv.export({database: 'test'}, function (err, result) {
			assert.deepEqual(err, 'collection name is required');
			assert.deepEqual(result, null);
			done()
		});
	});

	it('it should fails with incomplete options object without database name', function(done){
		mongotocsv.export({collection: 'test'}, function (err, result) {
			assert.deepEqual(err, 'database name is required');
			assert.deepEqual(result, null);
			done()
		});
	});

	it('it should fails with incomplete options object without fields name', function(done){
		mongotocsv.export({database: 'test', collection: 'test'}, function (err, result) {
			assert.deepEqual(err, 'fields name is required');
			assert.deepEqual(result, null);
			done()
		});
	});

	it('it should fails with incomplete options object without output path', function(done){
		mongotocsv.export({database: 'test', collection: 'test', fields: ['name']}, function (err, result) {
			assert.deepEqual(err, 'output filepath is required and must be absolute');
			assert.deepEqual(result, null);
			done()
		});
	});

	it('it should fails if fields have wrong datatype', function(done){
		mongotocsv.export({database: 'test', collection: 'test', fields: 'name'}, function (err, result) {
			assert.deepEqual(err, 'fields name must be array type');
			assert.deepEqual(result, null);
			done()
		});
	});

	it('it should fails if collection name is not string', function(done){
		mongotocsv.export({database: 'test', collection: 20, fields: 'name'}, function (err, result) {
			assert.deepEqual(err, 'collection name must be string type');
			assert.deepEqual(result, null);
			done()
		});
	});

	it('it should fails if database name is not string', function(done){
		mongotocsv.export({database: 20, collection: 'test', fields: 'name'}, function (err, result) {
			assert.deepEqual(err, 'database name must be string type');
			assert.deepEqual(result, null);
			done()
		});
	});

	it('it should fails if output path is not string', function(done){
		mongotocsv.export({database: 'test', collection: 'test', fields: ['name'], output: 12}, function (err, result) {
			assert.deepEqual(err, 'output filepath must be sting and absolute');
			assert.deepEqual(result, null);
			done()
		});
	});

	// it('it should pass with all the required options', function(done){
	// 	mongotocsv.export(options, function (err, result) {
	// 		assert.deepEqual(err, null);
	// 		done()
	// 	});
	// });

});