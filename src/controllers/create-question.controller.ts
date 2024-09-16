import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from "@nestjs/common";
import { z } from "zod";

import { CurrentUser } from "@/auth/current-user.decorator";
import type { UserPayload } from "@/auth/jwt.strategy";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { ZodValidationPipe } from "@/pipes/zod-validation.pipe";
import { PrismaService } from "@/prisma/prisma.service";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string()
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body;
    const { sub: userId } = user;

    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId
      }
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
