import { google } from "@ai-sdk/google";
import { catchAsync } from "../lib/errors";
import { generateText } from "ai";

export const testAi = catchAsync(async (req, res, next) => {
  const { prompt } = req.body;
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: prompt ?? "",
  });
  res.status(200).json({
    status: "success",
    message: text,
  });
});
