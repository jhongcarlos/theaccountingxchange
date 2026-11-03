// Route "/contact-us/" — verbatim from docs/inventory.md (WordPress page 63).
// The page image /wp-content/uploads/2024/03/contact-us-1.png returns 404 on the live server, so it
// cannot be migrated (see docs/inventory.md "Asset summary").
export default {
  seo: {
    title: 'Contact Us – theaccountingxchange.com',
    description: null,
    robots: 'max-image-preview:large',
    canonical: 'https://theaccountingxchange.com/contact-us/',
  },
  hero: {
    title: 'CONTACT US',
    intro: 'For a high-performing onshore-offshore team, feel free to contact us.',
  },
  map: {
    src: 'https://maps.google.com/maps?q=801%20International%20Pkwy%205th%20Floor%2C%20Lake%20Mary%2C%20FL%2032746&t=m&z=10&output=embed&iwloc=near',
    title: '801 International Pkwy 5th Floor, Lake Mary, FL 32746',
  },
  addressLines: ['Address :', '801 International Pkwy 5th Floor', 'Lake Mary, FL 32746', '(407) 792-5447', 'info@theaccountingxchange.com'],
  links: [
    { label: '(407) 792-5447', href: 'tel:407%20792-5447', icon: 'fas-phone-alt' },
    // Live link is missing "mailto:" (kept as-is per hard rule 4)
    { label: 'info@theaccountingxchange.com', href: 'http://info@theaccountingxchange.com', icon: 'fas-envelope' },
  ],
  // LeadConnector booking widget, original embed (iframe id + resize script)
  booking: {
    src: 'https://api.leadconnectorhq.com/widget/booking/kEYol5LayUnQ27iPPKXK',
    id: 'NbwMS21aYKh7PakD7TeN_1771947442468',
    script: 'https://link.msgsndr.com/js/form_embed.js',
  },
};
