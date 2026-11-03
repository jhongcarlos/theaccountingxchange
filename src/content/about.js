// Route "/about-us/" — verbatim from docs/inventory.md (WordPress page 1150).
export default {
  seo: {
    title: 'About Us – theaccountingxchange.com',
    description: null,
    robots: 'max-image-preview:large',
    canonical: 'https://theaccountingxchange.com/about-us/',
  },
  hero: {
    title: 'The team behind your extended accounting practice',
    subtitle: 'We manage your compliance staffing so you can focus on delivering exceptional service to your clients.',
    image: {
      src: '/assets/uploads/2026/03/premium_photo-1661456318819-f5260d12ad6f.jpg',
      srcSet:
        '/assets/uploads/2026/03/premium_photo-1661456318819-f5260d12ad6f-300x300.jpg 300w, /assets/uploads/2026/03/premium_photo-1661456318819-f5260d12ad6f-600x600.jpg 600w, /assets/uploads/2026/03/premium_photo-1661456318819-f5260d12ad6f-768x768.jpg 768w, /assets/uploads/2026/03/premium_photo-1661456318819-f5260d12ad6f.jpg 880w',
      alt: '',
      width: 880,
      height: 880,
    },
    badges: [
      { icon: '/assets/uploads/2026/01/piggy-bank.png', alt: '', title: 'Save money' },
      { icon: '/assets/uploads/2026/01/24-7.png', alt: '', title: 'Access 24/7 service' },
      { icon: '/assets/uploads/2026/01/productivity.png', alt: '', title: 'Boost team efficiency' },
    ],
    button: { label: 'BOOK A FREE CONSULTATION', href: '#contact' },
  },
  why: {
    title: 'WHY CHOOSE ONSHORE / OFFSHORE ACCOUNTING?',
    intro:
      'Accounting Xchange is a premier onshore-offshore expert team, helping CPAs, EAs, and accounting firms streamline operations, boost efficiency, and stabilize staff bandwidth so you can focus on delivering exceptional service to your clients.',
    items: [
      { icon: '/assets/uploads/2026/03/salary.png', alt: '', title: 'Cost Savings', text: 'Offshore accounting staff cost 60–70% less than US hires; same expertise, smarter economics.' },
      // "99" is animated with CountUp; the rendered title is "99% Accuracy"
      { icon: '/assets/uploads/2026/03/analytics.png', alt: '', title: '99% Accuracy', count: { value: 99, suffix: '%', rest: ' Accuracy' }, text: 'Verified accuracy rate during the 2020 filing year, with annotated workpapers and detailed summaries on every return.' },
      { icon: '/assets/uploads/2026/03/onboarding.png', alt: '', title: 'Work Never Stops', text: 'Hand off at 5 PM, review completed files by 9 AM. Your offshore team keeps moving while you rest.' },
      { icon: '/assets/uploads/2026/03/growth.png', alt: '', title: 'Scale Without the Growing Pains', text: 'No panic hiring. No onboarding. Our team absorbs your overflow instantly with experienced preparers ready to work.' },
      { icon: '/assets/uploads/2026/03/compliant.png', alt: '', title: 'SOC II Compliant', text: "Your clients' data is protected under rigorous security protocols, cyber insurance, and background-checked staff with current PTINs." },
      { icon: '/assets/uploads/2026/03/software.png', alt: '', title: 'Your Software. Your Process.', text: 'Proficient in all major US tax and accounting platforms. No training required, no disruption to your workflow.' },
    ],
  },
  team: {
    eyebrow: 'MEET THE TEAM',
    title: 'The people who keep your firm running smoothly',
    members: [
      {
        name: 'ROBERT ZAYAS',
        role: 'Managing Director',
        photo: '/assets/uploads/2026/03/RZ_Profile_Pic_-_NEW-600x600.png',
        photoFull: '/assets/uploads/2026/03/RZ_Profile_Pic_-_NEW.png',
        alt: '',
        bio: 'Robert is a seasoned accountant with over 20 years of experience specializing in taxation. A Berkeley College graduate, he has built a reputation as a trusted advisor; helping individuals and businesses navigate complex tax codes, minimize liabilities, and achieve their financial goals. Beyond the firm, Robert actively engages in his local community to promote financial literacy and empower individuals to take control of their finances.',
        memberships: {
          label: 'Memberships',
          text: ': Accredited Tax Preparer — Accreditation Council of Accountancy and Taxation · Member, National Society of Accountants · Member, National Association of Tax Professionals',
        },
      },
      {
        name: 'JOYCE',
        role: 'VP (Director)',
        photo: '/assets/uploads/2026/03/Joyce_Profile_Pic-600x600.jpeg',
        photoFull: '/assets/uploads/2026/03/Joyce_Profile_Pic.jpeg',
        alt: '',
        bio: "Joyce is the face of Accounting Xchange. With a background in hospitality leadership, she brings a rare focus on client experience to the accounting world, ensuring every interaction reflects the firm's commitment to professionalism and client satisfaction. From client events to the firm's online presence, her warmth and creativity keep relationships strong.",
      },
      {
        name: 'RYAN',
        role: 'Operations Manager',
        photo: '/assets/uploads/2026/03/REZ_Profile_Pic-600x600.png',
        photoFull: '/assets/uploads/2026/03/REZ_Profile_Pic.png',
        alt: '',
        bio: "Ryan oversees all aspects of offshore project coordination from initiation to completion. His deep understanding of distributed operations ensures every project is delivered on time and within budget. Thriving in fast-paced environments, Ryan's commitment to quality and precision keeps the operation running without friction.",
      },
      {
        name: 'SHOBHIT',
        role: 'Offshore Partner',
        photo: '/assets/uploads/2026/03/Shobhit-600x600.png',
        photoFull: '/assets/uploads/2026/03/Shobhit.png',
        alt: '',
        bio: 'Shobhit is an experienced bookkeeping and accounting professional with deep expertise in US client standards. His commitment to excellence and dedication to current industry best practices make him a highly sought-after member of the offshore team.',
      },
      {
        name: 'GAURAV',
        role: 'Offshore Tax Manager',
        photo: '/assets/uploads/2026/03/Gaurav-sharma-1-600x600.png',
        photoFull: '/assets/uploads/2026/03/Gaurav-sharma-1.png',
        alt: '',
        bio: "Gaurav has prepared and managed over 10,000 US tax returns for clients with international tax obligations. His meticulous approach to planning and deep knowledge of US tax regulations ensure clients' liabilities are minimized while maintaining full compliance.",
      },
    ],
  },
  contact: {
    title: 'Ready to Get Started? Contact Our Team Now',
    form: { postId: '1150', formId: '018b311', refererTitle: 'About Us', queriedId: '1150' },
  },
};
