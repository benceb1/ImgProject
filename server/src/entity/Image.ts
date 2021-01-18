import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity("images")
export class Image extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Field(() => String)
  @Column("text")
  url: string;

  @Field(() => String)
  @Column("text")
  description: string;

  @Field()
  @Column("timestamp", { name: "created_at", default: () => "LOCALTIMESTAMP" })
  createdAt: string;

  @ManyToOne((type) => User, (user) => user.images)
  user: Promise<User>;
}
