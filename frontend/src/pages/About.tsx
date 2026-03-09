import React from 'react';
import Header from '@/components/Header';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center space-y-12 py-12">
        <div className="w-full max-w-4xl bg-card rounded-xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            About Tublyx
          </h1>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">What is Tublyx?</h2>
            <p className="text-muted-foreground">
              Tublyx is a powerful and user-friendly video download tool that allows you to download videos from YouTube, Facebook, Instagram, TikTok, and over 1000+ other platforms. Our service is completely free and designed to provide high-quality downloads with ease of use.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Our Mission</h2>
            <p className="text-muted-foreground">
              We aim to provide a seamless, fast, and reliable video downloading experience for users worldwide. Our platform is constantly updated to support new video platforms and formats, ensuring you can always download your favorite content.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Download videos from 1000+ platforms including YouTube, Facebook, Instagram, TikTok, Twitter, and more</li>
              <li>Multiple quality options from 144p to 4K resolution</li>
              <li>Audio-only downloads for music and podcasts</li>
              <li>Playlist support for downloading entire playlists</li>
              <li>Fast and reliable download speeds</li>
              <li>No registration or signup required</li>
              <li>Completely free to use</li>
            </ul>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Security & Privacy</h2>
            <p className="text-muted-foreground">
              We prioritize your privacy and security. Tublyx doesn't store any downloaded videos or personal information. All processing happens securely on our servers, and your downloads are private and secure.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Developer Information</h2>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-muted-foreground mb-2"><span className="font-medium">Owner & Web Developer:</span> Abdulhadi</p>
              <p className="text-muted-foreground mb-2"><span className="font-medium">Portfolio:</span> <a href="https://portfolio-abdulhadi1.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://portfolio-abdulhadi1.vercel.app/</a></p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;