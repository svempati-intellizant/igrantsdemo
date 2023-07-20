import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

import * as jwt from "jsonwebtoken";
import { jwtConstants } from "../auth/constants";
import { JwtPayload } from "src/users/dto/login-request.dto";

@Injectable()
export class SharedService {
  constructor() {}
  createHash = (stringToHash: string) =>
    crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");

  signJWT = (user: JwtPayload) => {
    const { email, _id, role, agency } = user;
    return jwt.sign({ email, _id, role, agency }, jwtConstants.secret, {
      expiresIn: "4h",
      algorithm: "HS256",
      issuer: "iGrant Authentication API",
      audience: "iGrant Client",
      subject: `${email} - ${_id}`,
    });
  };
}
