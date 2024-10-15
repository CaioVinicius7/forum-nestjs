import { MakeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it("Should be able to delete a answer comment", async () => {
    const answerComment = MakeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(answerComment);

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString()
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete another user answer comment", async () => {
    const answerComment = MakeAnswerComment({
      authorId: new UniqueEntityID("author-1")
    });

    await inMemoryAnswerCommentsRepository.create(answerComment);

    const result = await sut.execute({
      authorId: "author-2",
      answerCommentId: answerComment.id.toString()
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});