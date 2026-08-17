import type { SiteContent } from "@/lib/site-types";

/**
 * Default marketing content for CHV HOST.
 * Overridable at runtime via JSON files in ./content/.
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
    { label: "Happy Customers", value: "500", suffix: "+" },
    { label: "Websites Hosted", value: "1,000", suffix: "+" },
    { label: "Uptime", value: "99.9", suffix: "%" },
    { label: "Support Availability", value: "24/7" },
    { label: "Years of Experience", value: "3", suffix: "+" },
  ],
  categories: [
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
      id: "wordpress",
      title: "WordPress Hosting",
      description: "Optimized WordPress hosting with LiteSpeed caching.",
      startingPrice: "৳99/mo",
      icon: "globe",
      href: "/wordpress-hosting",
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
      id: "bdix-vps",
      title: "BDIX VPS / RDP",
      description: "Low-latency VPS and RDP on the local BDIX network.",
      startingPrice: "৳699/mo",
      icon: "map-pin",
      href: "/bdix-vps",
      cta: "Deploy VPS",
    },
    {
      id: "windows-rdp",
      title: "Windows Server RDP",
      description: "Windows remote desktops with admin access.",
      startingPrice: "৳1,199/mo",
      icon: "server",
      href: "/windows-rdp",
      cta: "Get RDP",
    },
    {
      id: "managed-vps",
      title: "Managed VPS",
      description: "Root access with the server managed for you.",
      startingPrice: "৳1,499/mo",
      icon: "shield",
      href: "/managed-vps",
      cta: "Deploy VPS",
    },
    {
      id: "dedicated",
      title: "Dedicated Server",
      description: "Bare-metal servers for serious workloads.",
      startingPrice: "Quote",
      icon: "cpu",
      href: "/dedicated-server",
      cta: "Get a Quote",
    },
    {
      id: "ivac",
      title: "IVAC Service",
      description: "Secure infrastructure for voice automation.",
      startingPrice: "Quote",
      icon: "activity",
      href: "/ivac",
      cta: "Talk to Sales",
    },
    {
      id: "license",
      title: "License",
      description: "Genuine cPanel and Windows licenses, instantly.",
      startingPrice: "৳450/mo",
      icon: "key",
      href: "/license",
      cta: "Browse Licenses",
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
        heading: "Introduction",
        body: 'Welcome to chvhost. Please read these Terms of Service ("Terms", "Agreement") carefully before ordering or using any of our services. By activating an account or purchasing any product from chvhost, you agree to be bound by all terms, conditions, and policies outlined below.',
      },
      {
        heading: "1. Account Setup & Verification",
        items: [
          "Accuracy of Information: Clients must provide accurate, current, and verifiable contact details during registration.",
          "Account Security: You are solely responsible for maintaining the confidentiality of your client portal and server access credentials.",
          "Fraud Prevention: chvhost reserves the right to request identity verification prior to activating services to prevent fraudulent transactions or network abuse.",
        ],
      },
      {
        heading: "2. Services Covered",
        body: "These Terms apply to all product categories hosted on chvhost, including:",
        items: [
          "BDIX Hosting (Shared Hosting / cPanel)",
          "WordPress Hosting",
          "Reseller Hosting",
          "BDIX VPS/RDP",
          "Windows Server RDP",
          "Managed VPS",
          "IVAC Service & Tools",
          "Dedicated Server",
          "License (Software & System Licenses)",
        ],
      },
      {
        heading: "3. Strict 3-Day Conditional Refund Policy",
        body: "SUMMARY: Refunds are issued ONLY for technical defects originating directly from chvhost infrastructure that our support team cannot resolve within 3 days of deployment.",
        subsections: [
          {
            heading: "3.1 Eligibility Criteria",
            body: "You are eligible for a refund within 3 calendar days (72 hours) of your initial purchase ONLY IF:",
            items: [
              "You encounter a technical issue caused directly by chvhost's infrastructure or initial provisioning failure.",
              "You opened a support ticket or contacted thechvhost@gmail.com detailing the issue.",
              "Our technical support team is completely unable to solve or fix the issue within 72 hours.",
            ],
          },
          {
            heading: "3.2 Non-Refundable Scenarios",
            body: "Refunds will NOT be granted under any of the following conditions:",
            items: [
              "Network & Speed Expectations: Dissatisfaction with network speeds, ping/latency, or ISP-specific routing.",
              "Bandwidth Usage: Issues or restrictions related to international bandwidth consumption.",
              "User Misconfiguration: Inability of the client to manage, configure, or use the VPS, RDP, or hosting environment.",
              "Third-Party Services: Software licenses (e.g., cPanel, LiteSpeed, Windows licenses) or IVAC Services once processed or activated.",
              "AUP Violations: Accounts suspended or terminated due to illegal activity, abuse, or breach of our Acceptable Use Policy.",
            ],
          },
        ],
      },
      {
        heading: "4. International Bandwidth & Fair Usage Policy (FUP)",
        items: [
          "Shared Network Allocation: Unless explicitly purchased as a dedicated bandwidth line, all international bandwidth provided across chvhost services is shared among active nodes.",
          "Fair Usage Monitoring: Continuous high-volume saturation of international bandwidth, continuous video re-streaming, or unauthorized public proxying is strictly prohibited.",
          "Bandwidth Capping & Throttling: If account usage breaches Fair Usage Policy (FUP) thresholds or impacts other network tenants, chvhost reserves the right to cap, throttle, or limit port speeds immediately without prior notice.",
        ],
      },
      {
        heading: "5. Backups and Absolute Data Loss Disclaimer",
        body: "CRITICAL DATA NOTICE: chvhost does NOT maintain automated offsite backups, disaster recovery snapshots, or system restores for client services unless explicitly purchased under a separate managed backup service contract.",
        items: [
          "Client Responsibility: The client carries 100% sole responsibility for performing, storing, and managing their own offsite backups, database dumps, website files, and server configurations.",
          "Zero Liability: chvhost shall NOT be held liable under any circumstances for data loss, file corruption, hardware failure, accidental deletion, ransomware infection, or service interruption.",
        ],
      },
      {
        heading: "6. Service Specific Terms",
        subsections: [
          {
            heading: "6.1 IVAC Service Disclaimer",
            body: "Third-Party Portal Dependency: IVAC assistance/services rely entirely on third-party external portals and system availability. chvhost does not control official portal uptime, appointment slot distribution, or application outcomes.",
            items: [
              "No Guarantees: Service charges for IVAC assistance cover setup and system tool processing only. Fees are strictly non-refundable once processing begins, regardless of external portal changes or slot availability.",
            ],
          },
          {
            heading: "6.2 Windows Server RDP & VPS",
            items: [
              "Resource Abuse: CPU-heavy tasks such as unauthorized cryptocurrency mining, video rendering, mass mailing, or continuous stress testing are strictly forbidden on shared RDP nodes.",
              "Software Licensing: Users must comply with standard Microsoft software terms and end-user license agreements.",
            ],
          },
        ],
      },
      {
        heading: "7. Acceptable Use Policy (AUP) & Prohibited Content",
        body: "Services provided by chvhost must be used strictly for lawful purposes. Hosting, transmitting, or linking to any of the following content/activities is strictly illegal and will result in immediate termination without notice or refund:",
        items: [
          "Cyberattacks: Launching, participating in, or relaying DDoS/DoS attacks, IP spoofing, or network port scanning.",
          "Spamming: Sending unsolicited bulk emails (SPAM), mass mailing, or running open mail relays.",
          "Malicious Software: Hosting or distributing malware, trojans, ransomware, keyloggers, or phishing sites.",
          "Copyright Infringement: Hosting pirated software, nulled plugins/scripts, unauthorized torrents, or copyrighted streams.",
          "Illegal Material: Hosting content associated with child exploitation, terrorism, scams, or fraudulent financial schemes.",
        ],
      },
      {
        heading: "8. Service Suspension and Termination",
        body: "chvhost reserves the right to suspend or terminate services without refund if:",
        items: [
          "Invoices remain unpaid past their due date.",
          "The account breaches any clause in these Terms or the Acceptable Use Policy.",
          "Ordered services are targeted by severe incoming DDoS attacks that jeopardize datacenter stability.",
        ],
      },
      {
        heading: "9. Limitation of Liability",
        body: "To the maximum extent permitted by law, chvhost, its operators, and infrastructure partners shall not be held liable for any direct, indirect, incidental, special, or consequential damages (including loss of profits, revenue, or data) arising from the use or inability to use our services.",
      },
      {
        heading: "10. Contact Information & Support",
        body: "If you have questions regarding these Terms, need support, or wish to submit an abuse report, please reach out to us at:",
        items: ["Support / Abuse Email: thechvhost@gmail.com", "Client Portal: billing.chvhost.com"],
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
        heading: "3. Strict 3-Day Conditional Refund Policy",
        body: "SUMMARY: Refunds are issued ONLY for technical defects originating directly from chvhost infrastructure that our support team cannot resolve within 3 days of deployment.",
        subsections: [
          {
            heading: "3.1 Eligibility Criteria",
            body: "You are eligible for a refund within 3 calendar days (72 hours) of your initial purchase ONLY IF:",
            items: [
              "You encounter a technical issue caused directly by chvhost's infrastructure or initial provisioning failure.",
              "You opened a support ticket or contacted thechvhost@gmail.com detailing the issue.",
              "Our technical support team is completely unable to solve or fix the issue within 72 hours.",
            ],
          },
          {
            heading: "3.2 Non-Refundable Scenarios",
            body: "Refunds will NOT be granted under any of the following conditions:",
            items: [
              "Network & Speed Expectations: Dissatisfaction with network speeds, ping/latency, or ISP-specific routing.",
              "Bandwidth Usage: Issues or restrictions related to international bandwidth consumption.",
              "User Misconfiguration: Inability of the client to manage, configure, or use the VPS, RDP, or hosting environment.",
              "Third-Party Services: Software licenses (e.g., cPanel, LiteSpeed, Windows licenses) or IVAC Services once processed or activated.",
              "AUP Violations: Accounts suspended or terminated due to illegal activity, abuse, or breach of our Acceptable Use Policy.",
            ],
          },
        ],
      },
      {
        heading: "4. Non-Refundable Items",
        body: "Domain registration, renewal and transfer fees are non-refundable once processed. Third-party add-ons and setup items are non-refundable.",
      },
      {
        heading: "5. How to Request",
        body: "Open a support ticket from your client area or email our billing team. Refunds are processed back to the original payment method within 5–7 business days.",
      },
      {
        heading: "6. Abuse",
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
