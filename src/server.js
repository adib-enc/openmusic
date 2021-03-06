// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

// notes
// const notes = require('./api/notes');
// const NotesService = require('./services/postgres/NotesService');
// const NotesValidator = require('./validator/notes');

const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumService');
const { AlbumPayloadSchema } = require('./validator/schemas');
const Validator = require('./validator/base-validator');

const init = async () => {
	// const notesService = new NotesService();
	const albumService = new AlbumService();

	const server = Hapi.server({
		port: process.env.PORT || 3000,
		host: process.env.HOST,
		routes: {
			cors: {
				origin: ['*'],
			},
		},
	});

	// registrasi plugin eksternal
	await server.register([
		{
			plugin: Jwt,
		},
		{
			plugin: Inert,
		},
	]);

	// await server.register([
	// 	{
	// 		plugin: notes,
	// 		options: {
	// 			service: notesService,
	// 			validator: NotesValidator,
	// 		},
	// 	},
	// ]);
	
	await server.register([
		{
			plugin: albums,
			options: {
				service: albumService,
				schema: AlbumPayloadSchema,
				validator: Validator
			},
		},
	]);

	await server.start();
	console.log(`Run @ ${server.info.uri}`);
};

init();
