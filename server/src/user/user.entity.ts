import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column({
    unique: true,
    nullable: false,
  })
  email: string;
  @Field()
  @Column({
    nullable: false,
  })
  password: string;
  @Field()
  @Column("int", { default: 0 })
  tokenVersion: number;
}
