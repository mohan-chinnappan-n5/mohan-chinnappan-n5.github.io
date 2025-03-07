# Slide 1
## What Is `window.performance`?
- `window.performance` is a JavaScript API in web browsers for measuring and analyzing web page performance.
- Provides high-precision timing and metrics to evaluate load times, rendering, and user interactions.
- Part of the High Resolution Time specification, accessible via modern browsers like Chrome, Firefox, and Edge.

# Slide 2
## Why Use `window.performance`?
- Helps developers optimize website performance by identifying bottlenecks.
- Enables monitoring of Core Web Vitals (e.g., LCP, FID, CLS) and other metrics.
- Supports debugging, performance testing, and user experience improvements.
- Essential for meeting SEO and user satisfaction goals.

# Slide 3
## Key Properties of `window.performance`
- **performance.now():** High-precision timestamp in milliseconds since page navigation, for timing code execution.
- **performance.timing:** Object with timestamps for navigation, load, and rendering events.
- **performance.memory:** Provides memory usage estimates (non-standard, Chrome-only).
- **performance.navigation:** Details about navigation type (e.g., reload, back/forward).

# Slide 4
## Performance Metrics with `window.performance`
- **Load Times:** Measure DOMContentLoaded, loadEventEnd, and responseStart via `performance.timing`.
- **Time to Interactive (TTI):** Use `performance.now()` with event listeners to track interactivity.
- **First Input Delay (FID):** Measure time from first user interaction to response using `PerformanceObserver`.
- **Cumulative Layout Shift (CLS):** Track layout shifts with `PerformanceObserver`.

# Slide 5
## Using `performance.now()`
- Returns a high-precision timestamp (microseconds) for accurate performance timing.
- Example: `const start = performance.now(); // Do work; const end = performance.now(); console.log(`Time: ${end - start}ms`);`.
- More accurate than `Date.now()` due to sub-millisecond precision and reduced jitter.
- Ideal for benchmarking and profiling code.

# Slide 6
## `performance.timing` Details
- **navigationStart:** Time when the user initiated navigation to the page.
- **domLoading:** When the document started loading.
- **domContentLoadedEventEnd:** When DOM content finished loading and parsing.
- **loadEventEnd:** When the load event of the window finished.
- Use to calculate load times: `loadEventEnd - navigationStart`.

# Slide 7
## `PerformanceObserver` for Real-Time Metrics
- Observes performance entries (e.g., navigation, paint, layout-shift) in real-time.
- Example: `new PerformanceObserver((list) => { list.getEntries().forEach(entry => console.log(entry)); }).observe({ type: 'layout-shift', buffered: true });`.
- Tracks CLS, FID, and LCP dynamically, useful for monitoring during page lifecycle.
- Requires modern browser support and proper error handling.

# Slide 8
## Challenges with `window.performance`
- **Browser Compatibility:** Some properties (e.g., `performance.memory`) are Chrome-only; others vary by browser.
- **Precision Limits:** High-precision timing may be throttled in inactive tabs for privacy/security.
- **Overhead:** Frequent calls to `performance.now()` or observers can impact performance if not optimized.
- **Complexity:** Requires understanding of timing events and metrics for accurate interpretation.

# Slide 9
## Tools and Best Practices
- **DevTools:** Use Chrome/Firefox DevTools Performance panel to visualize `window.performance` data.
- **Lighthouse:** Integrates `window.performance` metrics for Core Web Vitals scoring.
- **Libraries:** Use frameworks like Perfume.js or Web Vitals for simplified tracking.
- **Best Practices:** Minimize reflows, defer non-critical scripts, and lazy-load resources.

# Slide 10
## Conclusion
- `window.performance` is a powerful tool for measuring and optimizing website performance in browsers.
- Understanding its properties, metrics, and challenges is key to enhancing user experience.
- Leverage tools and best practices to stay competitive in web performance.
- Thank you for your attention!