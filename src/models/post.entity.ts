import {
	Entity,
	ObjectIdColumn,
	Column,
} from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'
import * as uuid from 'uuid'
import {
    PostType,
    PostLike,
    PostAccess,
    PostComment
} from '../generator/graphql.schema'

@Entity({
	name: 'post',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Post {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
    userId: string
    
    @Expose()
	@Column()
	postType: PostType

	@Expose()
	@Column()
    title: String
    
    @Expose()
    @Column()
    likes: PostLike[]

    @Expose()
    @Column()
    accesses: PostAccess[]

    @Expose()
    @Column()
    comments: PostComment[]

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(post: Partial<Post>) {
		if (post) {
			Object.assign(
				this,
				plainToClass(Post, post, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
            this.userId = this.userId || ''
			this.postType = this.postType || undefined
			this.title = this.title || ''
			this.accesses = this.accesses || []
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
