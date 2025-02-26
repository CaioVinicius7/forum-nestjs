import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put
} from "@nestjs/common";
import { z } from "zod";

import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "../pipes/zod-validation.pipe";

const editAnswerBodySchema = z.object({
  content: z.string()
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller("/answer/:id")
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") answerId: string
  ) {
    const { content } = body;
    const { sub: userId } = user;

    const result = await this.editAnswer.execute({
      answerId,
      content,
      authorId: userId,
      attachmentsIds: []
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
