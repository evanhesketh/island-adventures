import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { google } from "googleapis";
import { GaxiosResponse } from "gaxios";

require("dotenv").config();

interface GetAccessTokenResponseInterface {
  token?: string | null;
  res?: GaxiosResponse | null;
}

export async function POST(req: NextRequest, res: NextResponse) {
  /**
   * Creates a nodemailer transporter
   * Returns: Promise (transporter or NextResponse if error)
   */
  async function createTransporter(): Promise<
    nodemailer.Transporter<SMTPTransport.SentMessageInfo> | NextResponse
  > {
    const OAuth2 = google.auth.OAuth2;
    try {
      const oauth2Client = new OAuth2(
        process.env.EMAIL_CLIENT_ID,
        process.env.EMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });

      const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            console.log("Error with getAccessToken= ", err);
            reject();
          }
          resolve(token);
        });
      });

      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL_USERNAME,
          accessToken: (accessToken as GetAccessTokenResponseInterface).token,
          clientId: process.env.EMAIL_CLIENT_ID,
          clientSecret: process.env.EMAIL_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
      } as SMTPTransport.Options);

      return transporter;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      return NextResponse.json({
        message: "Unable to process request at this time",
      });
    }
  }

  /**
   * Confirms valid email entered by user, creates a JWT, and sends reset email
   * Params: req, res
   * Returrns: NextResponse with success message regardless of whether email 
   * sent (for security reasons)
   */
  async function sendMail(req: NextRequest, res: NextResponse) {
    try {
      await connectMongoDB();
      const { email } = await req.json();
      const user = await User.findOne({ email });

      if (!user) {
        console.log("User not found for: ", email);
        return NextResponse.json({ message: "Password reset email sent" });
      }

      const userToken = jwt.sign(
        { userId: user._id },
        process.env.RESET_TOKEN_SECRET!,
        {
          expiresIn: "1h",
        }
      );

      const url = `${process.env.NEXTAUTH_URL}reset/${userToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USERNAME!,
        to: user.email,
        subject: "Password reset link for Island Adventures",
        text: `Click this link to reset your password: ${url}`,
      };

      const emailTransporter = await createTransporter();

      if (emailTransporter instanceof NextResponse) {
        console.log("Create transporter failed");
        return emailTransporter;
      }

      const mailResponse = await emailTransporter.sendMail(mailOptions);

      console.log("mailResponse=", mailResponse);

      return NextResponse.json({ message: "Password reset email sent" });
    } catch (err) {
      console.log("error in sendMail=", err);
      return NextResponse.json({ message: "Password reset email sent" });
    }
  }

  const response = await sendMail(req, res);
  return response;
}
