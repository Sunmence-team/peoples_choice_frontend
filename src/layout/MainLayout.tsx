import React, { useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useLocation } from "react-router-dom";
import TopNav from "../components/navs/TopNav";
import BottomNav from "../components/navs/BottomNav";
import Sidebar from "../components/navs/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
  pageName: string;
};

const MainLayout = ({ children, pageName }: LayoutProps) => {
  useEffect(() => {
    document.title = `Peoples Choice Bank | ${pageName}`;
  }, [pageName]);

  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement | null>(null);
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.0,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 1.0,
        ease: "easeInOut",
      },
    },
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const style = document.createElement("style");
    style.textContent = `
      .main-content {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overflow-anchor: none;
          scroll-padding-top: 80px;
          overscroll-behavior-y: contain;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useLayoutEffect(() => {
    const scrollToTop = () => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        if (mainContentRef.current?.scrollTop !== 0) {
          mainContentRef.current?.scrollTo(0, 0);
        }
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      }, 300);
    };

    const rafId = requestAnimationFrame(() => {
      scrollToTop();
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  return (
    <div className="flex flex-col w-full relative! bg-secondary/80 h-dvh overflow-hidden">
      <div className="md:px-6 py-2 px-4 flex md:flex gap-4 sticky top-0 z-10 items-center bg-white">
        <TopNav />
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="hidden lg:block lg:w-[20%] h-full shrink-0 overflow-hidden">
          <Sidebar />
        </div>
        <div className={`lg:w-[80%] w-full h-full overflow-hidden`}>
          <div
            ref={mainContentRef}
            className={`h-full`}
            style={{
              minHeight: "0",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorY: "contain",
            }}
            tabIndex={-1}
          >
            <AnimatePresence mode="wait">
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                style={{
                  minHeight: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                className="px-4 pt-2 h-full overflow-y-scroll no-scrollbar pb-4"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MainLayout;
