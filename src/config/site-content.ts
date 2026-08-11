import type { SiteContent } from "@/lib/site-types";

/**
 * Default marketing content for CHV HOST.
 * Overridable at runtime via the /admin editor (stored in /content/overrides.json).
 */
export const defaultContent: SiteContent = {
  company: {
    name: "CHV HOST",
    tagline: "Cheap Hosting And VPS",
    description:
      "CHV HOST is a Bangladesh-based hosting company delivering affordable shared hosting, reseller hosting and VPS on fast NVMe infrastructure with 24/7 local support.",
    email: "support@yourdomain.com",
    salesEmail: "sales@yourdomain.com",
    phone: "+880XXXXXXXXXX",
    address: "Dhaka, Bangladesh",
    founded: "2024",
  },
  hero: {
    headline: "Build Faster.",
    highlight: "Host Smarter.",
    subheadline:
      "Reliable, lightning-fast hosting and VPS in Bangladesh — powered by NVMe storage, LiteSpeed servers and friendly local support at prices that make sense.",
    primaryCta: { label: "Get Started", href: "/pricing" },
    secondaryCta: { label: "Find Your Domain", href: "/domains" },
    points: [
      "99.9% uptime guarantee",
      "NVMe SSD storage",
      "Free SSL certificates",
      "24/7 local support",
    ],
  },
  stats: [
    { label: "Happy Customers", value: "2,500", suffix: "+" },
    { label: "Websites Hosted", value: "4,800", suffix: "+" },
    { label: "Uptime", value: "99.9", suffix: "%" },
    { label: "Support Availability", value: "24/7" },
    { label: "Years of Experience", value: "5", suffix: "+" },
  ],
  categories: [
    {
      id: "web",
      title: "Web Hosting",
      description: "cPanel shared hosting with NVMe speed and free SSL.",
      startingPrice: "৳49/mo",
      icon: "globe",
      href: "/hosting",
      cta: "View Plans",
    },
    {
      id: "bdix",
      title: "BDIX Hosting",
      description: "Local connectivity and low latency for Bangladesh.",
      startingPrice: "৳69/mo",
      icon: "network",
      href: "/bdix-hosting",
      cta: "View Plans",
    },
    {
      id: "turbo",
      title: "Turbo Hosting",
      description: "Max performance with LiteSpeed and LSCache.",
      startingPrice: "৳129/mo",
      icon: "bolt",
      href: "/turbo-hosting",
      cta: "View Plans",
    },
    {
      id: "reseller",
      title: "Reseller Hosting",
      description: "White-label hosting with WHM and custom nameservers.",
      startingPrice: "৳299/mo",
      icon: "layers",
      href: "/reseller-hosting",
      cta: "Start Reselling",
    },
    {
      id: "vps",
      title: "VPS",
      description: "Full root access on NVMe virtual servers.",
      startingPrice: "৳699/mo",
      icon: "server",
      href: "/vps",
      cta: "Deploy VPS",
    },
    {
      id: "bdix-vps",
      title: "BDIX VPS",
      description: "Low-latency VPS inside the local BDIX network.",
      startingPrice: "৳899/mo",
      icon: "map-pin",
      href: "/bdix-vps",
      cta: "Deploy VPS",
    },
    {
      id: "domain",
      title: "Domain Registration",
      description: "Register .com, .bd and 40+ popular extensions.",
      startingPrice: "৳1,090/yr",
      icon: "globe-2",
      href: "/domains",
      cta: "Search Domains",
    },
  ],
  whyChooseUs: [
    {
      icon: "database",
      title: "NVMe Storage",
      description: "Enterprise NVMe drives deliver up to 20x faster I/O than traditional disks.",
    },
    {
      icon: "zap",
      title: "Fast Network",
      description: "Multi-homed network with upstream providers for low-latency routing.",
    },
    {
      icon: "shield",
      title: "Free SSL",
      description: "Free SSL certificates on every account, installed automatically.",
    },
    {
      icon: "clock",
      title: "Daily Backups",
      description: "Automated daily backups keep your data safe and restorable.",
    },
    {
      icon: "lock",
      title: "Security Protection",
      description: "Proactive firewall rules and malware scanning on every server.",
    },
    {
      icon: "headphones",
      title: "24/7 Support",
      description: "Real humans on live chat and tickets — around the clock.",
    },
    {
      icon: "panel",
      title: "cPanel Included",
      description: "The industry-standard control panel, free with every plan.",
    },
    {
      icon: "cpu",
      title: "Reliable Infrastructure",
      description: "Redundant power, cooling and networking in modern data centers.",
    },
  ],
  infrastructure: [
    "NVMe SSD",
    "LiteSpeed Web Server",
    "CloudLinux",
    "Free SSL",
    "DDoS Protection",
    "Automated Backups",
    "Malware Protection",
    "Cloudflare CDN",
  ],
  testimonials: [
    {
      name: "Rahim Ahmed",
      company: "rahimtech.com",
      rating: 5,
      text: "Moved three client sites from a big international host and page loads are noticeably faster. Support replies in minutes on live chat.",
    },
    {
      name: "Nusrat Jahan",
      company: "Nusrat Designs",
      rating: 5,
      text: "Their BDIX hosting keeps my Dhaka-based shop lightning fast for local visitors. Zero downtime in six months.",
    },
    {
      name: "Mahmudul Hasan",
      company: "CodeCanvas",
      rating: 5,
      text: "Setup was instant and cPanel made it easy to move my email and sites. Best value I have found in Bangladesh.",
    },
    {
      name: "Farhana Islam",
      company: "StoreBD",
      rating: 4,
      text: "VPS deployment took minutes and the NVMe speeds are excellent. Their team helped me configure my firewall for free.",
    },
  ],
  faqs: [
    {
      question: "How fast is my hosting activated after I pay?",
      answer:
        "Shared hosting accounts are provisioned automatically within a few minutes of payment confirmation. VPS servers are deployed as soon as the order is approved.",
    },
    {
      question: "Do you provide free SSL certificates?",
      answer:
        "Yes. Every shared and reseller plan includes free SSL (Let's Encrypt / AutoSSL) installed automatically by cPanel for all of your domains.",
    },
    {
      question: "Can I upgrade my plan later?",
      answer:
        "Absolutely. You can upgrade or downgrade at any time from your client area. We credit the remaining value of your current billing period automatically.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major bKash, Nagad, Rocket and card payments securely through ZiniPay, as well as bank transfer on request.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Shared and reseller hosting include a 7-day money-back guarantee. VPS services are refunded pro-rata on cancellation within the first 3 days.",
    },
    {
      question: "Is there a setup fee?",
      answer:
        "No setup fees on any plan. The price you see is the price you pay, with no hidden charges.",
    },
  ],
  finalCta: {
    title: "Ready to launch your website?",
    subtitle:
      "Join thousands of customers hosting with CHV HOST. It takes less than two minutes to get online.",
    primaryLabel: "View Hosting Plans",
    secondaryLabel: "Search Domain",
  },
  status: {
    title: "System Status",
    description:
      "Live status of the CHV HOST platform. Check back here for updates on any incident or scheduled maintenance.",
    items: [
      { name: "Website", status: "operational", note: "All systems normal." },
      { name: "Hosting", status: "operational", note: "Servers online, provisioning normal." },
      { name: "DNS", status: "operational", note: "Nameservers resolving normally." },
      { name: "Client Area", status: "operational", note: "WHMCS portal online." },
      { name: "Payments", status: "operational", note: "ZiniPay processing normally." },
      { name: "Support", status: "operational", note: "Tickets and live chat online." },
    ],
  },
  contact: {
    title: "Get in Touch",
    description:
      "Questions about plans, billing or your account? Our team is here 24/7 via phone, email and live chat.",
    phoneLabel: "Call us",
    emailLabel: "Email us",
  },
  legal: {
    terms: [
      {
        heading: "1. Agreement",
        body: "By purchasing any service from CHV HOST you agree to these terms. Services are provided on a best-effort basis within the limits described on our website and in your client area.",
      },
      {
        heading: "2. Acceptable Use",
        body: "Services must not be used for spam, phishing, fraud, illegal content or any activity that harms other customers or third parties. Accounts found in violation may be suspended or terminated.",
      },
      {
        heading: "3. Billing & Renewals",
        body: "Recurring services are invoiced automatically before renewal. Failure to pay an invoice may result in suspension and eventual termination after the grace period. Suspended accounts may incur reactivation charges.",
      },
      {
        heading: "4. Refunds",
        body: "Shared and reseller hosting include a 7-day money-back guarantee. VPS refunds are provided pro-rata within the first 3 days. Domain registrations and add-on products are non-refundable once registered.",
      },
      {
        heading: "5. Liability",
        body: "CHV HOST is not liable for indirect or consequential damages, loss of data, or business interruption. We recommend you maintain your own backups in addition to server-side ones.",
      },
    ],
    privacy: [
      {
        heading: "1. Information We Collect",
        body: "We collect the information you provide when creating an account or placing an order (name, email, phone, address) as well as technical logs required to operate the service.",
      },
      {
        heading: "2. How We Use It",
        body: "Your information is used to provision services, process billing, provide support and send service notifications. We never sell your personal data.",
      },
      {
        heading: "3. Payment Data",
        body: "Payments are processed by ZiniPay. We never store your full card or wallet credentials on our servers.",
      },
      {
        heading: "4. Cookies",
        body: "We use essential cookies to operate the website and, where you opt in, analytics cookies to understand usage. You can disable non-essential cookies in your browser.",
      },
      {
        heading: "5. Your Rights",
        body: "You may request a copy, correction or deletion of your personal data at any time by contacting our support team.",
      },
    ],
    refund: [
      {
        heading: "1. Money-Back Guarantee",
        body: "Shared, BDIX and Turbo hosting plans include a 7-day money-back guarantee from the purchase date. If you are not satisfied, request a refund within the guarantee window.",
      },
      {
        heading: "2. VPS Refunds",
        body: "VPS services may be refunded pro-rata for the unused portion of the billing period when cancelled within the first 3 days of service.",
      },
      {
        heading: "3. Non-Refundable Items",
        body: "Domain registration, renewal and transfer fees are non-refundable once processed. Third-party add-ons and setup items are non-refundable.",
      },
      {
        heading: "4. How to Request",
        body: "Open a support ticket from your client area or email our billing team. Refunds are processed back to the original payment method within 5–7 business days.",
      },
      {
        heading: "5. Abuse",
        body: "Accounts terminated due to violation of our Acceptable Use Policy or Terms of Service are not eligible for refunds.",
      },
    ],
  },
  footer: {
    description:
      "Cheap Hosting And VPS — fast, affordable and reliable hosting solutions in Bangladesh with 24/7 local support.",
    socials: [
      { label: "Facebook", url: "https://facebook.com/yourcompany" },
      { label: "X", url: "https://x.com/yourcompany" },
      { label: "LinkedIn", url: "https://linkedin.com/company/yourcompany" },
      { label: "YouTube", url: "https://youtube.com/@yourcompany" },
    ],
  },
};
