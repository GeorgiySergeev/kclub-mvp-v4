Card components for three contexts:
- ServiceCard: icon grid tiles (areas of operation, product features)
- CaseStudyCard: editorial cards (case studies, blog, news)
- CTACard: full-width call-to-action band

```jsx
// Service grid
<div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'2px'}}>
  <ServiceCard icon={<ERP />} label="ERP" />
  <ServiceCard icon={<CRM />} label="CRM" />
  <ServiceCard icon={<DMS />} label="DMS" />
</div>

// Case study list
<CaseStudyCard
  category="Microsoft Teams Solutions"
  title="Instrumentation Technologies achieves significantly higher productivity"
  tag="High technology"
/>

// CTA band
<CTACard headline="Digitalize your entire business with us" />
```
