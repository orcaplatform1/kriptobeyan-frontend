// JSON.stringify output for schema.org data does not need HTML-escaping
// the way user-submitted content would — these values are all site-owned
// constants/backend plan data, never raw user input.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
