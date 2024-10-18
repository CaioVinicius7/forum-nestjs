import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from "@nestjs/common";
import { z } from "zod";

import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";

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
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body;
    const { sub: userId } = user;

    await this.createQUestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: []
    });
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
}
