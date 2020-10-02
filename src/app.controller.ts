import {
	Controller,
	Get,
	Param,
	Res,
	Post,
	Inject,
	CACHE_MANAGER,
	UseInterceptors,
	CacheInterceptor,
	Logger
} from '@nestjs/common'

import { STATIC } from 'environments'
import { AppService } from 'app.service'
import { error } from 'console'
import { ClientProxy } from '@nestjs/microservices'

@Controller()
export class AppController {
	counter = 0
	constructor(
		private readonly appService: AppService,
		@Inject('POST_SERVICE') private readonly postService: ClientProxy,
		@Inject(CACHE_MANAGER) private cacheManager

	) { }
	async onApplicationBootstrap() {
		await this.postService.connect();
		this.postService.emit<any>('message_printed', {text:'Hello World'});
	  }
	
	@Get(`${STATIC!}/:fileId`)
	getUpload(@Param('fileId') fileId, @Res() res): any {
		return res.sendFile(fileId, {
			root: STATIC!
		})
	}

	@Post('/gitlab')
	postGitlab(@Res() res): any {
		return res.body
	}

	@Get('cache')
	@UseInterceptors(CacheInterceptor)
	incrementCounter() {
		this.counter++
		return this.counter
	}

	@Get('nocache')
	incrementCounterNoCache() {
		this.counter++
		return this.counter
	}

	// Call this endpoint to reset the cache for the route '/'
	@Get('reset')
	resetCache() {
		Logger.log('pinging post service');
		return this.appService.pingPostService();
	}

	@Get('testPostMicroservice')
	testPostMicroservice() {
		Logger.log('pinging post service');
		return this.appService.pingPostService();
	}


	// @Get('transcode')
	// async transcode() {
	// 	await this.appQueue.add('transcode', {
	// 		file: 'audio.mp3'
	// 	})
	// }
}
