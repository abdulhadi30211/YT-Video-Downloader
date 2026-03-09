import React, { useState } from 'react';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Contact form submitted:', formData);
    showSuccess('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center space-y-12 py-12">
        <div className="w-full max-w-2xl bg-card rounded-xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Contact Us
          </h1>
          
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">Get in Touch</h2>
              <p className="text-muted-foreground">
                Have questions, feedback, or need support? We'd love to hear from you!
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full py-6 text-lg">
                Send Message
              </Button>
            </form>
          </div>
          
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="p-4 bg-secondary rounded-lg">
                <h4 className="font-medium mb-2">Developer Information</h4>
                <p>Web Developer: Abdulhadi</p>
                <p>Portfolio: <a href="https://portfolio-abdulhadi1.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://portfolio-abdulhadi1.vercel.app/</a></p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <h4 className="font-medium mb-2">Support</h4>
                <p>For technical issues and support inquiries</p>
                <p>Please use the contact form above</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;