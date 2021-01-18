import { Request, Response } from "express";
import { Stream } from "stream";

export type MyContext = {
  req: Request;
  res: Response;
  payload?: { userId: string };
};

export type Upload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
};
