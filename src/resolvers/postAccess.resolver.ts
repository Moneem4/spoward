import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'

import { PostAccess } from '@models'
import { CreatePostAccessInput, UpdatePostAccessInput } from '../generator/graphql.schema'
import { ClientProxy } from '@nestjs/microservices'
import { Inject, Logger } from '@nestjs/common'

@Resolver('PostAccess')
export class PostAccessResolver {
    constructor(
        @Inject('POST_SERVICE') private readonly postService: ClientProxy 
    ) {}

    @Query()
    async postAccess(@Args('postId') postId: string) {
        Logger.log(`function:postAccess, input: ${postId}`);
        
        const data = await this.postService.send<any>( 'getMbPostAccesses', postId).toPromise();
        console.log(`data : ${data}`);
        return data;
    }

    @Mutation(() => PostAccess)
    async createPostAccess(
        @Args('input') input: CreatePostAccessInput
    ): Promise<PostAccess> {
        Logger.log(input);
        const messageData = {
            userId : input.userId,
            mbPostId : input.postId,
            mbPostAccessType : input.type,
        }
        const data = await this.postService.send('createMbPostAccess', messageData).toPromise();
        Logger.log(`function:createPostAccess, res: ${data}`);
        return data;
    }

    @Mutation(() => PostAccess)
    async updatePostAccess(
        @Args('_id') _id: string,
        @Args('input') input: UpdatePostAccessInput
    ): Promise<PostAccess> {
        const messageData = {
            _id : _id,
            mbPostAccessType : input.type,
        }
        const data = await this.postService.send('updateMbPostAccess', messageData).toPromise();
        return data;
    }

    @Mutation()
	async deletePostAccess(@Args('_id') _id: string): Promise<boolean> {
        const data = await this.postService.send('deletePostAccess', _id).toPromise();
        return data
    }

    @Mutation()
	async deletePostAccesss(@Args('postId') postId: String): Promise<boolean> {
        const data = await this.postService.send('deletePostAccesss', postId).toPromise();
        return data;
    }

    @Mutation()
    async deleteUserPostAccesss(@Args('userId')userId: String): Promise<Boolean> {
        const data = await this.postService.send('deleteUserPostAccesss', userId).toPromise();
        return data;
    }
}