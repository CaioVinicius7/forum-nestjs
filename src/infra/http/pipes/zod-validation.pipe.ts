import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodError, type ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed",
          statusCode: 400,
          errors: error.flatten().fieldErrors
        });
      }

      throw new BadRequestException("Validation failed");
    }
  }
}