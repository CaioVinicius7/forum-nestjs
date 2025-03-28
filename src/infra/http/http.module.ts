import { Module } from "@nestjs/common";

import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { FetchRecentQuestionUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";

import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { ChooseQuestionBestAnswerController } from "./controllers/choose-question-best-answer.controller";
import { CommentOnQuestionController } from "./controllers/comment-on-question.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { FetchQuestionsAnswersController } from "./controllers/fetch-question-answers.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionsAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase
  ]
})
export class HttpModule {}
