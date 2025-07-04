import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import errorHandler from '../errorHandler/errorHandler';
import { CustomError } from '../utils/interfaces';

/**Create middleware for error log */
export const errorMiddleware = (error: CustomError, request: Request, response: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    // eslint-disable-next-line no-constant-binary-expression
    console.error(`[${moment().format('DD/MM/YYYY hh:mm:ss a')}] ${error.stack}` || error.message);
    const url = `Location of Error : ${request.originalUrl}  Method : ${request.method}  Request Body : ${JSON.stringify(request.body)}`;
    errorHandler(error, url);
    if (response.headersSent) return next(error);
    response.status(status).send({ status, message, });
};
