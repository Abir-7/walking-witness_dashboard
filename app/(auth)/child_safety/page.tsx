const sections = [
  {
    id: 1,
    icon: "🛡️",
    title: "Zero Tolerance Policy",
    color: "#c0392b",
    items: [
      {
        label: "We maintain a strict zero-tolerance policy against:",
        bullets: [
          "Child Sexual Abuse Material (CSAM)",
          "Grooming or exploitation of minors",
          "Sexualization of children",
          "Any behavior that harms or endangers minors",
        ],
      },
      {
        label: "Any violation will result in:",
        bullets: [
          "Immediate content removal",
          "Account suspension or termination",
          "Reporting to relevant authorities",
        ],
      },
    ],
  },
  {
    id: 2,
    icon: "🚫",
    title: "Prohibited Content & Behavior",
    color: "#e67e22",
    items: [
      {
        label: "Users are strictly prohibited from:",
        bullets: [
          "Uploading or sharing CSAM",
          "Engaging in inappropriate communication with minors",
          "Attempting to exploit, threaten, or coerce minors",
          "Promoting or facilitating child abuse",
        ],
      },
    ],
  },
  {
    id: 3,
    icon: "📣",
    title: "Reporting & In-App Safety",
    color: "#2980b9",
    items: [
      {
        label: "Walking Witness provides in-app reporting tools to:",
        bullets: [
          "Report suspicious behavior",
          "Report harmful or illegal content",
          "Flag child safety concerns",
        ],
      },
      {
        label: "All reports are:",
        bullets: [
          "Reviewed quickly",
          "Investigated by our team",
          "Acted upon immediately",
        ],
      },
    ],
  },
  {
    id: 4,
    icon: "🔍",
    title: "Detection & Enforcement",
    color: "#8e44ad",
    items: [
      {
        label:
          "We actively monitor the platform and take action when necessary:",
        bullets: [
          "Remove harmful content",
          "Suspend or ban users",
          "Prevent repeated violations",
        ],
      },
    ],
  },
  {
    id: 5,
    icon: "⚠️",
    title: "Handling CSAM",
    color: "#c0392b",
    items: [
      {
        label: "If we become aware of CSAM:",
        bullets: [
          "Content is removed immediately",
          "Accounts are permanently banned",
          "Case is escalated to authorities",
        ],
      },
    ],
  },
  {
    id: 6,
    icon: "⚖️",
    title: "Compliance with Laws",
    color: "#16a085",
    items: [
      {
        label:
          "Walking Witness complies with all applicable child safety laws and regulations. We report confirmed CSAM cases to:",
        bullets: ["Relevant national authorities", "Law enforcement agencies"],
      },
    ],
  },
  {
    id: 7,
    icon: "🔞",
    title: "Age Restrictions",
    color: "#d35400",
    items: [
      {
        label:
          "Our platform is not intended for children under 13. Accounts found violating this policy may be removed.",
        bullets: [],
      },
    ],
  },
  {
    id: 8,
    icon: "📧",
    title: "Contact Information",
    color: "#27ae60",
    items: [
      {
        label:
          "For child safety concerns or CSAE-related issues, contact us at:",
        bullets: [],
        email: "allan@walkingwitness.org",
      },
      {
        label: "This contact is responsible for:",
        bullets: [
          "Handling safety reports",
          "Responding to law enforcement",
          "Ensuring compliance",
        ],
      },
    ],
  },
];

export default function CSAEPolicy() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: "2rem 1rem",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: "740px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
              fontWeight: 800,
              color: "#111827",
              margin: "0 0 0.4rem",
              letterSpacing: "-0.02em",
            }}
          >
            Child Safety Standards
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.95rem",
              margin: "0 0 1rem",
              fontStyle: "italic",
            }}
          >
            Walking Witness — CSAE Policy
          </p>
          <p
            style={{
              color: "#374151",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            Walking Witness is committed to protecting children and preventing
            any form of Child Sexual Abuse and Exploitation (CSAE) on our
            platform.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column" as const,
            gap: "1.25rem",
          }}
        >
          {sections.map((s) => (
            <div
              key={s.id}
              style={{
                background: "#fff",
                borderRadius: "10px",
                borderLeft: `5px solid ${s.color}`,
                boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                padding: "1.4rem 1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "1rem",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.id}. {s.title}
                </h2>
              </div>

              {s.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: i < s.items.length - 1 ? "0.9rem" : 0,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.4rem",
                      color: "#374151",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.label}
                  </p>
                  {"email" in item && item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      style={{
                        display: "inline-block",
                        marginTop: "0.25rem",
                        color: s.color,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      {item.email}
                    </a>
                  )}
                  {item.bullets.length > 0 && (
                    <ul style={{ margin: "0.3rem 0 0 1rem", padding: 0 }}>
                      {item.bullets.map((b, j) => (
                        <li
                          key={j}
                          style={{
                            color: "#4b5563",
                            fontSize: "0.88rem",
                            marginBottom: "0.2rem",
                            lineHeight: 1.6,
                          }}
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center" as const,
            marginTop: "2rem",
            fontSize: "0.78rem",
            color: "#9ca3af",
          }}
        >
          © 2026 Walking Witness · All rights reserved
        </p>
      </div>
    </div>
  );
}
