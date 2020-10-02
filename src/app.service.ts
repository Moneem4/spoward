import { Injectable, Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { map } from "rxjs/operators";

@Injectable()
export class AppService {
	//private connection;
	constructor(
		@Inject("POST_SERVICE") private readonly postService: ClientProxy
	) { }


	async pingPostService() {
		try {
				const startTs = Date.now();
				const pattern = "ping" ;
				const payload = {};
				Logger.log("pinging post microservice")
				this.postService
					.send<string>(pattern, payload)
					.pipe(
						map((message: string) => ({ message, duration: Date.now() - startTs }))
					);
			
		}catch (error) {
			console.log(error)
		}

	}
}