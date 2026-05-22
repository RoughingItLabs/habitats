import { useState } from "react";

const C = {
  bg: "#0a0818",
  purple: "#4A3A7A",
  midPurple: "#7A6AAA",
  lightPurple: "#C4B5D9",
  glow: "#E8D8FF",
  gold: "#FFD700",
  darkBg: "#12103a",
};

// ── Moon Fox SVG — each stage hand-tuned ─────────────────────────────────
function MoonFoxStage1() {
  // Hatchling — tiny, egg-shaped, barely emerged, huge eyes relative to body
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" style={{ overflow: "visible" }}>
      <ellipse cx="40" cy="52" rx="14" ry="12" fill="#C4B5D9" />
      <circle cx="40" cy="35" r="13" fill="#C4B5D9" />
      {/* Tiny nub ears */}
      <ellipse cx="33" cy="24" rx="4" ry="5" fill="#B0A0C8" />
      <ellipse cx="47" cy="24" rx="4" ry="5" fill="#B0A0C8" />
      {/* Huge eyes — hatchling feature */}
      <circle cx="35" cy="35" r="5.5" fill="#1a0a30" />
      <circle cx="45" cy="35" r="5.5" fill="#1a0a30" />
      <circle cx="36.5" cy="33" r="2" fill="white" opacity="0.9" />
      <circle cx="46.5" cy="33" r="2" fill="white" opacity="0.9" />
      {/* Tiny nose */}
      <ellipse cx="40" cy="41" rx="2" ry="1.5" fill="#9B7DC8" />
      {/* Wobbly little stub tail */}
      <ellipse cx="27" cy="55" rx="6" ry="4" fill="#B0A0C8" transform="rotate(-30 27 55)" opacity="0.8" />
    </svg>
  );
}

function MoonFoxStage2() {
  // Sprout — growing confidence, ears more defined, tiny paws visible
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" style={{ overflow: "visible" }}>
      <ellipse cx="40" cy="54" rx="16" ry="13" fill="#C4B5D9" />
      {/* Belly */}
      <ellipse cx="40" cy="57" rx="9" ry="8" fill="#EDE5F8" opacity="0.7" />
      <circle cx="40" cy="34" r="15" fill="#C4B5D9" />
      {/* Ears with slight inner detail */}
      <polygon points="32,22 28,10 38,20" fill="#A898C0" />
      <polygon points="48,22 52,10 42,20" fill="#A898C0" />
      <ellipse cx="32" cy="17" rx="2" ry="4" fill="#D8C8F0" opacity="0.5" />
      <ellipse cx="48" cy="17" rx="2" ry="4" fill="#D8C8F0" opacity="0.5" />
      {/* Eyes — slightly smaller than stage 1 proportionally */}
      <circle cx="35" cy="33" r="4.5" fill="#1a0a30" />
      <circle cx="45" cy="33" r="4.5" fill="#1a0a30" />
      <circle cx="36.5" cy="31" r="1.8" fill="white" opacity="0.9" />
      <circle cx="46.5" cy="31" r="1.8" fill="white" opacity="0.9" />
      <ellipse cx="40" cy="39" rx="2.5" ry="1.8" fill="#9B7DC8" />
      {/* Small smile */}
      <path d="M 37 42 Q 40 45 43 42" stroke="#9B7DC8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Stub paws */}
      <ellipse cx="29" cy="63" rx="5" ry="3.5" fill="#B8A8D0" />
      <ellipse cx="51" cy="63" rx="5" ry="3.5" fill="#B8A8D0" />
      {/* Tail */}
      <ellipse cx="24" cy="55" rx="10" ry="5" fill="#B0A0C8" transform="rotate(-25 24 55)" opacity="0.9" />
    </svg>
  );
}

