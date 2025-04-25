import { HttpException, HttpStatus, Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { BookNotAvailableException } from "./book-not-available.exception";
import { Response } from 'express'

@Catch(BookNotAvailableException)
export class BookNotAvailableFilter implements ExceptionFilter {
  catch(exception: BookNotAvailableException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(404).json({
      statusCode: 404,
      message: exception.message,
      error: 'BookNotAvailable',
    });
  }
}