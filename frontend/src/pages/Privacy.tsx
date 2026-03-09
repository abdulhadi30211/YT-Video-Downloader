import React from 'react';
import Header from '@/components/Header';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center space-y-12 py-12">
        <div className="w-full max-w-4xl bg-card rounded-xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Privacy Policy
          </h1>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Last Updated: December 25, 2025</h2>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Information We Collect</h2>
            <p className="text-muted-foreground">
              Tublyx does not collect any personal information from users. We do not require registration or store any user data. The only information we temporarily process is the video URL provided by users for download purposes, which is immediately deleted after processing.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">How We Use Information</h2>
            <p className="text-muted-foreground">
              We only use the video URL provided by you to fetch and process the video for download. This information is not stored, shared, or used for any other purpose. All processing happens in real-time and no data is retained on our servers.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your information. All video processing is done securely and no user data is stored permanently.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Cookies</h2>
            <p className="text-muted-foreground">
              Tublyx does not use cookies or similar tracking technologies to track the activity on our service.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Third-Party Services</h2>
            <p className="text-muted-foreground">
              We may employ third-party companies and individuals due to the following reasons:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To facilitate our service</li>
              <li>To provide the service on our behalf</li>
              <li>To perform service-related services</li>
              <li>To assist us in analyzing how our service is used</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Links to Other Sites</h2>
            <p className="text-muted-foreground">
              Our service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to take necessary actions.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us using the information provided on our Contact page.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Privacy;