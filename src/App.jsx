import { Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import PageTransition from './components/PageTransition.jsx';
import { LenisProvider, useScrollReset } from './hooks/useLenis.js';
import { pages, pending, redirects } from './routes.js';

// WordPress serves every page with a trailing slash; /about-us -> /about-us/.
function TrailingSlash() {
  const { pathname, search, hash } = useLocation();
  return <Navigate to={`${pathname}/${search}${hash}`} replace />;
}

function Shell() {
  const location = useLocation();
  useScrollReset(location.pathname, location.hash);
  const needsSlash = !location.pathname.endsWith('/');

  return (
    <>
      <a href="#content" title="Skip to content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-brand-navy">
        Skip to content
      </a>
      <Header />
      <main id="content">
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="min-h-screen bg-brand-navy" />} key={location.pathname}>
            <Routes location={location}>
              {needsSlash && <Route path="*" element={<TrailingSlash />} />}
              {pages.map(({ path, Component }) => (
                <Route key={path} path={path} element={<PageTransition><Component /></PageTransition>} />
              ))}
              {import.meta.env.DEV &&
                pending.map((path) => (
                  <Route key={path} path={path} element={<div className="grid min-h-[70vh] place-items-center bg-brand-navy pt-24 font-sans text-white/60">[dev] {path} not rebuilt yet</div>} />
                ))}
              {Object.entries(redirects).map(([from, to]) => (
                <Route key={from} path={from} element={<Navigate to={to} replace />} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LenisProvider>
      <Shell />
    </LenisProvider>
  );
}
