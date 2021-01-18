import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  let date = new Date();
  date.setDate(date.getDate() + 7);
  res.cookie("jid", token, {
    httpOnly: true,
  });
};
