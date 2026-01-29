import { NextResponse } from 'next/server';
import { appendContactMessage, ContactFormData } from '@/lib/sheets';
import { Resend } from 'resend';

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

    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log('Attempting to send email via Resend...');
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'SNF Forms <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'ethan@thatonekid.com',
      subject: `${name} sent you a message`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    });

    if (emailError) {
      console.error('Resend API Error:', emailError);
      // We don't fail the whole request because the sheet update succeeded,
      // but we should probably log it very clearly.
      // Optionally we could return a warning.
    } else {
      console.log('Email sent successfully:', emailData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
