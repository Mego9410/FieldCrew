'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  centerLabel?: string;
  lowerLeftLabel?: string;
  lowerRightLabel?: string;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  centerLabel,
  lowerLeftLabel,
  lowerRightLabel,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        // Increase sensitivity for mobile, especially when scrolling back
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005; // Higher sensitivity for scrolling back
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 320 + scrollProgress * (isMobileState ? 600 : 1100);
  const mediaHeight = 380 + scrollProgress * (isMobileState ? 220 : 420);
  const textTranslateX = scrollProgress * (isMobileState ? 120 : 100);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden bg-black'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt='Background'
              width={1920}
              height={1080}
              className='w-screen h-screen'
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80' />
            <motion.div
              className='pointer-events-none absolute -inset-40 opacity-60'
              style={{
                background:
                  'radial-gradient(circle at 20% 0%, rgba(59,130,246,0.35), transparent 55%), radial-gradient(circle at 80% 100%, rgba(45,212,191,0.28), transparent 55%)',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.9 - scrollProgress * 0.6, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
              <motion.div
                className='absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_120px_rgba(15,23,42,0.9)] overflow-hidden'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                }}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{
                  scale: 0.97 + scrollProgress * 0.06,
                  opacity: 1,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full rounded-3xl'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none'>
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload='auto'
                        className='w-full h-full object-cover rounded-3xl'
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/40 rounded-3xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative flex h-full w-full items-center justify-center p-6 sm:p-8'>
                    <Image
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      width={1280}
                      height={720}
                      className='h-full w-full object-contain'
                    />

                    {/* Light pulse travelling down the connector lines */}
                    <motion.div
                      className='pointer-events-none absolute inset-0'
                      style={{
                        backgroundImage:
                          'linear-gradient(to bottom, transparent 0%, rgba(191,219,254,0.0) 20%, rgba(191,219,254,0.6) 40%, rgba(191,219,254,0.0) 60%, transparent 100%)',
                        mixBlendMode: 'screen',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '140% 40%',
                        backgroundPositionX: '50%',
                      }}
                      animate={{
                        backgroundPositionY: ['-40%', '120%'],
                        opacity: [0, 1, 0.2],
                      }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: 'easeInOut',
                      }}
                    />

                    {centerLabel && (
                      <div className='pointer-events-none absolute inset-0 flex items-end justify-center pb-10 sm:pb-12'>
                        <div className='rounded-full border border-sky-100/40 bg-slate-900/80 px-6 py-2 text-xs font-medium uppercase tracking-[0.18em] text-sky-50 shadow-[0_0_25px_rgba(15,23,42,0.9)]'>
                          {centerLabel}
                        </div>
                      </div>
                    )}

                    {lowerLeftLabel && (
                      <div className='pointer-events-none absolute inset-0 flex items-end justify-start pl-10 pb-16 sm:pl-14 sm:pb-20'>
                        <div className='rounded-full border border-sky-100/35 bg-slate-900/85 px-5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-sky-50 shadow-[0_0_18px_rgba(15,23,42,0.85)]'>
                          {lowerLeftLabel}
                        </div>
                      </div>
                    )}

                    {lowerRightLabel && (
                      <div className='pointer-events-none absolute inset-0 flex items-end justify-end pr-10 pb-16 sm:pr-14 sm:pb-20'>
                        <div className='rounded-full border border-sky-100/35 bg-slate-900/85 px-5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-sky-50 shadow-[0_0_18px_rgba(15,23,42,0.85)]'>
                          {lowerRightLabel}
                        </div>
                      </div>
                    )}

                    <motion.div
                      className='pointer-events-none absolute inset-0 rounded-3xl border border-white/8 bg-gradient-to-tr from-white/5 via-transparent to-cyan-500/5'
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 0.4 - scrollProgress * 0.2 }}
                      transition={{ duration: 0.25 }}
                    />
                  </div>
                )}

                <div className='flex flex-col items-center text-center relative z-10 mt-4 transition-none'>
                  {date && (
                    <p
                      className='text-sm md:text-base uppercase tracking-[0.35em] text-sky-200/80'
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className='mt-1 text-xs md:text-sm text-sky-100/80 font-medium text-center'
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-3 md:gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h2
                  className='text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight bg-gradient-to-r from-sky-100 via-cyan-100 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(8,47,73,0.8)] transition-none'
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className='text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight bg-gradient-to-r from-emerald-200 via-sky-100 to-cyan-200 bg-clip-text text-transparent text-center drop-shadow-[0_0_25px_rgba(6,78,59,0.85)] transition-none'
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>

            <motion.section
              className='flex flex-col w-full px-6 py-10 md:px-16 lg:py-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>

            {!mediaFullyExpanded && (
              <motion.div
                className='pointer-events-none fixed bottom-10 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-1 text-xs uppercase tracking-[0.25em] text-sky-100/70'
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 0.8 - scrollProgress * 0.8,
                  y: scrollProgress > 0 ? 0 : [0, 6, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: scrollProgress > 0 ? 0 : Infinity,
                  repeatType: 'reverse',
                }}
              >
                <span>Scroll to explore</span>
                <span className='h-[1px] w-12 bg-gradient-to-r from-transparent via-sky-300/80 to-transparent' />
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
