import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useDashboard } from "../../hooks/useDashboard";
import StatCard from "../common/StatCard";

// Define gradient colors for each stat card with modern glass effect
const CARD_GRADIENTS = [
  'from-blue-500 via-blue-600 to-blue-700',      // Total Customers
  'from-green-500 via-emerald-600 to-teal-700',  // Promotion Status
  'from-orange-500 via-orange-600 to-red-600',   // Total Priority Customer
  'from-purple-500 via-purple-600 to-indigo-700',// Priority Customer Avg. Balance
  'from-pink-500 via-rose-600 to-pink-700',      // Total Successful Credits
];

const Statusbar = () => {
  const { statsData, isLoading } = useDashboard();

  const [_animate, setAnimate] = useState({});
  const [_scrolled, setScrolled] = useState(false);
  const [_navHeight, setNavHeight] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (statsData && statsData.length > 0) {
      const timer = setTimeout(() => {
        statsData.forEach((stat, index) => {
          setTimeout(() => {
            setAnimate((prev) => ({ ...prev, [stat.id]: true }));
          }, index * 200);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [statsData]);

  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        const height = nav.getBoundingClientRect().height;
        setNavHeight(height);
      }
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
    };

    updateNavHeight();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateNavHeight);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateNavHeight);
    };
  }, []);

  // Helper function to truncate long numbers without using K/M suffix
  const formatValue = (value) => {
    const str = String(value);
    
    // For very long strings (like long decimals), truncate them
    if (str.length > 12) {
      return str.substring(0, 12) + '...';
    }
    
    return str;
  };

  if (isLoading) {
    return (
      <>
        {/* mobile loading */}
        <div className="w-full bg-[#F3E8FF] p-4 rounded-lg shadow-sm flex gap-3 overflow-x-auto lg:hidden scrolling-touch show-scrollbar" 
             style={{ WebkitOverflowScrolling: 'touch' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-36 h-20 rounded-lg bg-purple-200/40 animate-pulse" />
          ))}
        </div>

        {/* desktop loading */}
        <div className="hidden lg:block w-full bg-[#F3E8FF] p-8 rounded-2xl">
          <div className="grid grid-cols-3 gap-5 mb-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-purple-300 rounded-xl animate-pulse"></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-5 w-2/3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-40 bg-purple-300 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* mobile view */}
      <div className="w-full bg-[#F3E8FF] p-5 rounded-lg shadow-sm lg:hidden">
        <div className="grid grid-cols-3 grid-rows-2 gap-3 w-full">
          {statsData.slice(0, 5).map((item, idx) => {
            const trendRaw = item.trend;
            const trendStr = trendRaw === undefined || trendRaw === null ? '' : String(trendRaw).toLowerCase();
            const isUp = typeof trendRaw === 'number' ? trendRaw > 0 : trendStr.includes('up') || trendStr.includes('+');
            const isDown = typeof trendRaw === 'number' ? trendRaw < 0 : trendStr.includes('down') || trendStr.includes('-');
            const cardKey = `mobile-${idx}`;

            return (
              <div
                key={item.id || idx}
                className={`relative w-full h-20 rounded-lg p-3 text-white flex flex-col justify-between overflow-visible
                  bg-gradient-to-br ${CARD_GRADIENTS[idx]} 
                  cursor-pointer group transition-all duration-300`}
                onMouseEnter={() => setHoveredCard(cardKey)}
                onMouseLeave={() => setHoveredCard(null)}>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <div className="relative text-lg font-bold leading-5 truncate" title={String(item.value)}>
                      {formatValue(item.value)}
                      {/* Tooltip - positioned to the right of cursor */}
                      {hoveredCard === cardKey && formatValue(item.value) !== String(item.value) && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900/95 text-white text-xs px-3 py-2 rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none">
                          {item.value}
                        </div>
                      )}
                    </div>
                    {(isUp || isDown) && (
                      <div className="shrink-0">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                          bg-white/30 shadow-sm transition-all duration-300
                          group-hover:scale-110 group-hover:rotate-12`}>
                          {isUp ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-white/90 truncate mt-1">
                    {item.title}
                  </div>
                </div>

                {/* Hover overlay for color change */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300 rounded-lg"></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* desktop view */}
      <div className="hidden lg:block w-full bg-[#F3E8FF] p-8 rounded-2xl shadow-sm">
        {/* Row 1: 3 columns */}
        <div className="grid grid-cols-3 gap-5 mb-5">
          {statsData.slice(0, 3).map((item, index) => {
            const trendRaw = item.trend;
            const trendStr = trendRaw === undefined || trendRaw === null ? '' : String(trendRaw).toLowerCase();
            const isUp = typeof trendRaw === 'number' ? trendRaw > 0 : trendStr.includes('up') || trendStr.includes('+');
            const isDown = typeof trendRaw === 'number' ? trendRaw < 0 : trendStr.includes('down') || trendStr.includes('-');
            const cardKey = `desktop-top-${index}`;

            return (
              <div
                key={item.id || index}
                className={`relative h-40 rounded-xl p-6 text-white flex flex-col justify-between overflow-visible
                  bg-gradient-to-br ${CARD_GRADIENTS[index]}
                  cursor-pointer group transition-all duration-300`}
                onMouseEnter={() => setHoveredCard(cardKey)}
                onMouseLeave={() => setHoveredCard(null)}>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="text-sm font-semibold text-white/90 mb-2">
                        {item.title}
                      </div>
                      <div className="relative text-3xl font-bold leading-none truncate" title={String(item.value)}>
                        {formatValue(item.value)}
                        {/* Tooltip - positioned to the right of the number */}
                        {hoveredCard === cardKey && formatValue(item.value) !== String(item.value) && (
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900/95 text-white text-base px-4 py-2 rounded-md shadow-2xl whitespace-nowrap z-50 pointer-events-none">
                            {item.value}
                          </div>
                        )}
                      </div>
                    </div>
                    {(isUp || isDown) && (
                      <div className="shrink-0">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl
                          bg-white/30 shadow-sm transition-all duration-300
                          group-hover:scale-110 group-hover:rotate-12`}>
                          {isUp ? (
                            <ArrowUpRight className="w-5 h-5 text-white" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-white" />
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative bottom line */}
                  <div className="w-12 h-1 bg-white/40 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>

                {/* Hover overlay for color change */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300 rounded-xl"></div>
              </div>
            );
          })}
        </div>

        {/* Row 2: 2 columns */}
        <div className="grid grid-cols-3 gap-5 w-full">
          {statsData.slice(3, 5).map((item, index) => {
            const trendRaw = item.trend;
            const trendStr = trendRaw === undefined || trendRaw === null ? '' : String(trendRaw).toLowerCase();
            const isUp = typeof trendRaw === 'number' ? trendRaw > 0 : trendStr.includes('up') || trendStr.includes('+');
            const isDown = typeof trendRaw === 'number' ? trendRaw < 0 : trendStr.includes('down') || trendStr.includes('-');
            const cardKey = `desktop-bottom-${index}`;

            return (
              <div
                key={item.id || index}
                className={`relative h-40 rounded-xl p-6 text-white flex flex-col justify-between overflow-visible
                  bg-gradient-to-br ${CARD_GRADIENTS[index + 3]}
                  cursor-pointer group transition-all duration-300`}
                onMouseEnter={() => setHoveredCard(cardKey)}
                onMouseLeave={() => setHoveredCard(null)}>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="text-sm font-semibold text-white/90 mb-2">
                        {item.title}
                      </div>
                      <div className="relative text-3xl font-bold leading-none truncate" title={String(item.value)}>
                        {formatValue(item.value)}
                        {/* Tooltip - positioned to the right of the number */}
                        {hoveredCard === cardKey && formatValue(item.value) !== String(item.value) && (
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900/95 text-white text-base px-4 py-2 rounded-md shadow-2xl whitespace-nowrap z-50 pointer-events-none">
                            {item.value}
                          </div>
                        )}
                      </div>
                    </div>
                    {(isUp || isDown) && (
                      <div className="shrink-0">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl
                          bg-white/30 shadow-sm transition-all duration-300
                          group-hover:scale-110 group-hover:rotate-12`}>
                          {isUp ? (
                            <ArrowUpRight className="w-5 h-5 text-white" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-white" />
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative bottom line */}
                  <div className="w-12 h-1 bg-white/40 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>

                {/* Hover overlay for color change */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300 rounded-xl"></div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Statusbar;