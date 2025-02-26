import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param
} from "@nestjs/common";

import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/answers/:id")
export class DeleteAnswerController {
  constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") answerId: string
  ) {
    const { sub: userId } = user;

    const result = await this.deleteAnswer.execute({
      answerId,
      authorId: userId
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
