import { CacheModule, Module, HttpModule } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { Transport, ClientsModule } from '@nestjs/microservices';
// import { BullModule } from '@nestjs/bull'

import {
	CacheService,
	GraphqlService,
	TypeOrmService
	// BullConfigService
} from './config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
// import { AppProcessor } from './app.processor'
import { DateScalar } from './config/graphql/scalars/date.scalar'
import { UploadScalar } from './config/graphql/scalars/upload.scalar'

import * as Resolvers from './resolvers'

@Module({
	imports: [
		ScheduleModule.forRoot(),
		GraphQLModule.forRootAsync({
			useClass: GraphqlService
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmService
		}),
		CacheModule.registerAsync({
			useClass: CacheService
		}),
		// BullModule.registerQueueAsync({
		// 	name: 'app',
		// 	useClass: BullConfigService
		// }),
		HttpModule,
		ClientsModule.register([
			{ 
			  name: 'POST_SERVICE', transport: Transport.RMQ,
			  options: {
				urls: ['amqp://admin:password@127.0.0.1:5672/test'],
				queue: 'spoward',
				noAck: false,
				queueOptions: {
					durable: false
					  },
				},
			 },
		   ]),
	],
	controllers: [AppController],
	providers: [
		DateScalar,
		UploadScalar,
		...Object.values(Resolvers),
		AppService
		// AppProcessor
	]
})
export class AppModule {}
