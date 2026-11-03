// Route "/services/" — verbatim from docs/inventory.md (WordPress page 1112).
import home from './home.js';

export default {
  seo: {
    title: 'Services – theaccountingxchange.com',
    description: null,
    robots: 'max-image-preview:large',
    canonical: 'https://theaccountingxchange.com/services/',
  },
  // Same hero copy/image/badges as the homepage; the button differs.
  hero: { ...home.hero, button: { label: 'Contact Us', href: '#contact' } },
  whatWeDo: {
    title: 'What we do: Bookkeeping and Tax Preparation',
    intro: 'Accurate bookkeeping and strategic tax preparation to keep your finances organized, compliant, and stress-free year-round.',
    button: { label: 'Contact Us', href: '#contact' },
    items: [
      { icon: '/assets/uploads/2026/01/payable.png', alt: '', title: 'Accounts payable', text: 'Processing supplier invoices and setting up payment batches.' },
      { icon: '/assets/uploads/2026/01/budgeting.png', alt: '', title: 'Accounts receivable', text: 'Preparation of invoices and sending to clients and collection reminders.' },
      {
        icon: '/assets/uploads/2026/01/clean-up.png',
        alt: '',
        title: 'Correcting mistakes and cleaning up messes',
        text: 'Not all bookkeepers are created equal, however the Accounting Xchange bookkeepers are the best available and can sort out any mistakes that you might be facing',
      },
      { icon: '/assets/uploads/2026/01/payment.png', alt: '', title: 'Bank reconciliations and Credit Card processing', text: 'Ensuring correct bank feeds into your system and your accounts reconcile.' },
      {
        icon: '/assets/uploads/2026/01/approve.png',
        alt: '',
        title: 'Individual (1040/1041)',
        text: 'We gather and organize all necessary financial documents like W-2s, 1099s, and records for our tax preparation service. Our thorough review ensures accurate reporting of income and deductions, maximizing tax credits and deductions for our clients.',
      },
      {
        icon: '/assets/uploads/2026/01/financial.png',
        alt: '',
        title: 'Corporation (1120/1120s)',
        text: 'We collect and organize essential financial documents such as income statements and balance sheets for our tax preparation service. Our review ensures accurate reporting of income and deductions, maximizing tax benefits for the corporation.',
      },
      {
        icon: '/assets/uploads/2026/01/escrow.png',
        alt: '',
        title: 'Partnership (1065)',
        text: 'We collect and organize vital financial documents like income statements and balance sheets for our tax preparation service. Our review guarantees accurate reporting of income and deductions, optimizing tax benefits for the partnership.',
      },
    ],
  },
  benefits: {
    title: 'With Accounting Xchange, You...',
    items: [
      { icon: '/assets/uploads/2026/03/multitasking.png', alt: '', text: 'Gain the ability to outsource individual, fiduciary, entity and tax-exempt filings.' },
      { icon: '/assets/uploads/2026/03/team.png', alt: '', text: 'Work with a dedicated team, including supervisors who each have 15+years of tax compliance experience.' },
      { icon: '/assets/uploads/2026/03/shield.png', alt: '', text: 'Use a system with qualified SOC II compliance and security.' },
      { icon: '/assets/uploads/2026/03/goal.png', alt: '', text: 'Know that Accounting Xchange accuracy was at 99% during the 2020 filing year.' },
      { icon: '/assets/uploads/2026/03/refresh.png', alt: '', text: 'Benefits from 24-48 hour or less turnaround time on 95% of returns.' },
      { icon: '/assets/uploads/2026/03/paper.png', alt: '', text: 'Receive all annotated workpapers and a detailed summary after preparation and review.' },
      { icon: '/assets/uploads/2026/03/engineering.png', alt: '', text: 'Maintain existing firm processes and hierarchy.' },
      { icon: '/assets/uploads/2026/03/business-model.png', alt: '', text: 'Gain predictability around cost with simple pricing model.' },
      { icon: '/assets/uploads/2026/03/computer.png', alt: '', text: 'Keep all your existing software. Accounting Xchange will not require you to change your tax prep software.' },
    ],
    button: { label: 'Contact Us', href: '#contact' },
  },
  staffing: {
    eyebrow: 'Staffing & Efficiency',
    title: "Reclaim your team's bandwidth",
    intro: 'Accounting Xchange handles the returns so your staff can focus on high-value work.',
    highlight: 'Returns back in 12 to 36 hours',
    items: [
      { icon: '/assets/uploads/2026/03/graph.png', alt: '', title: 'Less seasonal pressure', text: 'Outsource returns as they come in and eliminate the busy-season crunch.' },
      { icon: '/assets/uploads/2026/03/badge.png', alt: '', title: 'Expert preparers on demand', text: 'Experienced tax professionals prepare returns with review notes included.' },
      { icon: '/assets/uploads/2026/03/growth.png', alt: '', title: 'Room to grow', text: 'Reduce long-term staffing constraints that hold practices back.' },
    ],
  },
  security: {
    eyebrow: 'CYBERSECURITY',
    title: 'Enterprise-grade security, fully managed',
    intro: 'Scalable protection against modern threats, around the clock.',
    features: [
      'Real-time threat detection',
      'Dashboard visibility & monitoring',
      'Threat intelligence & prediction',
      'Automated compliance reports',
      'Advanced vulnerability management',
      '24x7x365 security operations center',
      'Clean-rooms (no printers, phones, or paper)',
    ],
    credentialsTitle: 'Our offshore office (Advance Finserv) is fully credentialed:',
    credentials: ['Cyber Security Insurance', 'ISO Certified', 'Professional Indemnity E&O', 'PTIN Staff', 'Rigorous background checks'],
  },
  contact: {
    title: 'Ready to Get Started? Contact Our Team Now',
    form: { postId: '1112', formId: '292a18e', refererTitle: 'Services', queriedId: '1112' },
  },
};
