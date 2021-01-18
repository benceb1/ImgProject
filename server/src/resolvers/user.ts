import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { Query } from "type-graphql";
import { User } from "../entity/User";
import { MyContext } from "../utils/types";
import { hash, compare } from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../utils/auth";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import { verify } from "jsonwebtoken";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  token?: String;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi";
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return null;
    }
    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);

      return await User.findOne(payload.userId);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");
    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("name") name: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    if (name.length <= 2) {
      return {
        errors: [
          {
            field: "name",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    if (password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    const hashedPassword = await hash(password, 12);
    let user = User.create({
      name: name,
      password: hashedPassword,
      email: email,
    });
    try {
      await user.save();
    } catch (err) {
      if (err.code === "23505") {
        let fieldError: { field: string; message: string } = {
          field: "",
          message: "",
        };
        if (err.constraint === "user_name") {
          fieldError = {
            field: "name",
            message: "username already taken",
          };
        } else if (err.constraint === "user_email") {
          fieldError = {
            field: "email",
            message: "email already taken",
          };
        }
        return {
          errors: [fieldError],
        };
      }
    }
    sendRefreshToken(res, createRefreshToken(user));
    const token = createAccessToken(user);
    return { user, token };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "cannot find user",
          },
        ],
      };
    }
    const valid = await compare(password, user.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    sendRefreshToken(res, createRefreshToken(user));
    return {
      token: createAccessToken(user),
      user,
    };
  }
}
