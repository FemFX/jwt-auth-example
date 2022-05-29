import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { verify } from "jsonwebtoken";
import { Repository } from "typeorm";
import { User } from "./user/user.entity";
import { createAccessToken, createRefreshToken } from "./utils/auth";
import { sendRefreshToken } from "./utils/sendRefreshToken";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
  getHello(): string {
    return "Hello World!";
  }
  async refreshToken(token, res) {
    if (!token) {
      return {
        ok: false,
        accessToken: "",
      };
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.secret_refresh);
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        accessToken: "",
      };
    }
    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });
    if (!user) {
      return {
        ok: false,
        accessToken: "",
      };
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return {
        ok: false,
        accessToken: "",
      };
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      ok: true,
      accessToken: createAccessToken(user),
    };
  }
}
