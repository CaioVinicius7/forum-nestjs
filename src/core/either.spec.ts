import { Either, left, right } from "./either";

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10);
  } else {
    return left("error");
  }
}

test("Success result", () => {
  const result = doSomething(true);

  expect(result.isRight()).toBe(true);
});

test("Error result", () => {
  const result = doSomething(false);

  expect(result.isLeft()).toBe(true);
});
