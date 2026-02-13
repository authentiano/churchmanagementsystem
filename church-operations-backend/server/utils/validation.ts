import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error: any) {
      const errors = error.errors?.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        status: "error",
        errors,
      });
    }
  };
