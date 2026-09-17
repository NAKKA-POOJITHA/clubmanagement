export const triggerConfetti = (options?: any) => {
  if (typeof window === 'undefined') return;
  import('canvas-confetti')
    .then((module) => {
      const confetti = module.default || module;
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7360E8', '#5B48C7', '#C9BFFC', '#10B981', '#F59E0B'],
        ...options,
      });
    })
    .catch((err) => {
      console.warn('Confetti could not be loaded:', err);
    });
};
