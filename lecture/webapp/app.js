// app.js (launcher)
// Kept as a tiny entry point so existing references stay stable.

(async () => {
  'use strict';

  try {
    // Avoid optional chaining for broader browser compatibility.
    const boot = (window.Prog1 && window.Prog1.main) ? window.Prog1.main.boot : null;
    if (typeof boot === 'function') {
      await boot();
    } else {
      console.error('Prog1.main.boot is not available.');
    }
  } catch (e) {
    console.error('Boot failed:', e);
  }
})();
