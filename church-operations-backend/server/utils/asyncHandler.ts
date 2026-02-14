import { Request, Response, NextFunction } from "express";

export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (typeof next !== "function") {
        console.error("asyncHandler error: next is not a function", { nextType: typeof next, next });
        // fallback: send generic error if next is not available
        try {
          res.status(500).json({ status: "error", message: "Internal Server Error" });
        } catch (sendErr) {
          console.error("failed to send fallback error response", sendErr);
        }
        return;
      }

      next(err);
    });
  };
