import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

const main = async () => {
	const orm = await MikroORM.init(microConfig);
	await orm.getMigrator().up();

	//initialise express server
	const app = express();

	//Apollo server for graphql endpoints
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [PostResolver, UserResolver],
			validate: false,
		}),
		context: () => ({ em: orm.em.fork() }),
	});

	//start apolloserver
	apolloServer.applyMiddleware({ app });

	//Listening port
	app.listen(4000, () => {
		console.log('server started on localhost:4000');
	});
};

main().catch((err) => {
	console.error(err);
});
