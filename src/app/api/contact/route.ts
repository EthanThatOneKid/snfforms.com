import { NextResponse } from 'next/server';
import { appendContactMessage, ContactFormData } from '@/lib/sheets';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, captchaToken } = body;

    if (!captchaToken) {
      return NextResponse.json(
        { error: 'reCAPTCHA token is missing' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token using v3
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
    const captchaRes = await fetch(verificationUrl, { method: 'POST' });
    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      console.error('reCAPTCHA failed:', captchaData);
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // v3 returns a score (0.0 - 1.0). 1.0 is very likely a human.
    // Recommended threshold is 0.5.
    if (captchaData.score < 0.5) {
      console.warn('reCAPTCHA low score:', captchaData.score);
      return NextResponse.json(
        { error: 'We could not verify that you are a human.' },
        { status: 403 }
      );
    }

    // Append to Google Sheets
    const contactData: ContactFormData = {
      name,
      email,
      phone,
      message,
    };

    await appendContactMessage(contactData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
