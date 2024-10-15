import { Injectable } from "@nestjs/common";

import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    throw new Error("Method not implemented.");
  }
  deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}