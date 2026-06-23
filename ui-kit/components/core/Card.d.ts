/**
 * Three card types:
 * - ServiceCard: square icon tile for services/feature grids
 * - CaseStudyCard: editorial card with category label, title, tag
 * - CTACard: full-width dark band with headline + CTA button
 *
 * @example
 * <ServiceCard icon="⚙" label="ERP" href="/erp" />
 * <CaseStudyCard category="Microsoft Teams" title="How we improved productivity" tag="High technology" />
 * <CTACard headline="Digitalize your entire business with us" />
 */
export interface ServiceCardProps {
  /** Icon element or SVG */
  icon?: React.ReactNode;
  /** Service name */
  label?: string;
  href?: string;
}

export interface CaseStudyCardProps {
  /** Red uppercase category label */
  category?: string;
  /** Bold article title */
  title?: string;
  /** Small tag (industry/type) */
  tag?: string;
  href?: string;
}

export interface CTACardProps {
  /** Large headline */
  headline?: string;
  /** Button label (default "Let's talk") */
  buttonLabel?: string;
  href?: string;
}
