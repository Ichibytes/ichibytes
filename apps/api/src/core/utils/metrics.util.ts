/**
 * Simple in-memory metrics collection
 * In production, consider using Prometheus or similar
 */

interface Metric {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: Date;
}

class MetricsCollector {
  private metrics: Metric[] = [];
  private readonly maxMetrics = 10000; // Keep last 10k metrics

  /**
   * Increment a counter metric
   */
  increment(name: string, labels?: Record<string, string>): void {
    this.addMetric({
      name,
      value: 1,
      labels,
      timestamp: new Date(),
    });
  }

  /**
   * Record a gauge value
   */
  gauge(name: string, value: number, labels?: Record<string, string>): void {
    this.addMetric({
      name,
      value,
      labels,
      timestamp: new Date(),
    });
  }

  /**
   * Record a histogram value (for durations, sizes, etc.)
   */
  histogram(
    name: string,
    value: number,
    labels?: Record<string, string>
  ): void {
    this.addMetric({
      name,
      value,
      labels,
      timestamp: new Date(),
    });
  }

  /**
   * Get metrics summary
   */
  getSummary(): {
    totalRequests: number;
    errorCount: number;
    averageResponseTime: number;
    requestsByStatus: Record<number, number>;
    requestsByEndpoint: Record<string, number>;
  } {
    const requests = this.metrics.filter((m) => m.name === "http_request");
    const errors = this.metrics.filter((m) => m.name === "http_error");
    const responseTimes = this.metrics
      .filter((m) => m.name === "http_response_time")
      .map((m) => m.value);

    const requestsByStatus: Record<number, number> = {};
    const requestsByEndpoint: Record<string, number> = {};

    requests.forEach((metric) => {
      if (metric.labels?.statusCode) {
        const status = parseInt(metric.labels.statusCode, 10);
        requestsByStatus[status] = (requestsByStatus[status] || 0) + 1;
      }
      if (metric.labels?.endpoint) {
        requestsByEndpoint[metric.labels.endpoint] =
          (requestsByEndpoint[metric.labels.endpoint] || 0) + 1;
      }
    });

    const averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    return {
      totalRequests: requests.length,
      errorCount: errors.length,
      averageResponseTime: Math.round(averageResponseTime),
      requestsByStatus,
      requestsByEndpoint,
    };
  }

  /**
   * Get all metrics (for export)
   */
  getAllMetrics(): Metric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  private addMetric(metric: Metric): void {
    this.metrics.push(metric);
    // Keep only the last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }
}

export const metricsCollector = new MetricsCollector();
