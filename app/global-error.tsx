"use client";

export default function GlobalRootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          background: "#f6efe1",
          color: "#24201a",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(169, 128, 62, 0.2)",
            background: "#fbf7ec",
            borderRadius: 20,
            padding: 40,
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Bir Şeyler Ters Gitti</h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "#4a4234" }}>
            Uygulama beklenmedik bir hatayla karşılaştı.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              color: "#7c5a26",
              background: "none",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tekrar dene
          </button>
        </div>
      </body>
    </html>
  );
}
