// Route "/pricing/" — verbatim from docs/inventory.md (WordPress page 1049).
export default {
  seo: {
    title: 'Pricing – theaccountingxchange.com',
    description: null,
    robots: 'max-image-preview:large',
    canonical: 'https://theaccountingxchange.com/pricing/',
  },
  hero: {
    title: 'Pricing',
    intro: 'Choose the offshore accounting package that fits your needs today and grow with us tomorrow. No surprises, just straightforward pricing.',
  },
  packages: [
    {
      icon: 'fas-calculator',
      title: 'STARTER ACCOUNTING PACKAGE',
      tagline: 'Ideal for small or early-stage businesses.',
      features: ['8 hours/month of offshore accounting', '$16/hour'],
      fee: 'Monthly Fee: $131.84',
      button: { label: 'Get Started', href: 'https://theaccountingxchange.com/contact-us/' },
    },
    {
      icon: 'fas-asterisk',
      title: 'STANDARD ACCOUNTING PACKAGE',
      tagline: 'Perfect for growing businesses needing steady support.',
      features: ['16 hours/month of offshore accounting', '$16/hour'],
      fee: 'Monthly Fee: $263.68',
      button: { label: 'Get Started', href: 'https://theaccountingxchange.com/contact-us/' },
    },
    {
      icon: 'fas-chart-bar',
      title: 'PREMIUM ACCOUNTING PACKAGE',
      tagline: 'Designed for businesses with higher transaction volume or more complex needs.',
      features: ['32 hours/month of offshore accounting', '$16/hour'],
      fee: 'Monthly Fee: $527.36',
      button: { label: 'Get Started', href: 'https://theaccountingxchange.com/contact-us/' },
    },
  ],
  assistant: {
    eyebrow: 'Need More Than Accounting?',
    title: 'Add Virtual Assistant Support to Any Package',
    intro: 'Handle administrative tasks, scheduling, client follow-ups, and operational support with a dedicated virtual assistant.',
    cardTitle: 'Virtual Assistant Add-On',
    features: ['$100/month', '10 hours of VA support per month', '$10/hour rate', 'Minimum 10 hours/month required', 'Add to any accounting package'],
    button: { label: 'Get Started', href: 'https://theaccountingxchange.com/contact-us/' },
    image: {
      src: '/assets/uploads/2026/02/john-macdonald-I6v9QWWH93g-unsplash-1024x1024.jpg',
      srcSet:
        '/assets/uploads/2026/02/john-macdonald-I6v9QWWH93g-unsplash-600x600.jpg 600w, /assets/uploads/2026/02/john-macdonald-I6v9QWWH93g-unsplash-1024x1024.jpg 1024w, /assets/uploads/2026/02/john-macdonald-I6v9QWWH93g-unsplash-1536x1536.jpg 1536w, /assets/uploads/2026/02/john-macdonald-I6v9QWWH93g-unsplash-2048x2048.jpg 2048w',
      alt: '',
    },
  },
  why: {
    title: 'Why Choose The Accounting Xchange?',
    steps: [
      { number: '1', title: 'Transparent Pricing', text: 'No hidden fees. No surprises. Just straightforward monthly rates that fit your budget.' },
      { number: '2', title: 'Flexible & Scalable', text: 'Start small and scale up as your business grows. Upgrade or downgrade anytime.' },
      { number: '3', title: 'Quality Talent', text: 'Every team member is thoroughly vetted, trained, and ready to integrate with your firm.' },
      { number: '4', title: 'Seamless Integration', text: 'Our offshore professionals work in your timezone and with your existing tools and processes.' },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    // aria-label of the original Elementor nested-accordion widget
    ariaLabel: 'Accordion. Open links with Enter or Space, close with Escape, and navigate with Arrow Keys',
    items: [
      { q: 'Can I switch packages?', a: 'Yes. Upgrade or downgrade your package anytime to match your changing needs.' },
      { q: 'What if I need more hours in a given month?', a: 'We can accommodate additional hours beyond your package on a flexible basis. Contact us to discuss your needs.' },
      { q: 'How quickly can I get started?', a: 'Most clients are matched with their offshore accounting professional within 1-2 weeks of signing up.' },
      { q: 'Do you offer custom packages?', a: "Absolutely. If none of these packages fit your needs, we'll create a custom solution for you." },
    ],
  },
  cta: {
    title: 'Ready to Get Started?',
    text: 'Stop overpaying for accounting help. Get the support you need at a price that makes sense.',
    button: { label: 'Schedule a Call', href: 'https://theaccountingxchange.com/contact-us/' },
  },
};
