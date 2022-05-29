import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
  Int,
} from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { MyContext } from "src/MyContext";
import { createAccessToken, createRefreshToken } from "src/utils/auth";
import { isAuth } from "src/utils/isAuth";
import { sendRefreshToken } from "src/utils/sendRefreshToken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
  @Query(() => String)
  hello(): String {
    return "hi";
  }
  @Query(() => String)
  bye(@Context() context: MyContext): String {
    isAuth(context);

    return `bye ${context.payload.userId}`;
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userRepository.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Args("email", { type: () => String }) email: string,
    @Args("password", { type: () => String }) password: string
  ): Promise<boolean> {
    const hashedPass = await hash(password, 12);
    try {
      await this.userRepository.insert({
        email,
        password: hashedPass,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args("email", { type: () => String }) email: string,
    @Args("password", { type: () => String }) password: string,
    @Context() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("could not find user");
    }
    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error("bad password");
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }
  @Mutation(() => Boolean)
  async revokeRefreshToken(
    @Args("userId", { type: () => Int }) userId: number
  ) {
    await this.userRepository.increment({ id: userId }, "tokenVersion", 1);
    return true;
  }
  @Query(() => User, { nullable: true })
  me(@Context() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      console.log(token);
      const payload: any = verify(token, process.env.secret_access!);
      return this.userRepository.findOne({ where: { id: payload.userId } });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  @Mutation(() => Boolean)
  async logout(@Context() { res }: MyContext) {
    // sendRefreshToken(res, "");
    res.clearCookie("jid");
    return true;
  }
}
