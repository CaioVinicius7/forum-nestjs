import { MakeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("Should be able to fetch question comments", async () => {
    await inMemoryQuestionCommentsRepository.create(
      MakeQuestionComment({
        questionId: new UniqueEntityID("question-1")
      })
    );
    await inMemoryQuestionCommentsRepository.create(
      MakeQuestionComment({
        questionId: new UniqueEntityID("question-1")
      })
    );
    await inMemoryQuestionCommentsRepository.create(
      MakeQuestionComment({
        questionId: new UniqueEntityID("question-1")
      })
    );

    const result = await sut.execute({
      questionId: "question-1",
      page: 1
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it("Should be able to fetch paginated question comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        MakeQuestionComment({
          questionId: new UniqueEntityID("question-1")
        })
      );
    }

    const result = await sut.execute({
      questionId: "question-1",
      page: 2
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
