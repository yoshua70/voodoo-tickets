import Twilio from "twilio";
import { customConfig } from "../config/default";

const accountSid = customConfig.twilioAccountSid;
const authToken = customConfig.twilioAuthToken;

const client = Twilio(accountSid!, authToken!);

export const twilio = client.verify.v2.services(
  "VA1e6a0845d9b33af3c24a7029af8a0cd2"
);
