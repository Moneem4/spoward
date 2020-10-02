import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { ForbiddenError } from 'apollo-server-core'

import { PostComment } from '@models'
import { CreatePostCommentInput, UpdatePostCommentInput } from '../generator/graphql.schema'
import { Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Resolver('PostComment')
export class PostCommentResolver {
    constructor(
        @Inject('POST_SERVICE') private readonly postService: ClientProxy
    ) {}
    @Query()
    async postComments(): Promise<PostComment[]> {
        
        Logger.log(`function:postComments`);
        
        const data = await this.postService.send<any>( 'getMbPostComments', {}).toPromise();
        return data;

    }

    @Mutation(() => PostComment)
    async createPostComment(
        @Args('input') input: CreatePostCommentInput
    ): Promise<PostComment> {
        const messageData = {
            userId : input.userId,
            mbPostId : input.postId,
            mbPostContent : input.content,
        }
        const data = await this.postService.send('createMbPostComments', messageData).toPromise();
        return data;
    }

    @Mutation(() => PostComment)
    async updatePostComment(
        @Args('_id') _id: string,
        @Args('input') input: UpdatePostCommentInput
    ): Promise<PostComment> {
        const messageData = {
            _id : _id,
            mbPostContent : input.content,
        }
        const data = await this.postService.send('updateMbPostComment', messageData).toPromise();
        return data;
    }

    @Mutation()
	async deletePostComment(@Args('_id') _id: string): Promise<boolean> {
        const data = await this.postService.send('deleteMbPostComment', _id).toPromise();
        return data
    }

    @Mutation()
	async deletePostComments(@Args('postId') postId: String): Promise<boolean> {
        const data = await this.postService.send('deleteMbPostComments', postId).toPromise();
        return data
    }

    @Mutation()
    async deleteUserPostComments(@Args('userId')userId: String): Promise<Boolean> {
        const data = await this.postService.send('deleteUserMbPostComments', userId).toPromise();
        return data
    }
}