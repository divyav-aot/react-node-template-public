import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from "web-vitals";

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void): void => {
  if (!onPerfEntry) return;

  onCLS(onPerfEntry);
  onFCP(onPerfEntry);
  onLCP(onPerfEntry);
  onTTFB(onPerfEntry);
  onINP(onPerfEntry); // Optional: measures interaction latency
};

export default reportWebVitals;
