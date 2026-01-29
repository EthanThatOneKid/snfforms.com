'use client';

import { useState, useCallback } from 'react';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  MapPin,
  Phone,
  Printer,
} from 'lucide-react';

function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('loading');
      setErrorMessage('');

      if (!executeRecaptcha) {
        setStatus('error');
        setErrorMessage('Recaptcha not ready');
        return;
      }

      try {
        const token = await executeRecaptcha('contact_form_submit');

        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            captchaToken: token,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } catch (error) {
        setStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Something went wrong'
        );
      }
    },
    [executeRecaptcha, formData]
  );

  return (
    <Card>
      <CardContent>
        {status === 'success' ? (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Message Sent!</AlertTitle>
            <AlertDescription>
              Thank you for reaching out. We have received your message and will
              respond shortly.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              This site is protected by reCAPTCHA and the Google{' '}
              <a
                href="https://policies.google.com/privacy"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/terms"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Terms of Service
              </a>{' '}
              apply.
            </p>

            <Button
              type="submit"
              className="w-full"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ContactPage() {
  return (
    <div className="container mx-auto pt-32 pb-10 px-4 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Get in touch</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have a question or need a quote? Fill out the form or reach out to
              us directly using the contact information below.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">
                  <a
                    href="mailto:sales@snfforms.com"
                    className="hover:underline"
                  >
                    sales@snfforms.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Corporate Headquarters</h3>
                <p className="text-muted-foreground">
                  15532 Computer Lane
                  <br />
                  Huntington Beach, CA
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">
                  <a href="tel:+17149016868" className="hover:underline">
                    (714) 901-6868
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Printer className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Fax</h3>
                <p className="text-muted-foreground">(714) 901-6858</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
          >
            <ContactForm />
          </GoogleReCaptchaProvider>
        </div>
      </div>
    </div>
  );
}
