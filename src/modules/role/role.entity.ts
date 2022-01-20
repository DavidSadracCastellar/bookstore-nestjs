import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TenancyModule } from "../tenancy/tenancy.module";
import { User } from "../user/user.entity";

@Entity('roles', { 'schema': `${TenancyModule.tenant}` })
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'text', nullable: false})
    name: string;

    @Column({type: 'text', nullable: false})
    description: string;

    @ManyToMany(type => User, user => user.roles)
    @JoinColumn()
    users: User[];

    @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
    status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}