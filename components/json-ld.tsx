// JSON.stringify does not escape "<", so admin-editable content that flows in
// here (plan names via adminUpdatePlan, hero/footer text via
// adminUpdateSiteContent) could break out of the <script> tag with a
// "</script><script>..." payload and run arbitrary JS for every visitor of
// the public page - a stored-XSS vector. <-encoding neutralizes it
// without changing the JSON-LD's meaning (JSON parses < the same as <).
function safeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
