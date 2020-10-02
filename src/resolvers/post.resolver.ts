import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Post } from '@models'
import { CreatePostInput, User, UpdatePostInput } from '../generator/graphql.schema'
import { Logger, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Resolver('Post')
export class PostResolver {
    constructor(
        @Inject('POST_SERVICE') private readonly postService: ClientProxy 
    ) {}
    
    @Query(() => [Post])
    async posts(): Promise<Post[]> {
        Logger.log(`function:getMbPost`);
        
        const data = await this.postService.send<any>( 'getMbPosts', {}).toPromise();
        return data;

    }

    @Query(() => Post)
    async post(@Args('_id') _id: string): Promise<Post> {
        Logger.log(`function:postAccess`);
        
        const data = await this.postService.send<any>( 'getMbPostById', _id).toPromise();
        return data;
    }

    @Mutation(() => Post)
    async createPost(
        @Args('input') input: CreatePostInput,
    ): Promise<Post> {
        Logger.log(`function:createPost`);
        const messageData = {
            userId : input.userId,
            mbPostType : input.postType,
            mbPostTitle : input.title,
            mbPostContent : input.content
        }
        const data = await this.postService.send<any>( 'createMbPost', messageData).toPromise();
        return data;
    }

    async updatePost(
        @Args('_id') _id: string,
        @Args('input') input: UpdatePostInput
    ): Promise<boolean> {
        const messageData = {
            _id : _id,
            mbPostType : input.postType,
            mbPostContent: input.content,
            mbPostTitle: input.title
        }
        const data = await this.postService.send('updateMbPost', messageData).toPromise();
        return data;
    }

}