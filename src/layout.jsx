import { useState, useEffect, useCallback } from 'react';
import Header from './header';
import Footer from './footer';

function Layout({ children }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex flex-col background-theme">
        {children}
      </main>

      <Footer />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 bg-linear-to-br from-[#1a3a6d] to-[#2e5a9a] text-white border border-[#203454] rounded-lg w-9 h-9 text-xl cursor-pointer outline-none shadow-[3px_3px_5px_#203454,-1px_-1px_2px_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_6px_#1a2c4a,-1px_-1px_2px_rgba(0,0,0,0.3)] hover:bg-linear-to-br hover:from-[#204a7d] hover:to-[#3b6db1] active:shadow-[inset_2px_2px_4px_#1a2c4a] transition-all duration-200 ease-in-out flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0.5"
          aria-label="Scroll to top"
        >
          <span className="leading-none font-patrick">{"\u2B06"}</span>
        </button>
      )}
    </div>
  );
}

export default Layout;