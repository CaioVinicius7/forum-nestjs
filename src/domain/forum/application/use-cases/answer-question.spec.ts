import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { AnswerQuestionUseCase } from "./answer-question";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Answer Question Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it("Should be able to create a answer", async () => {
    const result = await sut.execute({
      questionId: "1",
      InstructorId: "1",
      content: "Nova resposta",
      attachmentsIds: ["1", "2"]
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1")
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("2")
        })
      ]
    );
  });
});
