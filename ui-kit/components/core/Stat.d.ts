/**
 * Large red statistic with a small descriptor — used in About sections
 * to highlight company scale and credibility.
 *
 * @example
 * <Stat value="26+" label="years of operation" />
 * <Stat value="700+" label="implementations" />
 * <Stat value="255+" label="employees" />
 * <Stat value="400+" label="certificates" />
 */
export interface StatProps {
  /** Number + suffix, e.g. "26+" or "700+" */
  value: string;
  /** Short descriptor */
  label: string;
}
