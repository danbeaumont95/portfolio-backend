import { Request, Response } from "express";
import axios from "axios";

export async function sendEmailHandler(req: Request, res: Response) {
  const respBody = {
    success: false,
    message: '',
    data: {}
  };
  try {
    const { subject, text, userEmail } = req.body;

    const emailToSend = {
      sender: {
        name: 'Portfolio Website user',
        email: `${process.env.verifiedEmail}`,
      },
      to: [
        {
          email: `${process.env.emailAddressTo}`,
          name: 'Dan portfolio site',
        },
      ],
      subject,
      htmlContent: `<html><head></head><body><h3>Email from: ${userEmail}</h3><p>${text}</p></body></html>`,
    };

    const email = await axios.post('https://api.sendinblue.com/v3/smtp/email', emailToSend, {
      headers: {
        'api-key': process.env.sendinblueapikey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
    });

    if (!email) {
      respBody.message = '[BadRequest] Error sending email';
      return res.status(200).json(respBody);
    }
    respBody.success = true;
    respBody.message = '[Success] Email sent!';
  } catch (error) {
    respBody.message = error;
    return res.status(400).json(respBody);
  }
  return res.status(200).json(respBody);

}
