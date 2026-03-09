import React from 'react';
import Header from '@/components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Help = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center space-y-12 py-12">
        <div className="w-full max-w-4xl bg-card rounded-xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Help & Support
          </h1>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-lg font-semibold">How to Use Tublyx</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="font-medium">Basic Usage:</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Copy the URL of the video you want to download from YouTube, Facebook, Instagram, TikTok, or any supported platform</li>
                  <li>Paste the URL in the input field on the main page</li>
                  <li>Click "Fetch Video Info" to retrieve video details</li>
                  <li>Select your preferred quality/format from the available options</li>
                  <li>Click "Download Now" to start the download</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="playlist">
              <AccordionTrigger className="text-lg font-semibold">Playlist Downloads</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="font-medium">Using Playlist Feature:</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>For YouTube playlists, copy the playlist URL (not individual video URL)</li>
                  <li>Paste the playlist URL in the input field</li>
                  <li>Click "Load Playlist" to fetch all videos in the playlist</li>
                  <li>If the playlist doesn't load automatically, please copy the URL and fill it manually</li>
                  <li>You can download individual videos or the entire playlist</li>
                  <li>Each video in the playlist can be downloaded separately with its own quality options</li>
                </ol>
                <p className="text-muted-foreground">
                  <strong>Note:</strong> For best results with playlists, ensure you're using the correct playlist URL format. If you encounter issues, try refreshing the page and pasting the URL again.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="troubleshooting">
              <AccordionTrigger className="text-lg font-semibold">Troubleshooting Common Issues</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-medium">Video Not Loading?</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Verify the URL is correct and from a supported platform</li>
                    <li>Try copying the URL again from your browser</li>
                    <li>Check if the video is publicly accessible (not private/restricted)</li>
                    <li>Clear your browser cache and try again</li>
                    <li>Try a different browser if the issue persists</li>
                  </ul>
                  
                  <h3 className="font-medium">Download Not Starting?</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Check your internet connection</li>
                    <li>Disable browser extensions that might block downloads</li>
                    <li>Try pausing any active downloads and try again</li>
                    <li>Check your browser's download settings</li>
                  </ul>
                  
                  <h3 className="font-medium">Playlist Not Loading?</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Ensure you're using the correct playlist URL (not individual video URL)</li>
                    <li>Some platforms may have restrictions on playlist access</li>
                    <li>Try copying the URL directly from the playlist page</li>
                    <li>If the download doesn't load automatically, please copy the URL and fill it manually</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="ad-info">
              <AccordionTrigger className="text-lg font-semibold">About Ads and Popups</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    When you click download or fetch buttons, you might notice a window opening in a new tab. This is part of our service to support continued operation of Tublyx.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>How it works:</strong> When you click a download or fetch button, a new tab may open (this is not an ad but a window that helps support our service). You can close this window at any time - your download or fetch operation will continue in the original tab without interruption.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Important:</strong> The main download process continues in your original tab regardless of what happens in the new window. You can safely close the new window and your download will proceed normally.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="supported-platforms">
              <AccordionTrigger className="text-lg font-semibold">Supported Platforms</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-muted-foreground">
                  Tublyx supports video downloads from over 1000 platforms including:
                </p>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-muted-foreground">
                  <li>• YouTube</li>
                  <li>• Facebook</li>
                  <li>• Instagram</li>
                  <li>• TikTok</li>
                  <li>• Twitter/X</li>
                  <li>• Vimeo</li>
                  <li>• Dailymotion</li>
                  <li>• SoundCloud</li>
                  <li>• And many more!</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="quality-options">
              <AccordionTrigger className="text-lg font-semibold">Quality Options Explained</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    When downloading videos, you'll see different quality options:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li><strong>Video + Audio:</strong> Complete video with audio in various resolutions (144p to 4K)</li>
                    <li><strong>Audio Only:</strong> Extract audio from the video (MP3, M4A, etc.)</li>
                    <li><strong>Best:</strong> Highest available quality for the specific video</li>
                    <li><strong>File Size:</strong> Estimated file size is shown next to each option to help you choose</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="developer">
              <AccordionTrigger className="text-lg font-semibold">About the Developer</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Owner & Web Developer:</span> Abdulhadi
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Portfolio:</span> <a href="https://portfolio-abdulhadi1.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://portfolio-abdulhadi1.vercel.app/</a>
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="contact">
              <AccordionTrigger className="text-lg font-semibold">Need More Help?</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you're experiencing issues not covered here, please contact our support team through our <a href="/contact" className="text-primary hover:underline">Contact page</a>. Please include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>The URL of the video you're trying to download</li>
                  <li>The platform where the video is hosted</li>
                  <li>Any error messages you're seeing</li>
                  <li>Your browser and operating system</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  );
};

export default Help;