import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export interface AppError extends Error {
  statusCode?: number
  status?: string
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    if (err instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: err.errors,
      })
    }

    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: err.errors,
    })
  }

  if (err.statusCode === 404) {
    return res.status(404).json({
      status: 'error',
      message: err.message || 'Not found',
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  })
}
