import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { SharedService } from "src/shared/shared.service";
import {
  JwtPayload,
  LoginRequestDto,
  UserLoginSuccessDTO,
} from "src/users/dto/login-request.dto";
import { UsersService } from "src/users/users.service";
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private sharedService: SharedService
  ) {}

  async login(loginDto: LoginRequestDto): Promise<UserLoginSuccessDTO> {
    //Fetch the user from DB
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (user) {
      //Hash the password from request and check whether it matches the password with DB
      const hashedPassword = this.sharedService.createHash(loginDto.password);
      console.log(hashedPassword, user.password);
      if (user.password === hashedPassword) {
        //Sign the JWT token if the user got validated
        const jwtPayload: JwtPayload = {
          _id: user._id,
          email: user.email,
          role: user.role,
          agency: user.agency ? user.agency : null,
        };
        return { token: this.sharedService.signJWT(jwtPayload), ...user };
      }
      throw new UnauthorizedException("Invalid credentials");
    }
    throw new UnauthorizedException("Invalid credentials");
  }
}
