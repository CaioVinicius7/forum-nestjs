import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post
} from "@nestjs/common";
import { z } from "zod";

import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "../pipes/zod-validation.pipe";

const commentOnQuestionBodySchema = z.object({
  content: z.string()
});

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("questionId") questionId: string
  ) {
    const { content } = body;
    const { sub: userId } = user;

    const result = await this.commentOnQuestion.execute({
      questionId,
      content,
      authorId: userId
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
