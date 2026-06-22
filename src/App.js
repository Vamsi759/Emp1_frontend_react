import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

const BASE = "https://aistudynotessaving.onrender.com";

const C = {
  navy:    "#1e3c72",
  blue:    "#2a5298",
  accent:  "#0d6efd",
  teal:    "#16a085",
  green:   "#27ae60",
  danger:  "#e74c3c",
  bg:      "#eef2f7",
  card:    "#ffffff",
  sidebar: "linear-gradient(180deg,#1e3c72,#2a5298)",
  header:  "linear-gradient(45deg,#0d6efd,#4f8cff)",
  sub:     "rgba(255,255,255,0.11)",
};

/* ══════════════════════════════════════════════════
   COUNTDOWN OVERLAY
══════════════════════════════════════════════════ */
function CountdownOverlay({ onDone }) {
  const TOTAL = 120;
  const [left, setLeft] = useState(TOTAL);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((p) => {
        if (p <= 1) { clearInterval(id); onDone(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onDone]);

  const pct  = ((TOTAL - left) / TOTAL) * 100;
  const mm   = String(Math.floor(left / 60)).padStart(2, "0");
  const ss   = String(left % 60).padStart(2, "0");
  const r    = 54, circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(135deg,#0d1b2a 0%,#1e3c72 60%,#2a5298 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 32,
    }}>
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10"/>
          <circle cx="70" cy="70" r={r} fill="none" stroke="#00c9a7"
            strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={dash}
            style={{ transition: "stroke-dashoffset .9s linear" }}/>
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "#fff", fontSize: 36, fontWeight: 800, letterSpacing: 1 }}>
            {mm}:{ss}
          </span>
          <span style={{ color: "rgba(255,255,255,.55)", fontSize: 11, marginTop: 2 }}>remaining</span>
        </div>
      </div>

      <div style={{ textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Backend is warming up</div>
        <div style={{ color: "rgba(255,255,255,.6)", fontSize: 14, maxWidth: 320 }}>
          Connecting to aistudynotessaving.onrender.com<br/>
          Dashboard loads automatically when ready.
        </div>
      </div>

      <div style={{ width: 280, height: 6, background: "rgba(255,255,255,.15)", borderRadius: 99 }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: "linear-gradient(90deg,#00c9a7,#0d6efd)",
          width: `${pct}%`, transition: "width .9s linear",
        }}/>
      </div>

      <button onClick={onDone} style={{
        marginTop: 8, padding: "10px 28px", borderRadius: 8,
        background: "rgba(255,255,255,.15)", border: "1.5px solid rgba(255,255,255,.35)",
        color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
      }}>
        Skip — I'll wait for errors
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════ */
function Sidebar({ data, onShowContent }) {
  const [view, setView]             = useState("subjects");
  const [openTopics, setOpenTopics] = useState({});

  const toggleTopic = (t) => setOpenTopics((p) => ({ ...p, [t]: !p[t] }));

  if (view === "subjects") {
    return (
      <div style={{ width: "28%", minWidth: 220, background: C.sidebar, color: "#fff",
        padding: 20, overflowY: "auto", boxShadow: "4px 0 15px rgba(0,0,0,.18)", flexShrink: 0 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20, fontWeight: 700, letterSpacing: 1, fontSize: 20 }}>
          Subjects
        </h2>
        {Object.keys(data).length === 0
          ? <p style={{ opacity: .5, fontSize: 13, textAlign: "center" }}>No subjects yet</p>
          : Object.keys(data).map((sub) => (
            <button key={sub} onClick={() => { setView(sub); setOpenTopics({}); }} style={sidebarBtn()}>
              {sub}
            </button>
          ))}
      </div>
    );
  }

  const subject = view;
  return (
    <div style={{ width: "28%", minWidth: 220, background: C.sidebar, color: "#fff",
      padding: 20, overflowY: "auto", boxShadow: "4px 0 15px rgba(0,0,0,.18)", flexShrink: 0 }}>
      <h2 style={{ textAlign: "center", marginBottom: 14, fontWeight: 700, fontSize: 18 }}>{subject}</h2>
      <button onClick={() => setView("subjects")} style={sidebarBtn()}>⬅ Back</button>
      {Object.keys(data[subject] || {}).map((topic) => (
        <div key={topic}>
          <button onClick={() => toggleTopic(topic)} style={sidebarBtn()}>{topic}</button>
          {openTopics[topic] && (
            <div style={{ marginLeft: 15, marginBottom: 10 }}>
              {Object.keys(data[subject][topic] || {}).map((sub) => (
                <button key={sub}
                  onClick={() => onShowContent(subject, topic, sub, data[subject][topic][sub])}
                  style={subBtn()}>
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CONTENT AREA
══════════════════════════════════════════════════ */
function ContentArea({ content, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText]       = useState("");
  const taRef                 = useRef(null);

  useEffect(() => { setText(content?.theory ?? ""); setEditing(false); }, [content]);
  useEffect(() => { if (taRef.current) autoResize(taRef.current); }, [text]);

  const autoResize = (el) => { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; };

  if (!content) return (
    <div style={{ flex: 1, padding: 24, background: C.bg, overflowY: "auto" }}>
      <h2 style={{ color: C.navy, marginBottom: 8 }}>Welcome</h2>
      <p style={{ color: "#666" }}>Select any subtopic from the sidebar to get started.</p>
      <hr style={{ marginTop: 16, borderColor: "#d0d7e3" }}/>
    </div>
  );

  return (
    <div style={{ flex: 1, padding: 8, background: C.bg, overflowY: "auto", overflowX: "hidden" }}>
      <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.10)" }}>
        <div style={{
          background: C.header, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 10, flexWrap: "wrap", padding: "14px 18px",
        }}>
          <h3 style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 20 }}>{content.subtopic}</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {!editing
              ? <button onClick={() => setEditing(true)} style={cardBtn("edit")}>✏️ Edit</button>
              : <button onClick={() => { onSave(text); setEditing(false); }} style={cardBtn("save")}>💾 Save</button>}
          </div>
        </div>
        <div style={{ background: "#fff" }}>
          <textarea ref={taRef}
            value={text} readOnly={!editing} spellCheck={false}
            onChange={(e) => { setText(e.target.value); autoResize(e.target); }}
            style={{
              width: "100%", minHeight: "calc(100vh - 110px)", resize: "none",
              border: "none", outline: "none", padding: 20,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              fontSize: 16, lineHeight: 1.8, color: "#333",
              background: editing ? "#f0f7ff" : "#fff",
              borderTop: editing ? `2px solid ${C.accent}` : "none",
              whiteSpace: "pre", overflowX: "auto", overflowY: "hidden",
              display: "block", boxSizing: "border-box",
              cursor: editing ? "text" : "default",
              borderRadius: "0 0 12px 12px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ASK AI PANEL
══════════════════════════════════════════════════ */
function AskAI({ onMoveToSave }) {
  const [prompt,       setPrompt]       = useState("");
  const [result,       setResult]       = useState("");
  const [loading,      setLoading]      = useState(false);
  const [delSubject,   setDelSubject]   = useState("");
  const [delMaintopic, setDelMaintopic] = useState("");
  const [delSubtopic,  setDelSubtopic]  = useState("");

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setResult("");
    try {
      const r = await fetch(`${BASE}/apap/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      setResult(await r.text());
    } catch (e) { setResult("Error: " + e.message); }
    setLoading(false);
  };

  const deleteData = async () => {
    if (!delSubject || !delMaintopic || !delSubtopic) { alert("Fill all delete fields"); return; }
    try {
      await fetch(`${BASE}/apirl/del`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectname: delSubject, maintopicname: delMaintopic, subtopicname: delSubtopic }),
      });
      alert(`[- ${delSubtopic} -] Deleted Successfully`);
      setDelSubject(""); setDelMaintopic(""); setDelSubtopic("");
    } catch { alert("Delete Failed"); }
  };

  return (
    <div style={panelBox()}>
      <h2 style={panelH2()}>Ask AI</h2>
      <input value={prompt} onChange={e => setPrompt(e.target.value)}
        placeholder="Enter your question…" style={inputStyle()} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={sendPrompt} style={actionBtn(C.accent)} disabled={loading}>
          {loading ? "Loading…" : "Ask"}
        </button>
        <button onClick={() => onMoveToSave(result)} style={actionBtn(C.teal)}>Move to Save</button>
      </div>
      <h4 style={{ margin: "8px 0 4px", color: "#34495e", fontSize: 14 }}>
        {loading ? "AI Response is Loading . . ." : "AI Response:"}
      </h4>
      <textarea value={result} onChange={e => setResult(e.target.value)}
        placeholder="AI response appears here…" style={taStyle()} />
      <hr style={{ margin: "18px 0", borderColor: "#e0e7ef" }} />
      <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 20 }}>
        <h3 style={{ marginBottom: 14, color: "#2c3e50", fontSize: 17, fontWeight: 700 }}>Remove Data</h3>
        {[
          ["Subject",    delSubject,   setDelSubject],
          ["Main Topic", delMaintopic, setDelMaintopic],
          ["Sub Topic",  delSubtopic,  setDelSubtopic],
        ].map(([ph, val, set]) => (
          <input key={ph} value={val} onChange={e => set(e.target.value)}
            placeholder={ph} style={{ ...inputStyle(), marginBottom: 10 }} />
        ))}
        <button onClick={deleteData} style={{ ...actionBtn(C.danger), width: "100%" }}>Delete</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ADD DATA PANEL
══════════════════════════════════════════════════ */
function AddDataPanel({ prefillContent, onSaved }) {
  const [subject,   setSubject]   = useState("");
  const [maintopic, setMaintopic] = useState("");
  const [subtopic,  setSubtopic]  = useState("");
  const [theory,    setTheory]    = useState("");

  useEffect(() => { if (prefillContent) setTheory(prefillContent); }, [prefillContent]);

  const save = async () => {
    if (!subject || !maintopic || !subtopic || !theory) { alert("Please fill all fields"); return; }
    try {
      await fetch(`${BASE}/apirl/callnormalcut`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectname: subject, maintopicname: maintopic, subtopicname: subtopic, theory }),
      });
      onSaved(subject, maintopic, subtopic, theory);
      setSubtopic(""); setTheory("");
    } catch { alert("Save Failed"); }
  };

  return (
    <div style={panelBox()}>
      <h2 style={panelH2()}>Add Data</h2>
      {[
        ["Subject",       subject,   setSubject,   "Subject Name"],
        ["Main Topic",    maintopic, setMaintopic, "Main Topic Name"],
        ["Heading / Sub", subtopic,  setSubtopic,  "Sub Topic Name"],
      ].map(([lbl, val, set, ph]) => (
        <div key={lbl}>
          <label style={labelStyle()}>{lbl}</label>
          <input value={val} onChange={e => set(e.target.value)} placeholder={ph} style={inputStyle()} />
        </div>
      ))}
      <label style={labelStyle()}>Cleaned Content</label>
      <textarea value={theory} onChange={e => setTheory(e.target.value)}
        placeholder="Edit content before saving…" style={taStyle()} />
      <button onClick={save} style={{ ...actionBtn(C.green), width: "100%", marginTop: 4 }}>Save</button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SUBJECT DASHBOARD PAGE
══════════════════════════════════════════════════ */
function SubjectDashboard() {
  const [ready,         setReady]         = useState(false);
  const [data,          setData]          = useState({});
  const [activeContent, setActiveContent] = useState(null);
  const [saveContent,   setSaveContent]   = useState("");

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch(`${BASE}/apirl/rl`);
      if (!r.ok) throw new Error("Failed");
      setData(await r.json());
    } catch { /* silent during warm-up */ }
  }, []);

  useEffect(() => { if (ready) fetchData(); }, [ready, fetchData]);

  const showContent = (subject, maintopic, subtopic, theory) =>
    setActiveContent({ subject, maintopic, subtopic, theory });

  const handleCardSave = async (newTheory) => {
    if (!activeContent) return;
    const { subject, maintopic, subtopic } = activeContent;
    try {
      await fetch(`${BASE}/apirl/callnormalcut`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectname: subject, maintopicname: maintopic, subtopicname: subtopic, theory: newTheory }),
      });
      setData(prev => {
        const next = structuredClone(prev);
        if (next[subject]?.[maintopic]) next[subject][maintopic][subtopic] = newTheory;
        return next;
      });
      setActiveContent(c => ({ ...c, theory: newTheory }));
      alert("Saved successfully!");
    } catch { alert("Save Failed"); }
  };

  const handleSaved = async (subject, maintopic, subtopic, theory) => {
    await fetchData();
    showContent(subject, maintopic, subtopic, theory);
  };

  if (!ready) return <CountdownOverlay onDone={() => setReady(true)} />;

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: C.bg, minHeight: "100vh" }}>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar data={data} onShowContent={showContent} />
        <ContentArea content={activeContent} onSave={handleCardSave} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start",
        gap: 20, width: "90%", margin: "30px auto", flexWrap: "wrap" }}>
        <AskAI onMoveToSave={(txt) => setSaveContent(txt)} />
        <AddDataPanel prefillContent={saveContent} onSaved={handleSaved} />
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   APP  (router)
══════════════════════════════════════════════════ */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubjectDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/* ════════════════════════════════
   Style helpers
════════════════════════════════ */
function sidebarBtn() {
  return {
    width: "100%", border: "none", padding: "12px 14px", marginBottom: 8,
    borderRadius: 8, background: C.sub, color: "#fff", fontWeight: 600,
    textAlign: "left", cursor: "pointer", fontSize: 15,
  };
}
function subBtn() {
  return {
    width: "95%", border: "none", padding: "10px 12px", margin: "5px 0",
    borderRadius: 6, background: C.teal, color: "#fff",
    fontSize: 14, cursor: "pointer", display: "block",
  };
}
function cardBtn(type) {
  return {
    background: type === "edit" ? "rgba(255,255,255,.25)" : C.green,
    border: `1.5px solid ${type === "edit" ? "rgba(255,255,255,.7)" : "#219150"}`,
    color: "#fff", padding: "6px 16px", borderRadius: 7,
    fontWeight: 600, fontSize: 13, cursor: "pointer",
  };
}
function panelBox() {
  return {
    flex: "1 1 0", background: "#fff", padding: 22, borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,.08)", display: "flex",
    flexDirection: "column", gap: 12, minWidth: 280,
  };
}
function panelH2()    { return { margin: 0, color: C.navy, fontWeight: 700, fontSize: 20 }; }
function inputStyle() {
  return {
    width: "100%", padding: "10px 12px", border: "1px solid #ccc",
    borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none",
  };
}
function labelStyle() { return { fontWeight: 600, color: "#34495e", fontSize: 14 }; }
function taStyle() {
  return {
    width: "100%", height: 300, borderRadius: 10, border: "1px solid #d0d0d0",
    padding: 12, resize: "vertical", fontFamily: "Consolas, monospace",
    fontSize: 13, background: "#fafafa", boxSizing: "border-box",
  };
}
function actionBtn(bg) {
  return {
    border: "none", background: bg, color: "#fff", padding: "10px 18px",
    borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14,
  };
}