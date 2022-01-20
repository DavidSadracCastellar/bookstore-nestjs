import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TenancyModule } from "../tenancy/tenancy.module";
import { User } from "../user/user.entity";

@Entity('books', { 'schema': `${TenancyModule.tenant}` })
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 100, nullable: false})
    name: string;

    @Column({type: 'varchar', length: 500, nullable: false})
    description: string;

    @ManyToMany(() => User, user => user.books)
    @JoinColumn()
    authors: User[];

    @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
    status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

}