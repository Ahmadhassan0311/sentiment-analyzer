import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const SAMPLES = [
  { text: "This movie was an absolute masterpiece! The acting was phenomenal." },
  { text: "Terrible film. Worst acting I have ever seen in my life." },
  { text: "The storyline was brilliant and kept me hooked till the very end!" },
  { text: "Complete waste of money. I want my 2 hours back." },
  { text: "Breathtaking visuals and an emotional journey I will never forget." },
];

const STATS = [
  { value: "50K+", label: "Reviews Trained" },
  { value: "88.6%", label: "Accuracy" },
  { value: "< 1s", label: "Response Time" },
  { value: "2", label: "Sentiments" },
];

function Particles() {
  // deterministic-ish positions so React doesn't rerender random each time
  const pointsRef = useRef(
    [...Array(18)].map(() => ({
      left: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 7 + Math.random() * 9,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.25,
    }))
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {pointsRef.current.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: -20,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: "#7C6CFF",
            borderRadius: "50%",
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            filter: "blur(0.2px)",
          }}
        />
      ))}
    </div>
  );
}

function StatCard({ value, label, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 250 + index * 110);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 18,
        padding: "16px 14px",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: "#B9B2FF",
          letterSpacing: 0.3,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          marginTop: 6,
          color: "rgba(255,255,255,0.72)",
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ConfidenceRing({ confidence, sentiment }) {
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    setAnim(false);
    const t = setTimeout(() => setAnim(true), 50);
    return () => clearTimeout(t);
  }, [confidence]);

  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (confidence / 100) * circ;

  const color = sentiment === "positive" ? "#00E5C0" : "#FF4D6D";

  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle
        cx={70}
        cy={70}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={10}
      />
      <circle
        cx={70}
        cy={70}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeDasharray={circ}
        strokeDashoffset={anim ? offset : circ}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{
          transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
          filter: `drop-shadow(0 0 10px ${color}66)`,
        }}
      />
      <text
        x={70}
        y={66}
        textAnchor="middle"
        fill={color}
        fontSize={22}
        fontWeight={800}
      >
        {confidence}%
      </text>
      <text
        x={70}
        y={84}
        textAnchor="middle"
        fill="rgba(255,255,255,0.68)"
        fontSize={10}
        letterSpacing={1.5}
      >
        CONFIDENCE
      </text>
    </svg>
  );
}

