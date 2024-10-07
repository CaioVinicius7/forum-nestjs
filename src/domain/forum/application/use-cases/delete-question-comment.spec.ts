import { MakeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

import { DeleteQuestionCommentUseCase } from "./delete-question-comment";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("Should be able to delete a question comment", async () => {
    const questionComment = MakeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString()
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it.only("Should not be able to delete another user question comment", async () => {
    const questionComment = MakeQuestionComment({
      authorId: new UniqueEntityID("author-1")
    });

    await inMemoryQuestionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      authorId: "author-2",
      questionCommentId: questionComment.id.toString()
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
