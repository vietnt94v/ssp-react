export interface ThrottleOptions {
  onLeading?: () => void;
  onTrailing?: () => void;
}

export function throttle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delayMs: number,
  options?: ThrottleOptions,
): (...args: TArgs) => void {
  let last = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (...args: TArgs) {
    const now = Date.now();
    const elapsed = now - last;
    if (timeout) clearTimeout(timeout);
    if (elapsed >= delayMs || last === 0) {
      last = now;
      options?.onLeading?.();
      fn(...args);
    } else {
      timeout = setTimeout(() => {
        last = Date.now();
        timeout = null;
        options?.onTrailing?.();
        fn(...args);
      }, delayMs - elapsed);
    }
  };
}

// function throttle<TArgs extends unknown[]>(
//   fn: (...args: TArgs) => void,
//   delay: number,
// ): (...args: TArgs) => void {
//   let lastCall = 0;

//   return function (...args: TArgs) {
//     const now = Date.now();

//     if (now - lastCall >= delay) {
//       lastCall = now;
//       fn(...args);
//     }
//   };
// }

export default throttle;
