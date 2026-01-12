import { Request, Response, NextFunction } from "express";
import { error } from "node:console";
import { respondWithError } from "./json.js";

export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequest.prototype);
    this.message = "Chirp is too long. Max length is 140";
  }
}

export class Unauthorized extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, Unauthorized.prototype);
    this.message = "Not authorized";
  }
}

export class Forbidden extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, Forbidden.prototype);
    this.message = "That's forbidden!";
  }
}

export class NotFound extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFound.prototype);
    this.message = "We're not finding that";
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Uh oh, spaghetti-o");
  let message: string = "";
  let statusCode: number = 0;
  // res.status(500).json({
  //   error: "Something went wrong on our end",
  // });
  if (err instanceof BadRequest) {
    statusCode = 400;
    message = err.message;
  }  else if (err instanceof Unauthorized) {
    statusCode = 401;
    message = err.message;
  }  else if (err instanceof Forbidden) {
    statusCode = 403;
    message = err.message;
  }  else if (err instanceof NotFound) {
    statusCode = 404;
    message = err.message;
  } else {
    statusCode = 500;
    message = "Something went wrong on our end";
  }
  respondWithError(res, statusCode, message)
}