// Shared header + footer content, verbatim from docs/inventory.md ("Shared header & footer").
export const ORIGIN = 'https://theaccountingxchange.com';

export const logo = {
  src: '/assets/uploads/2024/02/Untitled-600-x-150-px-1-2-300x75.png',
  srcSet: '/assets/uploads/2024/02/Untitled-600-x-150-px-1-2-300x75.png 300w, /assets/uploads/2024/02/Untitled-600-x-150-px-1-2.png 600w',
  alt: '',
  width: 300,
  height: 75,
  href: 'https://theaccountingxchange.com/',
};

export const nav = [
  { label: 'Home', href: 'https://theaccountingxchange.com/' },
  { label: 'Services', href: 'https://theaccountingxchange.com/services/' },
  { label: 'About Us', href: 'https://theaccountingxchange.com/about-us/' },
  { label: 'Contact Us', href: 'https://theaccountingxchange.com/contact-us/' },
];

export const menuToggleLabel = 'Menu Toggle';

export const headerIcons = [
  { label: 'Phone-alt', icon: 'fas-phone-alt', href: 'https://go.theaccountingxchange.com/book-ax-call-now609488', target: '_blank' },
  // Live site link is missing "mailto:" (kept as-is per hard rule 4; flagged in the deliverable report)
  { label: 'Envelope', icon: 'fas-envelope', href: 'http://info@theaccountingxchange.com', target: '_blank' },
];

export const footer = {
  heading: 'HOW CAN WE HELP YOUR BUSINESS?',
  button: { label: 'Arrange A Free Consultation', href: 'https://theaccountingxchange.com/contact-us/' },
  addressLines: ['Address : 801 International Pkwy 5th Floor', 'Lake Mary, FL 32746', '(407) 792-5447', 'info@theaccountingxchange.com'],
  socials: [
    { label: 'Facebook', icon: 'fab-facebook', href: 'https://www.facebook.com/profile.php?id=61556458799517', target: '_blank' },
    { label: 'Twitter', icon: 'fab-twitter', href: 'https://twitter.com/accountingxcnge', target: '_blank' },
    { label: 'Youtube', icon: 'fab-youtube', href: 'https://www.youtube.com/@TheAccountingXchange', target: '_blank' },
  ],
};

// Elementor Pro form (same widget on /, /about-us/, /services/). Submissions go to the original WordPress handler.
export const elementorForm = {
  name: 'New Form',
  ajaxUrl: 'https://theaccountingxchange.com/wp-admin/admin-ajax.php',
  action: 'elementor_pro_forms_send_form',
  fields: [
    { name: 'form_fields[name]', id: 'form-field-name', type: 'text', placeholder: 'Name', required: false },
    { name: 'form_fields[field_89de431]', id: 'form-field-field_89de431', type: 'email', placeholder: 'Email', required: true },
    { name: 'form_fields[message]', id: 'form-field-message', type: 'textarea', placeholder: 'Message', required: false },
  ],
  submitLabel: 'Submit',
  // Elementor Pro's default response messages (the live form returns these from WordPress; not visible in the static HTML)
  messages: {
    success: 'Your submission was successful.',
    error: 'Your submission failed because of an error.',
  },
};
