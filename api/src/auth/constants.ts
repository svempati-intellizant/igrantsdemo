//Secret key for validating the access token

export const jwtConstants = {
  secret: process.env["jwt_secret_key"] || "secretKey",
};
