import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
    name: 'post-access',
    orderBy: {
        createdAt: 'ASC'
    }
})
export class PostAccess {
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

    constructor(postAccess: Partial<PostAccess>) {
        if (postAccess) {
            Object.assign(
                this,
                plainToClass(PostAccess, postAccess, {
                    excludeExtraneousValues: true
                })
            )
            this._id = this._id || uuid.v1()
            this.createdAt = this.createdAt || +new Date()
            this.updatedAt = +new Date()
        }
    }
}
