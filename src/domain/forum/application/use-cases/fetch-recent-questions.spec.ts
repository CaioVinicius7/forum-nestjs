import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

import { FetchRecentQuestionUseCase } from "./fetch-recent-questions";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionUseCase;

describe("Fetch Recent Question Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new FetchRecentQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("Should be able to fetch recent questions", async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 20)
      })
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 18)
      })
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 23)
      })
    );

    const result = await sut.execute({ page: 1 });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2023, 0, 23)
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 20)
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 18)
      })
    ]);
  });

  it("Should be able to fetch paginated recent questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({ page: 2 });

    expect(result.value?.questions).toHaveLength(2);
  });
});
