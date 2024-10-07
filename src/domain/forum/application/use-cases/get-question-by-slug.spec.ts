import { MakeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

import { Slug } from "../../enterprise/entities/value-objects/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("Should be able to get a question by slug", async () => {
    const newQuestion = MakeQuestion({
      slug: Slug.create("example-question")
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: "example-question"
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.question.id).toBeTruthy();
      expect(result.value.question.title).toEqual(newQuestion.title);
    }
  });
});
