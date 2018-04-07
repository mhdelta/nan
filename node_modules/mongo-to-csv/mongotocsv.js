'use strict';
const exec = require('child_process').exec;


/*
mongoexport --db users --collection contacts --type=csv --fieldFile fields.txt --out /opt/backups/contacts.csv
required options are
{
	database: 'test',
	collection: 'users',
	fields: array,
	output: absolute path for output file
}
*/
function mongotocsv(options, callback) {
	if ( typeof(options) === null || typeof(options) === 'undefined' || !Object.keys(options).length){
		throw new Error('options are required, check the required options for mongotocsv');
		return;
	}
	
	if ( typeof(callback) === null || typeof(callback) === 'undefined' ){
		throw new Error('callback is required');
		return
	}

	// validate the options
	if( !options.hasOwnProperty('database') ){
		return callback('database name is required',null);
	} else if( typeof(options.database) !== 'string' ){
		return callback('database name must be string type',null);
	}

	if( !options.hasOwnProperty('collection') ){
		return callback('collection name is required',null);
	} else if( typeof(options.collection) !== 'string' ){
		return callback('collection name must be string type',null);
	}

	if( !options.hasOwnProperty('fields') ){
		return callback('fields name is required',null);
	} else if( typeof(options.fields) !== 'object' ){
		return callback('fields name must be array type',null);
	}

	if( !options.hasOwnProperty('output') ){
		return callback('output filepath is required and must be absolute',null);
	} else if( typeof(options.output) !== 'string' ){
		return callback('output filepath must be sting and absolute',null);
	}

	let arr = ['mongoexport', '--type=csv'],
	db 		= `-d ${options.database}`,
	coll 	= `-c ${options.collection}`,
	fields 	= `-f ${options.fields.join(',')}`,
	out 	= `-o ${options.output}`;
	if( options.hasOwnProperty('allValidOptions') ){
		arr.push(options.allValidOptions);
	}
	arr.push(db, coll, fields, out);
	let cmd = arr.join(" ");
	
	exec(cmd, (error, stdout, stderr) => {
		callback(error, stdout || stderr);  
	});
}

module.exports.export = mongotocsv;