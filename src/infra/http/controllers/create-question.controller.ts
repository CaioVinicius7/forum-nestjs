import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from "@nestjs/common";
import { z } from "zod";

import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "../pipes/zod-validation.pipe";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string()
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
export class CreateQuestionController {
  constructor(private readonly createQUestion: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body;
    const { sub: userId } = user;

    const result = await this.createQUestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: []
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
