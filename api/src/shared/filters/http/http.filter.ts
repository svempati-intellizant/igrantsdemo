import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { loggerInstance } from '../../../logger';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const url = req.url;
    const method = req.method;
    const res = ctx.getResponse();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const error_response = {
      code: status,
      payload:
        exception.message || 'Internal server error. Please try again later',
      error: true,
      url,
      method,
    };
    if (!error_response.payload.includes('starting at object')) {
      Logger.log(`${method} ${status} ${url}`, 'CustomErrorHandler');
      loggerInstance.log(
        `${method} ${status} ${url} ${error_response.payload}`,
        'error',
      );
    }
    res.status(status).json(error_response);
  }
}
