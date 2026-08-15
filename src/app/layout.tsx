import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CurrencyProvider } from "@/components/currency-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { getPublicEnv } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const env = getPublicEnv();

export const metadata: Metadata = {
  metadataBase: new URL(env.siteDomain),
  title: {
    default: `${env.siteName} — ${env.siteTagline}`,
    template: `%s | ${env.siteName}`,
  },
  description:
    "Cheap hosting and VPS in Bangladesh. NVMe SSD storage, LiteSpeed servers, free SSL, daily backups and 24/7 local support. Register your domain and launch today.",
  applicationName: env.siteName,
  keywords: [
    "web hosting bangladesh",
    "bdix hosting",
    "vps bangladesh",
    "reseller hosting",
    "cheap hosting",
    "domain registration bangladesh",
    "nvme hosting",
    "cpanel hosting",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: env.siteDomain,
    siteName: env.siteName,
    title: `${env.siteName} — ${env.siteTagline}`,
    description:
      "Cheap hosting and VPS in Bangladesh with NVMe storage, LiteSpeed and 24/7 local support.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: env.siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${env.siteName} — ${env.siteTagline}`,
    description:
      "Cheap hosting and VPS in Bangladesh with NVMe storage, LiteSpeed and 24/7 local support.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: env.faviconPath,
    shortcut: env.faviconPath,
    apple: "/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: env.primaryColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <CurrencyProvider>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </CurrencyProvider>
        </ThemeProvider>

        {env.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${env.gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${env.gaId}');
              `}
            </Script>
          </>
        )}

        {env.tawkPropertyId && env.tawkWidgetId && (
          <Script id="tawk-to" strategy="afterInteractive">
            {`
              (function(){
              var origError=console.error,origWarn=console.warn;
              var filter=function(fn){return function(){for(var i=0;i<arguments.length;i++){if(typeof arguments[i]==='string'&&arguments[i].indexOf('[Tawk/Logger]')!==-1)return;}return fn.apply(console,arguments);};};
              console.error=filter(origError);console.warn=filter(origWarn);
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/${env.tawkPropertyId}/${env.tawkWidgetId}';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `}
          </Script>
        )}

        {env.gtmId && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${env.gtmId}');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
