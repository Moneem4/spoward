import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
    name: 'post-comment',
    orderBy: {
        createdAt: 'ASC'
    }
})
export class PostComment {
    @Expose()
    @ObjectIdColumn()
    _id: string

    @Expose()
    @Column()
    userId: string

    @Expose()
    @Column()
    postId: string

    @Expose()
    @Column()
    content: string

    @Expose()
    @Column()
    createdAt: number
    @Expose()
    @Column()
    updatedAt: number

    constructor(postComment: Partial<PostComment>) {
        if (postComment) {
            Object.assign(
                this,
                plainToClass(PostComment, postComment, {
                    excludeExtraneousValues: true
                })
            )
            this._id = this._id || uuid.v1()
            this.content = this.content || ''
            this.createdAt = this.createdAt || +new Date()
            this.updatedAt = +new Date()
        }
    }
}