function MoonFoxStage3() {
  // Young — clearly a fox now, all features defined, personality visible
  return (
    <svg viewBox="0 0 90 90" width="90" height="90" style={{ overflow: "visible" }}>
      {/* Tail */}
      <ellipse cx="20" cy="62" rx="15" ry="7" fill="#A898C0" transform="rotate(-30 20 62)" opacity="0.9" />
      <ellipse cx="22" cy="60" rx="8" ry="4" fill="#EDE5F8" opacity="0.5" transform="rotate(-30 22 60)" />
      {/* Body */}
      <ellipse cx="45" cy="60" rx="20" ry="17" fill="#C4B5D9" />
      {/* Belly */}
      <ellipse cx="45" cy="63" rx="12" ry="11" fill="#EDE5F8" opacity="0.75" />
      {/* Head */}
      <circle cx="45" cy="36" r="18" fill="#C4B5D9" />
      {/* Ears */}
      <polygon points="33,23 28,6 40,20" fill="#9B7DC8" />
      <polygon points="57,23 62,6 50,20" fill="#9B7DC8" />
      <polygon points="34,22 30,9 39,20" fill="#D8C8F0" opacity="0.6" />
      <polygon points="56,22 60,9 51,20" fill="#D8C8F0" opacity="0.6" />
      {/* Eyes */}
      <circle cx="38" cy="35" r="5" fill="#1a0a30" />
      <circle cx="52" cy="35" r="5" fill="#1a0a30" />
      <circle cx="39.5" cy="32.5" r="2" fill="white" opacity="0.9" />
      <circle cx="53.5" cy="32.5" r="2" fill="white" opacity="0.9" />
      {/* Muzzle */}
      <ellipse cx="45" cy="42" rx="6" ry="5" fill="#B8A8D0" opacity="0.6" />
      <ellipse cx="45" cy="40" rx="2.5" ry="2" fill="#7B5EA7" />
      <path d="M 41 44 Q 45 47 49 44" stroke="#7B5EA7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="30" cy="72" rx="7" ry="4.5" fill="#B8A8D0" />
      <ellipse cx="60" cy="72" rx="7" ry="4.5" fill="#B8A8D0" />
    </svg>
  );
}

function MoonFoxStage4() {
  // Adult — full size, regal, crescent moon mark on forehead
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" style={{ overflow: "visible" }}>
      {/* Tail — full and fluffy */}
      <ellipse cx="18" cy="66" rx="18" ry="9" fill="#9B7DC8" transform="rotate(-28 18 66)" />
      <ellipse cx="19" cy="64" rx="11" ry="5.5" fill="#EDE5F8" opacity="0.5" transform="rotate(-28 19 64)" />
      {/* Body */}
      <ellipse cx="50" cy="65" rx="23" ry="20" fill="#C4B5D9" />
      {/* Belly */}
      <ellipse cx="50" cy="69" rx="14" ry="13" fill="#EDE5F8" opacity="0.8" />
      {/* Head */}
      <circle cx="50" cy="38" r="21" fill="#C4B5D9" />
      {/* Ears */}
      <polygon points="35,24 29,4 43,21" fill="#9B7DC8" />
      <polygon points="65,24 71,4 57,21" fill="#9B7DC8" />
      <polygon points="36,23 31,7 42,20" fill="#D8C8F0" opacity="0.65" />
      <polygon points="64,23 69,7 58,20" fill="#D8C8F0" opacity="0.65" />
      {/* Eyes */}
      <circle cx="41" cy="37" r="6" fill="#1a0a30" />
      <circle cx="59" cy="37" r="6" fill="#1a0a30" />
      {/* Iris glow */}
      <circle cx="41" cy="37" r="3.5" fill="#5A3A8A" opacity="0.5" />
      <circle cx="59" cy="37" r="3.5" fill="#5A3A8A" opacity="0.5" />
      <circle cx="43" cy="34.5" r="2.2" fill="white" opacity="0.95" />
      <circle cx="61" cy="34.5" r="2.2" fill="white" opacity="0.95" />
      {/* Muzzle */}
      <ellipse cx="50" cy="46" rx="7" ry="6" fill="#B8A8D0" opacity="0.55" />
      <ellipse cx="50" cy="43.5" rx="3" ry="2.5" fill="#7B5EA7" />
      <path d="M 45 48 Q 50 52 55 48" stroke="#7B5EA7" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* CRESCENT MOON MARK — adult feature */}
      <path d="M 46 22 Q 50 16 54 22 Q 50 18 46 22" fill="#E8D8FF" opacity="0.95" />
      {/* Paws */}
      <ellipse cx="32" cy="80" rx="9" ry="5.5" fill="#B8A8D0" />
      <ellipse cx="68" cy="80" rx="9" ry="5.5" fill="#B8A8D0" />
    </svg>
  );
}

