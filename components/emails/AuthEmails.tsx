interface EmailTemplateProps {
  title: string;
  previewText: string;
  bodyText: string;
  actionText?: string;
  actionUrl?: string;
  code?: string;
}

export function AuthEmailTemplate({
  title,
  bodyText,
  actionText,
  actionUrl,
  code,
}: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", color: "#333" }}>
      <h2>{title}</h2>
      <p>{bodyText}</p>

      {/* Renders a CTA button if URL is present */}
      {actionUrl && actionText && (
        <a
          href={actionUrl}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#0070f3",
            color: "#fff",
            borderRadius: "5px",
            textDecoration: "none",
            margin: "16px 0",
          }}
        >
          {actionText}
        </a>
      )}

      {/* Renders an OTP code block if present */}
      {code && (
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            letterSpacing: "4px",
            padding: "12px 20px",
            backgroundColor: "#f4f4f5",
            borderRadius: "6px",
            display: "inline-block",
            margin: "16px 0",
          }}
        >
          {code}
        </div>
      )}

      <p style={{ fontSize: "12px", color: "#888", marginTop: "24px" }}>
        If you didn&apos;t request this email, you can safely ignore it.
      </p>
    </div>
  );
}
