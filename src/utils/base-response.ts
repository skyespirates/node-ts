import { Response } from 'express';

interface BaseResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const sendSuccessResponse = (
  res: Response,
  message: string,
  data?: any
) => {
  const response: BaseResponse = {
    success: true,
    message,
    data,
  };
  res.status(200).json(response);
};

export const sendErrorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400
) => {
  const response: BaseResponse = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
};