function MoonFoxStage5() {
  // Legendary — crown, orbiting stars, ethereal glow, full majesty
  return (
    <svg viewBox="0 0 120 120" width="115" height="115" style={{ overflow: "visible" }}>
      {/* Outer legendary aura */}
      <circle cx="60" cy="65" r="52" fill="none" stroke="#C4B5D9" strokeWidth="0.8" opacity="0.25" strokeDasharray="4 3">
        <animateTransform attributeName="transform" type="rotate" from="0 60 65" to="360 60 65" dur="14s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="65" r="44" fill="none" stroke="#E8D8FF" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 5">
        <animateTransform attributeName="transform" type="rotate" from="360 60 65" to="0 60 65" dur="9s" repeatCount="indefinite" />
      </circle>

      {/* Tail — legendary full fluff */}
      <ellipse cx="20" cy="74" rx="22" ry="11" fill="#9B7DC8" transform="rotate(-26 20 74)" />
      <ellipse cx="21" cy="72" rx="14" ry="7" fill="#EDE5F8" opacity="0.55" transform="rotate(-26 21 72)" />

      {/* Body */}
      <ellipse cx="60" cy="74" rx="26" ry="23" fill="#C4B5D9" />
      <ellipse cx="60" cy="78" rx="16" ry="15" fill="#EDE5F8" opacity="0.82" />

      {/* Head */}
      <circle cx="60" cy="42" r="24" fill="#C4B5D9" />

      {/* Ears */}
      <polygon points="42,27 35,4 52,24" fill="#9B7DC8" />
      <polygon points="78,27 85,4 68,24" fill="#9B7DC8" />
      <polygon points="43,26 37,8 51,23" fill="#D8C8F0" opacity="0.7" />
      <polygon points="77,26 83,8 69,23" fill="#D8C8F0" opacity="0.7" />

      {/* Eyes — legendary golden tint */}
      <circle cx="49" cy="40" r="7.5" fill="#1a0a30" />
      <circle cx="71" cy="40" r="7.5" fill="#1a0a30" />
      <circle cx="49" cy="40" r="4.5" fill="#7B5EA7" opacity="0.6" />
      <circle cx="71" cy="40" r="4.5" fill="#7B5EA7" opacity="0.6" />
      <circle cx="51.5" cy="37" r="2.8" fill="white" opacity="0.95" />
      <circle cx="73.5" cy="37" r="2.8" fill="white" opacity="0.95" />

      {/* Muzzle */}
      <ellipse cx="60" cy="51" rx="8" ry="7" fill="#B8A8D0" opacity="0.5" />
      <ellipse cx="60" cy="48" rx="3.5" ry="3" fill="#7B5EA7" />
      <path d="M 54 54 Q 60 58 66 54" stroke="#7B5EA7" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Crescent mark — glowing */}
      <path d="M 55 24 Q 60 17 65 24 Q 60 20 55 24" fill="#E8D8FF" opacity="0.95" />

      {/* CROWN */}
      <polygon points="60,14 56,22 52,17 56,24 60,20 64,24 68,17 64,22" fill="#FFD700" opacity="0.95" />
      <circle cx="60" cy="13" r="2.5" fill="white" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="52" cy="17" r="1.5" fill="#FFD700" opacity="0.8">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="68" cy="17" r="1.5" fill="#FFD700" opacity="0.8">
        <animate attributeName="opacity" values="1;0.6;1" dur="1.8s" repeatCount="indefinite" />
      </circle>

      {/* Orbiting stars */}
      {[0, 1, 2].map(i => (
        <g key={i}>
          <circle cx="60" cy="20" r="2.5" fill="#E8D8FF" opacity="0.9">
            <animateTransform attributeName="transform" type="rotate"
              from={`${i * 120} 60 65`} to={`${i * 120 + 360} 60 65`}
              dur={`${5 + i * 1.2}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Paws */}
      <ellipse cx="38" cy="90" rx="11" ry="7" fill="#B8A8D0" />
      <ellipse cx="82" cy="90" rx="11" ry="7" fill="#B8A8D0" />
    </svg>
  );
}

const stages = [
  { component: MoonFoxStage1, label: "Stage 1", sublabel: "Hatchling", desc: "Just emerged. Huge eyes,\nwobbly tail, almost no\nbody detail. Pure potential." },
  { component: MoonFoxStage2, label: "Stage 2", sublabel: "Sprout", desc: "Ears taking shape.\nBelly patch appears.\nStub paws visible." },
  { component: MoonFoxStage3, label: "Stage 3", sublabel: "Young", desc: "Clearly a fox. Muzzle\ndefined. Tail fills out.\nReal personality emerges." },
  { component: MoonFoxStage4, label: "Stage 4", sublabel: "Adult", desc: "Full size. Crescent moon\nmark on forehead.\nIris glow, fluffy tail." },
  { component: MoonFoxStage5, label: "Stage 5", sublabel: "Legendary", desc: "Golden crown. Orbiting\nstars. Ethereal aura.\nEnters the Collection." },
];

// ── Moon Grove Environment ────────────────────────────────────────────────
function MoonGroveScene() {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "200px",
      borderRadius: "20px",
      overflow: "hidden",
      background: "linear-gradient(180deg, #04021a 0%, #0d0828 40%, #1a1040 70%, #12102a 100%)",
    }}>
      {/* Stars */}
      {[...Array(30)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 7.3 + 3) % 95}%`,
          top: `${(i * 11.7 + 2) % 55}%`,
          width: i % 5 === 0 ? "3px" : "1.5px",
          height: i % 5 === 0 ? "3px" : "1.5px",
          borderRadius: "50%",
          background: "white",
          opacity: 0.3 + (i % 4) * 0.15,
          animation: `twinkle ${2 + (i % 4) * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
        }} />
      ))}

      {/* Moon */}
      <div style={{
        position: "absolute",
        top: "12px",
        right: "60px",
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 40%, #FFF8DC, #E8D870)",
        boxShadow: "0 0 20px #FFD70040, 0 0 40px #FFD70020",
      }} />

      {/* Back tree silhouettes */}
      {[8, 20, 72, 85].map((x, i) => (
        <div key={i} style={{
          position: "absolute",
          bottom: "30px",
          left: `${x}%`,
          width: `${18 + i * 4}px`,
          height: `${80 + i * 20}px`,
          background: "#0a0620",
          borderRadius: "40% 40% 0 0",
          opacity: 0.9,
        }} />
      ))}

      {/* Ground mist */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0, right: 0,
        height: "60px",
        background: "linear-gradient(180deg, transparent 0%, #1a1040aa 60%, #12102a 100%)",
      }} />

      {/* Bioluminescent mushrooms */}
      {[
        { x: "10%", size: 18, color: "#C4B5D9" },
        { x: "18%", size: 12, color: "#A898C8" },
        { x: "25%", size: 22, color: "#D8C8F0" },
        { x: "65%", size: 16, color: "#C4B5D9" },
        { x: "75%", size: 20, color: "#B8A8E0" },
        { x: "82%", size: 14, color: "#D0C0F8" },
      ].map((m, i) => (
        <div key={i} style={{
          position: "absolute",
          bottom: "28px",
          left: m.x,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: `glow ${2 + i * 0.4}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
        }}>
          {/* Cap */}
          <div style={{
            width: `${m.size}px`,
            height: `${m.size * 0.55}px`,
            borderRadius: "50% 50% 0 0",
            background: `radial-gradient(circle at 40% 30%, ${m.color}, ${m.color}88)`,
            boxShadow: `0 0 8px ${m.color}80, 0 0 16px ${m.color}40`,
          }} />
          {/* Stem */}
          <div style={{
            width: `${m.size * 0.25}px`,
            height: `${m.size * 0.5}px`,
            background: `${m.color}60`,
            borderRadius: "2px",
          }} />
        </div>
      ))}

      {/* God rays */}
      {[30, 45, 60].map((x, i) => (
        <div key={i} style={{
          position: "absolute",
          top: 0,
          left: `${x}%`,
          width: `${8 + i * 3}px`,
          height: "150px",
          background: `linear-gradient(180deg, #E8D8FF18 0%, transparent 100%)`,
          transform: `rotate(${-5 + i * 5}deg)`,
          transformOrigin: "top center",
          animation: `ray ${3 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.8}s`,
        }} />
      ))}

      {/* Foreground tree trunks */}
      {[0, 90].map((x, i) => (
        <div key={i} style={{
          position: "absolute",
          bottom: 0,
          left: `${x}%`,
          width: "22px",
          height: "120px",
          background: "#06041a",
          borderRadius: "4px",
        }} />
      ))}

      {/* Floating sparkles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${15 + i * 10}%`,
          top: `${30 + (i * 13) % 40}%`,
          color: "#C4B5D9",
          fontSize: i % 3 === 0 ? "10px" : "6px",
          animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
          opacity: 0.7,
        }}>✦</div>
      ))}

      {/* Zone label */}
      <div style={{
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        color: "#C4B5D9",
        fontSize: "11px",
        fontFamily: "Quicksand, sans-serif",
        fontWeight: 700,
        letterSpacing: "2px",
        textTransform: "uppercase",
        opacity: 0.8,
      }}>Moon Grove</div>
    </div>
  );
}

