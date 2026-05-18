import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import {
  Link2,
  BarChart3,
  Zap,
  Shield,
  Copy,
  QrCode,
} from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
      <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 sm:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Shorten Your Links,
              <span className="block text-primary">Amplify Your Reach</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Create short, memorable links in seconds. Track clicks, analyze
              performance, and optimize your online presence with our powerful
              URL shortener.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <SignUpButton mode="modal">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage, share, and track your links
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Link2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Instant Shortening</h3>
              </div>
              <p className="text-muted-foreground">
                Convert long URLs into short, clean links in just one click.
                Perfect for social media and marketing campaigns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Analytics</h3>
              </div>
              <p className="text-muted-foreground">
                Track clicks, geographic data, and referrer information for
                each link in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Lightning Fast</h3>
              </div>
              <p className="text-muted-foreground">
                Our optimized infrastructure ensures your links redirect in
                milliseconds.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Copy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Custom Links</h3>
              </div>
              <p className="text-muted-foreground">
                Create branded, custom short codes that match your brand
                identity.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Secure & Private</h3>
              </div>
              <p className="text-muted-foreground">
                Enterprise-grade security with HTTPS encryption and privacy
                controls for your data.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">QR Codes</h3>
              </div>
              <p className="text-muted-foreground">
                Generate scannable QR codes for your shortened links instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8 bg-primary/5 rounded-lg border border-primary/20 p-8 sm:p-12">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start shortening your links today. No credit card required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                Create Free Account
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>
      </div>
  );
}