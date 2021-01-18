import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  OneToMany,
} from "typeorm";
import { Image } from "./Image";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Field(() => String)
  @Index("user_name", { unique: true })
  @Column("text")
  name: string;

  @Field(() => String)
  @Index("user_email", { unique: true })
  @Column("text")
  email: string;

  @Column("text")
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @OneToMany((type) => Image, (image) => image.user)
  images: Promise<Image[]>;
}