// ── Main Reference Sheet ──────────────────────────────────────────────────
export default function LunaraReferenceSheet() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      background: "#08061a",
      minHeight: "100vh",
      padding: "32px 24px",
      fontFamily: "'Nunito', sans-serif",
      color: "white",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Nunito:wght@400;600;700&display=swap');
        @keyframes twinkle { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
        @keyframes glow { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.4)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes ray { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
        @keyframes breathe { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-4px) scale(1.02)} }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ color: "#C4B5D9", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>
          Habitats — Art Reference
        </div>
        <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: "28px", color: "white" }}>
          Lunara <span style={{ color: "#C4B5D9" }}>· Moon Fox</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "4px" }}>
          Moon Grove zone · Powered by sleep data · 5 growth stages
        </div>
      </div>

      {/* Moon Grove Environment */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Zone Environment — Moon Grove (Thriving State)
        </div>
        <MoonGroveScene />
        <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Deep purple nights", "Bioluminescent mushrooms", "God rays", "Floating sparkles", "Ancient trees", "Ground mist"].map(t => (
            <div key={t} style={{ background: "rgba(196,181,217,0.12)", border: "1px solid rgba(196,181,217,0.25)", borderRadius: "99px", padding: "3px 10px", fontSize: "11px", color: "#C4B5D9" }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Stage reference */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>
          Growth Stages — All 5
        </div>
        <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "8px" }}>
          {stages.map((s, i) => {
            const Comp = s.component;
            const isHovered = hovered === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHovered ? "rgba(196,181,217,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isHovered ? "rgba(196,181,217,0.4)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "20px",
                  padding: "16px 12px",
                  minWidth: "130px",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  cursor: "default",
                  boxShadow: isHovered ? "0 0 20px rgba(196,181,217,0.15)" : "none",
                }}
              >
                {/* Size indicator */}
                <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "9px", marginBottom: "8px", fontWeight: 600 }}>
                  {["45px", "65px", "82px", "100px", "115px"][i]}
                </div>

                {/* Sprite */}
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  height: "120px",
                  animation: "breathe 4s ease-in-out infinite",
                  animationDelay: `${i * 0.6}s`,
                }}>
                  <Comp />
                </div>

                {/* Labels */}
                <div style={{ marginTop: "12px" }}>
                  <div style={{ color: "#C4B5D9", fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: "13px" }}>{s.sublabel}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", marginTop: "1px" }}>{s.label}</div>
                </div>

                {/* Description on hover */}
                <div style={{
                  marginTop: "10px",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "10px",
                  lineHeight: 1.5,
                  whiteSpace: "pre-line",
                  maxHeight: isHovered ? "80px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}>
                  {s.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color palette */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          Lunara Color Palette
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { color: "#C4B5D9", name: "Body" },
            { color: "#9B7DC8", name: "Accent" },
            { color: "#EDE5F8", name: "Belly" },
            { color: "#E8D8FF", name: "Glow" },
            { color: "#1a0a30", name: "Eyes" },
            { color: "#FFD700", name: "Crown" },
          ].map(p => (
            <div key={p.name} style={{ textAlign: "center" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: p.color, border: "1px solid rgba(255,255,255,0.1)", marginBottom: "4px" }} />
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}>{p.name}</div>
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "8px" }}>{p.color}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Style notes */}
      <div style={{ background: "rgba(196,181,217,0.07)", border: "1px solid rgba(196,181,217,0.15)", borderRadius: "16px", padding: "16px" }}>
        <div style={{ color: "#C4B5D9", fontWeight: 700, fontSize: "12px", marginBottom: "10px" }}>📋 Artist Notes</div>
        {[
          "Style: Soft illustrated, cartoony. NOT pixel art, NOT 3D rendered.",
          "Eyes: Large, expressive, always with a white highlight dot. The emotional anchor.",
          "Outlines: Clean but slightly organic — hand-drawn feel, not perfect geometric.",
          "Gradients: Soft and muted. Body color transitions gently, not harsh.",
          "Stage differences: Each stage should look DISTINCTLY different, not just scaled up.",
          "Stage 5 only: Crown, orbiting elements, and outer aura glow are Legendary-exclusive.",
          "Export: SVG format, each stage as a separate file. Viewbox 0 0 [W] [W].",
        ].map((note, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", alignItems: "flex-start" }}>
            <div style={{ color: "#C4B5D9", opacity: 0.5, marginTop: "1px", flexShrink: 0 }}>·</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", lineHeight: 1.5 }}>{note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
