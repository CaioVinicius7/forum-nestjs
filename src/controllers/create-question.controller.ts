import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user.decorator";
import type { UserPayload } from "src/auth/jwt.strategy";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("/questions")
export class CreateQuestionController {
  constructor() {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user);

    return {
      message: "Ok"
    };
  }
}
