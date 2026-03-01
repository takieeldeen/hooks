import { google } from "@ai-sdk/google";
import { catchAsync } from "../lib/errors";
import { generateText } from "ai";
import axios from "axios";

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

export const getAvailableGoogleModels = catchAsync(async (req, res, next) => {
  //TODO Get User API_KEY
  const API_KEY = process.env.AI_GATEWAY_API_KEY;

  const response = await axios.get(
    "https://generativelanguage.googleapis.com/v1/models",
    {
      params: {
        key: API_KEY,
      },
    },
  );
  res.status(200).json({
    status: "success",
    content: response?.data?.models?.map((model: any) => model.name),
  });
});

export const getAvailableOpenAiModels = catchAsync(async (req, res, next) => {
  //TODO Get User API_KEY
  const API_KEY = process.env.OPENAI_API_KEY;

  const response = await axios.get("https://api.openai.com/v1/models", {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  res.status(200).json({
    status: "success",
    content: response?.data?.data?.map((model: any) => model.id),
  });
});
