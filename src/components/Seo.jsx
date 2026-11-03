import { Helmet } from 'react-helmet-async';

// Reproduces the original page's <title>, meta description, robots, canonical and OG/Twitter tags.
// Tags the live page did not have are not added.
export default function Seo({ title, description, robots, canonical, og = {}, twitter = {} }) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {robots && <meta name="robots" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {Object.entries(og).map(([property, content]) => (
        <meta key={property} property={property} content={content} />
      ))}
      {Object.entries(twitter).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}
    </Helmet>
  );
}
