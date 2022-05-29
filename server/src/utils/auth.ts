import { sign } from "jsonwebtoken";
import { User } from "src/user/user.entity";

export const createAccessToken = (user: User) => {
  return sign(
    {
      userId: user.id,
    },
    process.env.secret_access,
    { expiresIn: "15m" }
  );
};
export const createRefreshToken = (user: User) => {
  return sign(
    {
      userId: user.id,
      tokenVersion: user.tokenVersion,
    },
    process.env.secret_refresh,
    { expiresIn: "30d" }
  );
};
