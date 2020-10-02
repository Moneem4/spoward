import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'

import { PostLike } from '@models'
import { CreatePostLikeInput } from '../generator/graphql.schema'
import { Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Resolver('PostLike')
export class PostLikeResolver {
    constructor(
        @Inject('POST_SERVICE') private readonly postService: ClientProxy
    ) {}
    @Query()
    async postLikes(): Promise<PostLike[]> {
        Logger.log(`function:postLikes`);
        
        const data = await this.postService.send<any>( 'getMbPostLikes', {}).toPromise();
        return data;
    }

    @Mutation(() => PostLike)
    async createPostLike(
        @Args('input') input: CreatePostLikeInput
    ): Promise<PostLike> {
        const messageData = {
            userId : input.userId,
            mbPostId : input.postId,
        }
        const data = await this.postService.send('createMbPostLikes', messageData).toPromise();
        return data;
    }

    @Mutation()
	async deletePostLike(@Args('_id') _id: string): Promise<boolean> {
        const data = await this.postService.send('deleteMbPostComment', _id).toPromise();
        return data
    }

    @Mutation()
	async deletePostLikes(@Args('postId') postId: String): Promise<boolean> {
        const data = await this.postService.send('deleteMbPostLikes', postId).toPromise();
        return data
    }

    @Mutation()
    async deleteUserLikes(@Args('userId')userId: String): Promise<Boolean> {
        const data = await this.postService.send('deleteUserMbPostLikes', userId).toPromise();
        return data
    }
}