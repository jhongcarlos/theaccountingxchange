// Route "/" — verbatim from docs/inventory.md (WordPress page 977).
export default {
  seo: {
    title: 'theaccountingxchange.com',
    description: null,
    robots: 'max-image-preview:large',
    canonical: 'https://theaccountingxchange.com/',
  },
  hero: {
    title: 'Onshore / Offshore Accounting Services',
    subtitle: 'Done-for-you accounting for less than a full-time hire',
    image: {
      src: '/assets/uploads/2026/01/Untitled-design-8-1-1024x1024.png',
      srcSet:
        '/assets/uploads/2026/01/Untitled-design-8-1-1024x1024.png 1024w, /assets/uploads/2026/01/Untitled-design-8-1-300x300.png 300w, /assets/uploads/2026/01/Untitled-design-8-1-768x768.png 768w, /assets/uploads/2026/01/Untitled-design-8-1-600x600.png 600w, /assets/uploads/2026/01/Untitled-design-8-1.png 1080w',
      alt: '',
      width: 900,
      height: 900,
    },
    badges: [
      { icon: '/assets/uploads/2026/01/piggy-bank.png', alt: '', title: 'Save money' },
      { icon: '/assets/uploads/2026/01/24-7.png', alt: '', title: 'Access 24/7 service' },
      { icon: '/assets/uploads/2026/01/productivity.png', alt: '', title: 'Boost team efficiency' },
    ],
    button: { label: 'Book a Free Consultation', href: 'https://theaccountingxchange.com/contact-us/' },
  },
  workspace: {
    title: 'Discover Our Workspace',
    // "300" is animated with CountUp; the rendered text is identical
    intro: { before: 'Our workspace in India, housing a team of over ', count: 300, after: ' staff members.' },
    video: { youtube: 'https://youtu.be/2GcE14W3Xo0', id: '2GcE14W3Xo0' },
  },
  why: {
    title: 'Why Choose Onshore / Offshore Accounting?',
    items: [
      {
        icon: '/assets/uploads/2026/01/loss.png',
        alt: '',
        title: 'Cost Savings',
        description:
          'Your overhead is killing your margins. Offshore accounting staff cost 60-70% less than US hires, freeing up budget to grow your client base instead of just covering payroll. Same expertise, smarter economics.',
      },
      {
        icon: '/assets/uploads/2026/01/growth.png',
        alt: '',
        title: 'Scale Without the Growing Pains',
        description:
          "Tax season shouldn't mean panic hiring and training rookies. Our offshore team absorbs your overflow instantly with no recruiting, no onboarding, no benefits administration. Just experienced preparers ready to work.",
      },
      {
        icon: '/assets/uploads/2026/01/cogs.png',
        alt: '',
        title: 'Work Never Stops',
        description:
          'While you sleep, your offshore team is prepping returns and reconciling accounts. Hand off work at 5 PM, review completed files by 9 AM. Double your output without doubling your hours.',
      },
    ],
    button: { label: 'Book a Free Consultation', href: 'https://theaccountingxchange.com/contact-us/' },
  },
  contact: {
    title: 'Ready to Get Started? Contact Our Team Now',
    form: { postId: '977', formId: '34dfa48', refererTitle: '', queriedId: '977' },
  },
};
