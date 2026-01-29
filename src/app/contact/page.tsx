import { Metadata } from 'next';
import ContactContent from './content';

export const metadata: Metadata = {
  title: 'Contact Us',
};

export default function ContactPage() {
  return <ContactContent />;
}
