import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param
} from "@nestjs/common";

import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/questions/:id")
export class DeleteQuestionController {
  constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") questionId: string
  ) {
    const { sub: userId } = user;

    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: userId
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
