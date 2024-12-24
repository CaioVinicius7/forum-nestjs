import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Get question by slug (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions/:slug", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456"
      }
    });

    const accessToken = jwt.sign(
      {},
      {
        subject: user.id
      }
    );

    const questionSlug = "question-01";

    await prisma.question.create({
      data: {
        title: "Question 01",
        slug: questionSlug,
        content: "Question content",
        authorId: user.id
      }
    });

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionSlug}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: "Question 01" })
    });
  });
});