function MoodMeter({ positive, negative }) {
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    setAnim(false);
    const t = setTimeout(() => setAnim(true), 80);
    return () => clearTimeout(t);
  }, [positive, negative]);

  const knobLeft = `${positive}%`;

  const barGrad =
    positive > 60
      ? "linear-gradient(90deg,#00E5C0,#45A3FF)"
      : positive < 40
      ? "linear-gradient(90deg,#FF4D6D,#7C6CFF)"
      : "linear-gradient(90deg,#FFB020,#45A3FF)";

  return (
    <div style={{ marginTop: 14, marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "rgba(255,255,255,0.72)",
          marginBottom: 8,
        }}
      >
        <span>Negative</span>
        <span>Positive</span>
      </div>

      <div
        style={{
          height: 14,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 999,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: anim ? `${positive}%` : "50%",
            background: barGrad,
            borderRadius: 999,
            transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: anim ? knobLeft : "50%",
            transform: "translate(-50%,-50%)",
            width: 22,
            height: 22,
            background: "#fff",
            borderRadius: "50%",
            boxShadow: "0 0 18px rgba(0,0,0,0.6)",
            transition: "left 1.1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <span style={{ color: "#FF4D6D" }}>{negative}%</span>
        <span style={{ color: "#00E5C0" }}>{positive}%</span>
      </div>
    </div>
  );
}

function ResultCard({ result, review }) {
  const isPos = result.sentiment === "positive";
  const accent = isPos ? "#00E5C0" : "#FF4D6D";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 26,
        padding: 28,
        marginTop: 18,
        boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
        backdropFilter: "blur(14px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -120,
          background: `radial-gradient(circle at 20% 20%, ${accent}25, transparent 55%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: isPos ? "rgba(0,229,192,0.14)" : "rgba(255,77,109,0.14)",
            border: "1px solid rgba(255,255,255,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            letterSpacing: 1,
            color: accent,
          }}
        >
          {isPos ? "POS" : "NEG"}
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.72)",
              letterSpacing: 2.4,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Sentiment detected
          </div>

          <div style={{ fontSize: 34, fontWeight: 900, color: accent, lineHeight: 1.1 }}>
            {isPos ? "POSITIVE" : "NEGATIVE"}
          </div>
        </div>

        <ConfidenceRing confidence={result.confidence} sentiment={result.sentiment} />
      </div>

      <div
        style={{
          marginTop: 18,
          background: "rgba(0,0,0,0.28)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderLeft: `3px solid ${accent}`,
          borderRadius: 14,
          padding: "14px 16px",
          color: "rgba(255,255,255,0.78)",
          lineHeight: 1.6,
          position: "relative",
        }}
      >
        {review}
      </div>

      <MoodMeter positive={result.positive_prob} negative={result.negative_prob} />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { label: "Positive", val: result.positive_prob, color: "#00E5C0" },
          { label: "Negative", val: result.negative_prob, color: "#FF4D6D" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 80, fontSize: 13, color: "rgba(255,255,255,0.72)" }}>
              {item.label}
            </span>
            <div
              style={{
                flex: 1,
                height: 9,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${item.val}%`,
                  background: item.color,
                  borderRadius: 999,
                  boxShadow: `0 0 12px ${item.color}55`,
                  transition: "width 0.9s ease",
                }}
              />
            </div>
            <span
              style={{
                width: 48,
                fontSize: 13,
                fontWeight: 800,
                color: item.color,
                textAlign: "right",
              }}
            >
              {item.val}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  const analyze = async () => {
    if (!review.trim()) {
      setError("Please type a review first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(`${API_URL}/predict`, { review });
      setResult(res.data);

      setHistory((prev) => [
        {
          full: review,
          review: review.length > 70 ? review.slice(0, 70) + "..." : review,
          sentiment: res.data.sentiment,
          confidence: res.data.confidence,
        },
        ...prev.slice(0, 4),
      ]);
    } catch (e) {
      setError("Backend not reachable. Run: python -m uvicorn main:app --reload");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        :root{
          --bg0:#050510;
          --bg1:#0B0B16;
          --card:rgba(255,255,255,0.04);
          --border:rgba(255,255,255,0.10);
          --text:rgba(255,255,255,0.92);
          --muted:rgba(255,255,255,0.70);
          --muted2:rgba(255,255,255,0.55);
          --primary:#7C6CFF;
          --pos:#00E5C0;
          --neg:#FF4D6D;
          --shadow:0 22px 80px rgba(0,0,0,0.55);
        }

        *{ box-sizing:border-box; margin:0; padding:0; }
        body{
          min-height:100vh;
          overflow-x:hidden;
          background:
            radial-gradient(circle at 18% 20%, rgba(124,108,255,0.22), transparent 45%),
            radial-gradient(circle at 85% 15%, rgba(69,163,255,0.18), transparent 45%),
            radial-gradient(circle at 50% 120%, rgba(0,229,192,0.12), transparent 40%),
            linear-gradient(180deg, var(--bg0), var(--bg1));
          color: var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Helvetica Neue", sans-serif;
        }

        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-110vh); opacity: 0; }
        }
        @keyframes fadeUp {
          from{ opacity:0; transform:translateY(18px); }
          to{ opacity:1; transform:translateY(0); }
        }
        @keyframes spin {
          from{ transform:rotate(0deg); }
          to{ transform:rotate(360deg); }
        }

        .container{
          position:relative;
          z-index:1;
          max-width: 920px;
          margin: 0 auto;
          padding: 46px 22px 80px;
        }

        .nav{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom: 48px;
          opacity: ${loaded ? 1 : 0};
          transition: opacity .8s ease;
        }

        .brand{
          font-weight: 900;
          letter-spacing: .6px;
          font-size: 18px;
          color: white;
        }
        .pill{
          display:flex;
          align-items:center;
          gap:10px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.80);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }
        .dot{
          width:7px; height:7px; border-radius:99px;
          background: var(--pos);
          box-shadow: 0 0 14px rgba(0,229,192,0.55);
        }

        .hero{
          text-align:center;
          margin-bottom: 34px;
          animation: fadeUp .9s ease both;
        }
        .kicker{
          display:inline-flex;
          gap:10px;
          align-items:center;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.78);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 18px;
          backdrop-filter: blur(12px);
        }
        .h1{
          font-size: clamp(44px, 7vw, 76px);
          line-height: 1.05;
          font-weight: 950;
          margin-bottom: 12px;
        }
        .grad{
          background: linear-gradient(135deg, #B9B2FF 0%, #7C6CFF 35%, #45A3FF 70%, #00E5C0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .sub{
          max-width: 560px;
          margin: 0 auto;
          color: rgba(255,255,255,0.70);
          line-height: 1.7;
          font-size: 15px;
        }

        .stats{
          display:grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 26px 0 20px;
        }
        @media (max-width: 780px){
          .stats{ grid-template-columns: repeat(2, 1fr); }
        }

        .card{
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 26px;
          padding: 26px;
          box-shadow: var(--shadow);
          backdrop-filter: blur(14px);
          position: relative;
          overflow: hidden;
        }
        .card::before{
          content:"";
          position:absolute;
          inset:-160px;
          background: radial-gradient(circle at 15% 25%, rgba(124,108,255,0.22), transparent 50%);
          pointer-events:none;
        }

        .label{
          position:relative;
          z-index:1;
          font-size: 11px;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.74);
          margin-bottom: 10px;
        }

        textarea{
          position:relative;
          z-index:1;
          width:100%;
          min-height: 140px;
          background: rgba(0,0,0,0.30);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 18px;
          padding: 16px 16px;
          color: rgba(255,255,255,0.92);
          font-size: 15px;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        textarea::placeholder{ color: rgba(255,255,255,0.35); }
        textarea:focus{
          border-color: rgba(124,108,255,0.65);
          box-shadow: 0 0 0 4px rgba(124,108,255,0.18);
        }

        .row{
          position:relative;
          z-index:1;
          display:flex;
          justify-content: space-between;
          align-items:center;
          gap:12px;
          margin-top: 12px;
        }
        .samplesTitle{
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.62);
        }

        .chips{
          position:relative;
          z-index:1;
          display:flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 10px 0 16px;
        }
        .chip{
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          color: rgba(255,255,255,0.82);
          cursor: pointer;
          transition: transform .15s ease, background .15s ease, border-color .15s ease;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .chip:hover{
          transform: translateY(-2px);
          background: rgba(124,108,255,0.14);
          border-color: rgba(124,108,255,0.28);
        }

        .btn{
          position:relative;
          z-index:1;
          width:100%;
          padding: 16px 16px;
          border-radius: 18px;
          border: 0;
          cursor: pointer;
          color: white;
          font-weight: 900;
          letter-spacing: 1.2px;
          background: linear-gradient(135deg, rgba(124,108,255,1), rgba(69,163,255,1));
          box-shadow: 0 10px 40px rgba(124,108,255,0.25);
          transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease;
        }
        .btn:hover:not(:disabled){
          transform: translateY(-2px);
          box-shadow: 0 16px 60px rgba(124,108,255,0.38);
        }
        .btn:disabled{ opacity: 0.55; cursor: not-allowed; }

        .spinner{
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.30);
          border-top-color: white;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        .error{
          position:relative;
          z-index:1;
          margin-top: 12px;
          background: rgba(255,77,109,0.10);
          border: 1px solid rgba(255,77,109,0.26);
          border-radius: 14px;
          padding: 12px 14px;
          color: rgba(255,255,255,0.90);
          font-size: 13px;
        }

        .historyCard{
          margin-top: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          padding: 18px;
          backdrop-filter: blur(14px);
        }
        .histItem{
          display:flex;
          align-items:center;
          gap:10px;
          padding: 10px 12px;
          border-radius: 14px;
          cursor:pointer;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          transition: transform .15s ease, background .15s ease, border-color .15s ease;
          margin-bottom: 8px;
        }
        .histItem:hover{
          transform: translateX(4px);
          background: rgba(124,108,255,0.10);
          border-color: rgba(124,108,255,0.20);
        }
        .badge{
          width:10px; height:10px; border-radius: 50%;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        .histText{
          flex:1;
          font-size: 12px;
          color: rgba(255,255,255,0.76);
          overflow:hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .histConf{
          font-size: 12px;
          font-weight: 800;
          min-width: 52px;
          text-align: right;
        }

        .footer{
          text-align:center;
          margin-top: 48px;
          padding-top: 22px;
          border-top: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.65);
          font-size: 12px;
          line-height: 1.7;
        }
      `}</style>

      <Particles />

      <div className="container">
        {/* Nav */}
        <div className="nav">
          <div className="brand">AH</div>
          <div className="pill">
            <span className="dot" />
            Live · ML Project
          </div>
        </div>

        {/* Hero */}
        <div className="hero">
          <div className="kicker">Natural Language Processing</div>
          <div className="h1">
            <span className="grad">Sentiment Analyzer</span>
          </div>
          <div className="sub">
            AI model trained on 50,000 movie reviews. Detects positive and negative sentiment with 88.6% accuracy.
          </div>

          <div className="stats">
            {STATS.map((s, i) => (
              <StatCard key={i} {...s} index={i} />
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="card">
          <div className="label">Write or paste your review</div>

          <textarea
            ref={textareaRef}
            placeholder="Type a movie review here... (Ctrl+Enter to analyze)"
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
              setResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) analyze();
            }}
          />

          <div className="row">
            <div className="samplesTitle">Quick samples</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
              Ctrl + Enter
            </div>
          </div>

          <div className="chips">
            {SAMPLES.map((s, i) => (
              <button
                key={i}
                type="button"
                className="chip"
                onClick={() => {
                  setReview(s.text);
                  setResult(null);
                  textareaRef.current?.focus();
                }}
              >
                {s.text}
              </button>
            ))}
          </div>

          <button className="btn" onClick={analyze} disabled={loading} type="button">
            {loading ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <span className="spinner" />
                Analyzing...
              </span>
            ) : (
              "Analyze Sentiment"
            )}
          </button>

          {error && <div className="error">{error}</div>}
        </div>

        {/* Result */}
        {result && <ResultCard result={result} review={review} />}

        {/* History */}
        {history.length > 0 && (
          <div className="historyCard">
            <div className="label" style={{ marginBottom: 12 }}>
              Recent analyses
            </div>

            {history.map((h, i) => (
              <div
                key={i}
                className="histItem"
                onClick={() => setReview(h.full)}
                role="button"
                tabIndex={0}
              >
                <div
                  className="badge"
                  style={{
                    background: h.sentiment === "positive" ? "#00E5C0" : "#FF4D6D",
                    boxShadow: `0 0 12px ${
                      h.sentiment === "positive" ? "rgba(0,229,192,0.55)" : "rgba(255,77,109,0.55)"
                    }`,
                  }}
                />
                <div className="histText">{h.review}</div>
                <div
                  className="histConf"
                  style={{ color: h.sentiment === "positive" ? "#00E5C0" : "#FF4D6D" }}
                >
                  {h.confidence}%
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          Built by Ahmad Hassan · Python + FastAPI + React
        </div>
      </div>
    </>
  );
}