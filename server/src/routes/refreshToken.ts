import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { createRefreshToken, createAccessToken } from "../utils/auth";
import { sendRefreshToken } from "../utils/sendRefreshToken";

export const refreshToken = async (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }

  let payload: any = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (error) {
    console.log(error);
    return res.send({ ok: false, accessToken: "" });
  }

  const user = await User.findOne({ id: payload.userId });

  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: "" });
  }

  sendRefreshToken(res, createRefreshToken(user));
  return res.send({ ok: true, accessToken: createAccessToken(user) });
};
