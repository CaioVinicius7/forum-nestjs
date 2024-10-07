import { MakeAnswer } from "test/factories/make-answer";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

import { DeleteAnswerUseCase } from "./delete-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it("Should be able to delete a answer", async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityID("author-1")
      },
      new UniqueEntityID("answers-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("1")
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("2")
      })
    );

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString()
    });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete a answer from another user", async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityID("author-1")
      },
      new UniqueEntityID("answers-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: "author-2",
      answerId: "answers-1"
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
