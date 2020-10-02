import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
    name: 'post-like',
    orderBy: {
        createdAt: 'ASC'
    }
})
export class PostLike {
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
    createdAt: number
    @Expose()
    @Column()
    updatedAt: number

    constructor(postLike: Partial<PostLike>) {
        if (postLike) {
            Object.assign(
                this,
                plainToClass(PostLike, postLike, {
                    excludeExtraneousValues: true
                })
            )
            this._id = this._id || uuid.v1()
            this.createdAt = this.createdAt || +new Date()
            this.updatedAt = +new Date()
        }
    }
}
