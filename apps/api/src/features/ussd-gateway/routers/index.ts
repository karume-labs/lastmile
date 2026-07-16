import { Router } from "express";
import { handleUSSDRequest } from "@lastmile/participant-channel";

const router = Router();

router.post("/", (req, res) => {
  const phoneNumber = (req.body.phoneNumber || req.query.phoneNumber || "") as string;
  const text = (req.body.text || req.query.text || "") as string;

  const ussdResponse = handleUSSDRequest({ phoneNumber, text });

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(ussdResponse);
});

export default router;
