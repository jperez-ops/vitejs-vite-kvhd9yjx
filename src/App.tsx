import { useState, useEffect } from "react";

function getUrlKey() {
  const params = new URLSearchParams(window.location.search);
  return params.get("key");
}

const USERS = [
  { id: "u1", name: "JR Perez", role: "salesperson", pin: "1234" },
  { id: "u2", name: "Mike Thompson", role: "salesperson", pin: "2222" },
  { id: "u3", name: "Sarah Collins", role: "salesperson", pin: "3333" },
  { id: "u4", name: "Dave Ruiz", role: "manager", pin: "9999" },
];

const INITIAL_KEYS = [
  { tagId: "TAG-001", stockNumber: "24T1001", year: 2024, make: "Toyota", model: "Camry", color: "Midnight Black", checkedOutBy: "u2", checkedOutAt: new Date(Date.now() - 47 * 60000).toISOString() },
  { tagId: "TAG-002", stockNumber: "24T1002", year: 2024, make: "Toyota", model: "RAV4", color: "Super White", checkedOutBy: null, checkedOutAt: null },
  { tagId: "TAG-003", stockNumber: "24T1003", year: 2024, make: "Toyota", model: "Tundra", color: "Army Green", checkedOutBy: "u3", checkedOutAt: new Date(Date.now() - 12 * 60000).toISOString() },
  { tagId: "TAG-004", stockNumber: "24T1004", year: 2023, make: "Toyota", model: "4Runner", color: "Cavalry Blue", checkedOutBy: null, checkedOutAt: null },
  { tagId: "TAG-005", stockNumber: "24T1005", year: 2024, make: "Toyota", model: "Tacoma", color: "Lunar Rock", checkedOutBy: "u1", checkedOutAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { tagId: "TAG-006", stockNumber: "24T1006", year: 2024, make: "Toyota", model: "Highlander", color: "Blueprint", checkedOutBy: null, checkedOutAt: null },
  { tagId: "TAG-007", stockNumber: "24T1007", year: 2024, make: "Toyota", model: "Corolla", color: "Precious Metal", checkedOutBy: null, checkedOutAt: null },
  { tagId: "TAG-008", stockNumber: "24T1008", year: 2024, make: "Toyota", model: "Sequoia", color: "Wind Chill Pearl", checkedOutBy: null, checkedOutAt: null },
  { tagId: "TAG-DOT", stockNumber: "TS511944A", year: 2025, make: "Toyota", model: "4Runner TRD Sport", color: "Midnight Black Metallic", checkedOutBy: null, checkedOutAt: null },
];

const INITIAL_LOGS = [
  { id: "l1", tagId: "TAG-001", stockNumber: "24T1001", userId: "u2", action: "checkout", timestamp: new Date(Date.now() - 47 * 60000).toISOString() },
  { id: "l2", tagId: "TAG-003", stockNumber: "24T1003", userId: "u3", action: "checkout", timestamp: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: "l3", tagId: "TAG-005", stockNumber: "24T1005", userId: "u1", action: "checkout", timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: "l4", tagId: "TAG-002", stockNumber: "24T1002", userId: "u1", action: "checkin", timestamp: new Date(Date.now() - 90 * 60000).toISOString() },
];

function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}

const IconKey = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/>
  </svg>
);
const IconSearch = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconLogout = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconCheck = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconNfc = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 15a6 6 0 1 0 12 0"/><path d="M6 9a12 12 0 0 1 12 0"/><path d="M3 5a18 18 0 0 1 18 0"/><line x1="12" y1="19" x2="12" y2="22"/>
  </svg>
);
const IconClock = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconUser = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconGrid = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconList = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IconSettings = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #111118; --surface2: #1a1a24;
    --border: #232330; --border2: #2e2e40;
    --red: #e8365d; --red-dim: rgba(232,54,93,0.12);
    --green: #00d084; --green-dim: rgba(0,208,132,0.1);
    --amber: #f5a623; --amber-dim: rgba(245,166,35,0.1);
    --blue: #4d9fff;
    --text: #f0f0f8; --text2: #8888aa; --text3: #555570;
    --mono: 'DM Mono', monospace; --sans: 'Syne', sans-serif;
    --radius: 12px; --radius-sm: 8px;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--sans); }
  .app { min-height: 100vh; display: flex; flex-direction: column; max-width: 430px; margin: 0 auto; background: var(--bg); }
  .login-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; }
  .login-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .login-logo-icon { width: 48px; height: 48px; background: var(--red); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
  .login-brand { font-family: var(--sans); font-weight: 800; font-size: 28px; letter-spacing: -0.5px; }
  .login-brand span { color: var(--red); }
  .login-sub { color: var(--text2); font-size: 13px; margin-bottom: 40px; font-family: var(--mono); }
  .login-card { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; }
  .login-label { font-size: 11px; font-family: var(--mono); color: var(--text2); letter-spacing: 0.08em; margin-bottom: 8px; }
  .login-select { width: 100%; background: var(--surface2); border: 1px solid var(--border2); border-radius: var(--radius-sm); padding: 12px 14px; color: var(--text); font-family: var(--sans); font-size: 15px; outline: none; margin-bottom: 20px; appearance: none; }
  .login-pin-label { font-size: 11px; font-family: var(--mono); color: var(--text2); letter-spacing: 0.08em; margin-bottom: 12px; }
  .pin-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 8px; }
  .pin-btn { background: var(--surface2); border: 1px solid var(--border2); border-radius: var(--radius-sm); padding: 16px; font-family: var(--sans); font-size: 20px; font-weight: 700; color: var(--text); cursor: pointer; transition: all 0.12s; text-align: center; }
  .pin-btn:hover { background: var(--border2); border-color: var(--red); }
  .pin-display { display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; }
  .pin-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--border2); transition: all 0.15s; }
  .pin-dot.filled { background: var(--red); border-color: var(--red); }
  .pin-clear { background: transparent !important; border: 1px solid var(--border) !important; color: var(--text2) !important; font-size: 13px !important; }
  .login-err { color: var(--red); font-size: 12px; font-family: var(--mono); text-align: center; margin-top: 8px; min-height: 18px; }
  .header { padding: 16px 20px 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10; }
  .header-left { display: flex; align-items: center; gap: 10px; }
  .header-logo { width: 32px; height: 32px; background: var(--red); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .header-title { font-weight: 800; font-size: 18px; letter-spacing: -0.3px; }
  .header-title span { color: var(--red); }
  .header-right { display: flex; align-items: center; gap: 12px; }
  .header-user { font-size: 12px; color: var(--text2); font-family: var(--mono); }
  .icon-btn { background: none; border: none; color: var(--text2); cursor: pointer; display: flex; align-items: center; padding: 4px; border-radius: 6px; }
  .nav { display: flex; border-top: 1px solid var(--border); position: sticky; bottom: 0; background: var(--bg); z-index: 10; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 4px 14px; cursor: pointer; color: var(--text3); font-size: 10px; font-family: var(--mono); border: none; background: none; transition: color 0.15s; }
  .nav-item.active { color: var(--red); }
  .content { flex: 1; overflow-y: auto; padding-bottom: 8px; }
  .nfc-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; padding: 32px 24px; text-align: center; gap: 20px; }
  .nfc-ring { width: 140px; height: 140px; border-radius: 50%; border: 2px solid var(--border2); display: flex; align-items: center; justify-content: center; position: relative; }
  .nfc-ring::before { content: ''; position: absolute; inset: -10px; border-radius: 50%; border: 1px solid var(--border); }
  .nfc-ring::after { content: ''; position: absolute; inset: -20px; border-radius: 50%; border: 1px dashed var(--border); opacity: 0.5; }
  .nfc-pulse { position: absolute; inset: 0; border-radius: 50%; background: var(--red-dim); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity:0.3; transform:scale(0.95); } 50% { opacity:1; transform:scale(1.05); } }
  .nfc-title { font-size: 22px; font-weight: 800; }
  .demo-keys { width: 100%; margin-top: 8px; }
  .demo-keys-label { font-size: 11px; font-family: var(--mono); color: var(--text3); letter-spacing: 0.08em; margin-bottom: 10px; text-align: left; }
  .demo-key-btn { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 8px; }
  .demo-key-stock { font-family: var(--mono); font-size: 11px; color: var(--red); }
  .demo-key-name { font-size: 14px; font-weight: 600; margin-top: 1px; color: var(--text); }
  .demo-key-status { font-size: 11px; padding: 3px 8px; border-radius: 4px; font-family: var(--mono); font-weight: 500; }
  .status-out { background: var(--red-dim); color: var(--red); }
  .status-in { background: var(--green-dim); color: var(--green); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: flex-end; }
  .modal { background: var(--surface); border-top: 1px solid var(--border); border-radius: 20px 20px 0 0; width: 100%; max-width: 430px; margin: 0 auto; padding: 24px 24px 40px; }
  .modal-handle { width: 36px; height: 4px; background: var(--border2); border-radius: 2px; margin: 0 auto 24px; }
  .modal-stock { font-family: var(--mono); font-size: 12px; color: var(--red); margin-bottom: 4px; }
  .modal-car { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
  .modal-color { font-size: 13px; color: var(--text2); margin-bottom: 20px; font-family: var(--mono); }
  .modal-divider { height: 1px; background: var(--border); margin-bottom: 20px; }
  .modal-info-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text2); margin-bottom: 10px; font-family: var(--mono); }
  .modal-info-row strong { color: var(--text); }
  .modal-actions { display: flex; gap: 10px; margin-top: 24px; }
  .btn-primary { flex: 1; background: var(--green); border: none; border-radius: var(--radius-sm); padding: 15px; font-family: var(--sans); font-size: 16px; font-weight: 700; color: #000; cursor: pointer; }
  .btn-danger { flex: 1; background: var(--red); border: none; border-radius: var(--radius-sm); padding: 15px; font-family: var(--sans); font-size: 16px; font-weight: 700; color: white; cursor: pointer; }
  .btn-cancel { flex: 1; background: var(--surface2); border: 1px solid var(--border2); border-radius: var(--radius-sm); padding: 15px; font-family: var(--sans); font-size: 16px; font-weight: 600; color: var(--text2); cursor: pointer; }
  .success-flash { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 16px 0; }
  .success-icon { width: 64px; height: 64px; border-radius: 50%; background: var(--green-dim); border: 2px solid var(--green); display: flex; align-items: center; justify-content: center; color: var(--green); }
  .success-title { font-size: 20px; font-weight: 800; }
  .success-sub { color: var(--text2); font-size: 14px; font-family: var(--mono); }
  .tab-header { padding: 20px 20px 12px; display: flex; align-items: center; justify-content: space-between; }
  .tab-title { font-size: 22px; font-weight: 800; }
  .tab-badge { font-size: 11px; font-family: var(--mono); color: var(--text2); }
  .search-bar { margin: 0 16px 16px; display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 14px; }
  .search-bar input { flex: 1; background: none; border: none; outline: none; color: var(--text); font-family: var(--sans); font-size: 14px; }
  .search-bar input::placeholder { color: var(--text3); }
  .filter-row { display: flex; gap: 8px; padding: 0 16px 16px; overflow-x: auto; }
  .filter-chip { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 6px 14px; font-size: 12px; font-family: var(--mono); color: var(--text2); cursor: pointer; white-space: nowrap; }
  .filter-chip.active { background: var(--red-dim); border-color: var(--red); color: var(--red); }
  .key-list { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
  .key-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .key-card.checked-out { border-left: 3px solid var(--red); }
  .key-card.checked-in { border-left: 3px solid var(--green); }
  .key-card-stock { font-family: var(--mono); font-size: 11px; color: var(--text3); margin-bottom: 2px; }
  .key-card-name { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .key-card-meta { display: flex; align-items: center; gap: 10px; font-size: 11px; color: var(--text2); font-family: var(--mono); }
  .key-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .badge { font-size: 10px; font-family: var(--mono); font-weight: 500; padding: 3px 8px; border-radius: 4px; }
  .badge-out { background: var(--red-dim); color: var(--red); }
  .badge-in { background: var(--green-dim); color: var(--green); }
  .key-who { font-size: 11px; color: var(--text2); font-family: var(--mono); display: flex; align-items: center; gap: 3px; }
  .log-list { padding: 0 16px; display: flex; flex-direction: column; }
  .log-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .log-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .log-dot-out { background: var(--red); }
  .log-dot-in { background: var(--green); }
  .log-body { flex: 1; }
  .log-action { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .log-action span { color: var(--text2); font-weight: 400; }
  .log-sub { font-size: 11px; color: var(--text3); font-family: var(--mono); }
  .log-time { font-size: 11px; color: var(--text3); font-family: var(--mono); text-align: right; }
  .stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 16px 16px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
  .stat-num { font-size: 32px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
  .stat-label { font-size: 11px; color: var(--text2); font-family: var(--mono); }
  .section-label { font-size: 11px; font-family: var(--mono); color: var(--text3); letter-spacing: 0.08em; padding: 0 16px; margin-bottom: 10px; }
  .reassign-form { display: flex; flex-direction: column; gap: 14px; }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 11px; font-family: var(--mono); color: var(--text2); letter-spacing: 0.06em; }
  .form-input { background: var(--surface2); border: 1px solid var(--border2); border-radius: var(--radius-sm); padding: 12px 14px; color: var(--text); font-family: var(--mono); font-size: 14px; outline: none; }
  .empty { text-align: center; padding: 48px 24px; color: var(--text3); font-family: var(--mono); font-size: 13px; }
`;

type User = { id: string; name: string; role: string; pin: string };
type KeyEntry = { tagId: string; stockNumber: string; year: number; make: string; model: string; color: string; checkedOutBy: string | null; checkedOutAt: string | null };
type LogEntry = { id: string; tagId: string; stockNumber: string; userId: string; action: string; timestamp: string };

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [keys, setKeys] = useState<KeyEntry[]>(INITIAL_KEYS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [tab, setTab] = useState("scan");
  const urlKey= getUrlKey();
  const [modal, setModal] = useState<{ key: KeyEntry; mode: string; action?: string } | null>(null);
  const [reassignModal, setReassignModal] = useState<KeyEntry | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loginUser, setLoginUser] = useState(USERS[0].id);
  const [pin, setPin] = useState("");
  const [loginErr, setLoginErr] = useState("");

  useEffect(() => {
    const t = setInterval(() => {}, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (urlKey && currentUser) {
      const key = keys.find(k => k.tagId === urlKey);
      if (key) openKeyModal(key);
    }
  }, [currentUser]);

  function handlePin(digit: string) {
    if (digit === "clear") { setPin(""); return; }
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      const user = USERS.find(u => u.id === loginUser);
      if (user && user.pin === next) {
        setCurrentUser(user); setPin(""); setLoginErr("");
      } else {
        setTimeout(() => { setPin(""); setLoginErr("Incorrect PIN"); }, 300);
      }
    }
  }

  function openKeyModal(key: KeyEntry) { setModal({ key, mode: "confirm" }); }

  function handleAction() {
    if (!modal || !currentUser) return;
    const { key } = modal;
    const isOut = key.checkedOutBy !== null;
    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = { id: "l" + Date.now(), tagId: key.tagId, stockNumber: key.stockNumber, userId: currentUser.id, action: isOut ? "checkin" : "checkout", timestamp };
    setKeys(prev => prev.map(k => k.tagId !== key.tagId ? k : { ...k, checkedOutBy: isOut ? null : currentUser.id, checkedOutAt: isOut ? null : timestamp }));
    setLogs(prev => [logEntry, ...prev]);
    setModal({ key: { ...key, checkedOutBy: isOut ? null : currentUser.id }, mode: "success", action: isOut ? "checkin" : "checkout" });
    setTimeout(() => setModal(null), 1800);
  }

  function handleReassign(tagId: string, newStock: string, newYear: number, newMake: string, newModel: string, newColor: string) {
    setKeys(prev => prev.map(k => k.tagId !== tagId ? k : { ...k, stockNumber: newStock, year: newYear, make: newMake, model: newModel, color: newColor, checkedOutBy: null, checkedOutAt: null }));
    setReassignModal(null);
  }

  const checkedOut = keys.filter(k => k.checkedOutBy !== null);
  const checkedIn = keys.filter(k => k.checkedOutBy === null);
  const filtered = keys.filter(k => {
    const q = search.toLowerCase();
    const matchSearch = !q || k.stockNumber.toLowerCase().includes(q) || k.model.toLowerCase().includes(q) || k.make.toLowerCase().includes(q) || (k.checkedOutBy && USERS.find(u => u.id === k.checkedOutBy)?.name.toLowerCase().includes(q));
    const matchFilter = filter === "all" || (filter === "out" && k.checkedOutBy) || (filter === "in" && !k.checkedOutBy) || (filter === "mine" && k.checkedOutBy === currentUser?.id);
    return matchSearch && matchFilter;
  });
  const myLogs = currentUser?.role === "manager" ? logs : logs.filter(l => l.userId === currentUser?.id);

  if (!currentUser) return (
    <>
      <style>{css}</style>
      <div className="login-wrap">
        <div className="login-logo">
          <div className="login-logo-icon"><IconKey size={24} color="white" /></div>
          <div className="login-brand">Key<span>Track</span></div>
        </div>
        <div className="login-sub">Toyota of Gallatin</div>
        <div className="login-card">
          <div className="login-label">SELECT EMPLOYEE</div>
          <select className="login-select" value={loginUser} onChange={e => { setLoginUser(e.target.value); setPin(""); setLoginErr(""); }}>
            {USERS.map(u => <option key={u.id} value={u.id}>{u.name}{u.role === "manager" ? " ★" : ""}</option>)}
          </select>
          <div className="login-pin-label">ENTER PIN</div>
          <div className="pin-display">
            {[0,1,2,3].map(i => <div key={i} className={`pin-dot ${i < pin.length ? "filled" : ""}`} />)}
          </div>
          <div className="pin-grid">
            {["1","2","3","4","5","6","7","8","9"].map(d => (
              <button key={d} className="pin-btn" onClick={() => handlePin(d)}>{d}</button>
            ))}
            <button className="pin-btn pin-clear" onClick={() => handlePin("clear")}>CLR</button>
            <button className="pin-btn" onClick={() => handlePin("0")}>0</button>
            <div />
          </div>
          <div className="login-err">{loginErr}</div>
        </div>
      </div>
    </>
  );

  const ScanTab = () => (
    <div className="nfc-screen">
      <div className="nfc-ring">
        <div className="nfc-pulse" />
        <IconNfc size={52} />
      </div>
      <div>
        <div className="nfc-title">Tap a Key Tag</div>
        <div style={{ color: "var(--text2)", fontSize: 14, marginTop: 8, maxWidth: 260 }}>Hold your phone to an NFC tag to instantly check a key in or out.</div>
      </div>
      <div className="demo-keys" style={{ marginTop: 8 }}>
        <div className="demo-keys-label">— DEMO: TAP TO SIMULATE SCAN —</div>
        {keys.slice(0, 5).map(k => {
          const who = k.checkedOutBy ? USERS.find(u => u.id === k.checkedOutBy) : null;
          return (
            <button key={k.tagId} className="demo-key-btn" onClick={() => openKeyModal(k)}>
              <div>
                <div className="demo-key-stock">{k.stockNumber}</div>
                <div className="demo-key-name">{k.year} {k.make} {k.model}</div>
                {who && <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginTop: 2 }}>with {who.name.split(" ")[0]}</div>}
              </div>
              <div className={`demo-key-status ${k.checkedOutBy ? "status-out" : "status-in"}`}>{k.checkedOutBy ? "OUT" : "AVAILABLE"}</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const KeysTab = () => (
    <>
      <div className="tab-header">
        <div>
          <div className="tab-title">All Keys</div>
          <div className="tab-badge">{checkedOut.length} out · {checkedIn.length} available</div>
        </div>
      </div>
      <div className="search-bar"><IconSearch size={16} /><input placeholder="Stock #, model, or name…" value={search} onChange={e => setSearch(e.target.value)} /></div>
      <div className="filter-row">
        {["all","out","in","mine"].map(f => (
          <button key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "out" ? "Checked Out" : f === "in" ? "Available" : "My Keys"}
          </button>
        ))}
      </div>
      <div className="key-list">
        {filtered.length === 0 && <div className="empty">No keys match.</div>}
        {filtered.map(k => {
          const who = k.checkedOutBy ? USERS.find(u => u.id === k.checkedOutBy) : null;
          return (
            <div key={k.tagId} className={`key-card ${k.checkedOutBy ? "checked-out" : "checked-in"}`} onClick={() => openKeyModal(k)}>
              <div className="key-card-left" style={{ flex: 1, minWidth: 0 }}>
                <div className="key-card-stock">{k.tagId} · {k.stockNumber}</div>
                <div className="key-card-name">{k.year} {k.make} {k.model}</div>
                <div className="key-card-meta"><span>{k.color}</span>{k.checkedOutBy && <span style={{ display:"flex", alignItems:"center", gap:3 }}><IconClock size={10} />{timeAgo(k.checkedOutAt)}</span>}</div>
              </div>
              <div className="key-card-right">
                <div className={`badge ${k.checkedOutBy ? "badge-out" : "badge-in"}`}>{k.checkedOutBy ? "OUT" : "IN"}</div>
                {who && <div className="key-who"><IconUser size={10} />{who.name.split(" ")[0]}</div>}
                {currentUser.role === "manager" && (
                  <button style={{ fontSize:10, color:"var(--text3)", background:"none", border:"none", cursor:"pointer", fontFamily:"var(--mono)", marginTop:2 }}
                    onClick={e => { e.stopPropagation(); setReassignModal(k); }}>reassign</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const ActivityTab = () => (
    <>
      <div className="tab-header">
        <div>
          <div className="tab-title">{currentUser.role === "manager" ? "All Activity" : "My Activity"}</div>
          <div className="tab-badge">{myLogs.length} events</div>
        </div>
      </div>
      <div className="log-list">
        {myLogs.length === 0 && <div className="empty">No activity yet.</div>}
        {myLogs.map(l => {
          const key = keys.find(k => k.tagId === l.tagId);
          const user = USERS.find(u => u.id === l.userId);
          return (
            <div key={l.id} className="log-item">
              <div className={`log-dot ${l.action === "checkout" ? "log-dot-out" : "log-dot-in"}`} />
              <div className="log-body">
                <div className="log-action">{l.action === "checkout" ? "Checked out" : "Checked in"} <span>#{l.stockNumber}</span></div>
                <div className="log-sub">{key ? `${key.year} ${key.make} ${key.model}` : l.tagId}</div>
                {currentUser.role === "manager" && <div className="log-sub" style={{ color:"var(--text2)", marginTop:2 }}>{user?.name}</div>}
              </div>
              <div className="log-time"><div>{fmtDate(l.timestamp)}</div><div>{fmtTime(l.timestamp)}</div></div>
            </div>
          );
        })}
      </div>
    </>
  );

  const DashboardTab = () => {
    const longOut = keys.filter(k => k.checkedOutBy && (Date.now() - new Date(k.checkedOutAt!).getTime()) > 3600000);
    return (
      <>
        <div className="tab-header"><div><div className="tab-title">Dashboard</div><div className="tab-badge">Manager View</div></div></div>
        <div className="stat-row">
          <div className="stat-card"><div className="stat-num" style={{ color:"var(--red)" }}>{checkedOut.length}</div><div className="stat-label">Keys Out</div></div>
          <div className="stat-card"><div className="stat-num" style={{ color:"var(--green)" }}>{checkedIn.length}</div><div className="stat-label">Available</div></div>
          <div className="stat-card"><div className="stat-num" style={{ color:"var(--amber)" }}>{longOut.length}</div><div className="stat-label">Out &gt; 1hr</div></div>
          <div className="stat-card"><div className="stat-num" style={{ color:"var(--blue)" }}>{logs.filter(l => fmtDate(l.timestamp) === fmtDate(new Date().toISOString())).length}</div><div className="stat-label">Today's Events</div></div>
        </div>
        {longOut.length > 0 && <>
          <div className="section-label">⚠ OVERDUE &gt; 1 HOUR</div>
          <div className="key-list" style={{ marginBottom:20 }}>
            {longOut.map(k => {
              const who = USERS.find(u => u.id === k.checkedOutBy);
              return (
                <div key={k.tagId} className="key-card checked-out" style={{ borderColor:"var(--amber)", borderLeftColor:"var(--amber)" }}>
                  <div style={{ flex:1 }}>
                    <div className="key-card-stock">{k.stockNumber}</div>
                    <div className="key-card-name">{k.year} {k.make} {k.model}</div>
                    <div className="key-card-meta"><IconClock size={10} />{timeAgo(k.checkedOutAt)}</div>
                  </div>
                  <div className="key-card-right">
                    <div className="badge" style={{ background:"var(--amber-dim)", color:"var(--amber)" }}>OVERDUE</div>
                    <div className="key-who"><IconUser size={10} />{who?.name.split(" ")[0]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>}
        <div className="section-label">CURRENTLY CHECKED OUT</div>
        <div className="key-list">
          {checkedOut.length === 0 && <div className="empty">All keys are in.</div>}
          {checkedOut.map(k => {
            const who = USERS.find(u => u.id === k.checkedOutBy);
            return (
              <div key={k.tagId} className="key-card checked-out">
                <div style={{ flex:1 }}>
                  <div className="key-card-stock">{k.stockNumber}</div>
                  <div className="key-card-name">{k.year} {k.make} {k.model}</div>
                  <div className="key-card-meta"><IconClock size={10} />{timeAgo(k.checkedOutAt)}</div>
                </div>
                <div className="key-card-right">
                  <div className="badge badge-out">OUT</div>
                  <div className="key-who"><IconUser size={10} />{who?.name.split(" ")[0]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const CheckModal = () => {
    if (!modal) return null;
    const { key, mode, action } = modal;
    const isOut = key.checkedOutBy !== null;
    const who = key.checkedOutBy ? USERS.find(u => u.id === key.checkedOutBy) : null;
    const isMyKey = key.checkedOutBy === currentUser.id;
    return (
      <div className="modal-overlay" onClick={() => mode !== "success" && setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-handle" />
          {mode === "success" ? (
            <div className="success-flash">
              <div className="success-icon"><IconCheck size={32} /></div>
              <div className="success-title">{action === "checkout" ? "Key Checked Out" : "Key Returned"}</div>
              <div className="success-sub">#{key.stockNumber}</div>
            </div>
          ) : (
            <>
              <div className="modal-stock">{key.tagId} · {key.stockNumber}</div>
              <div className="modal-car">{key.year} {key.make} {key.model}</div>
              <div className="modal-color">{key.color}</div>
              <div className="modal-divider" />
              <div className="modal-info-row"><IconUser size={14} />Status: <strong style={{ color: isOut ? "var(--red)" : "var(--green)" }}>{isOut ? "Checked Out" : "Available"}</strong></div>
              {who && <div className="modal-info-row"><IconUser size={14} />With: <strong>{who.name}</strong></div>}
              {key.checkedOutAt && <div className="modal-info-row"><IconClock size={14} />Since: <strong>{timeAgo(key.checkedOutAt)}</strong></div>}
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setModal(null)}>Cancel</button>
                {!isOut && <button className="btn-primary" onClick={handleAction}>Check Out</button>}
                {isOut && isMyKey && <button className="btn-danger" onClick={handleAction}>Return Key</button>}
                {isOut && !isMyKey && <button className="btn-danger" onClick={handleAction}>Take Key</button>}
              </div>
              {isOut && !isMyKey && who && <div style={{ textAlign:"center", fontSize:11, color:"var(--text3)", fontFamily:"var(--mono)", marginTop:10 }}>This will auto-check in {who.name.split(" ")[0]}</div>}
            </>
          )}
        </div>
      </div>
    );
  };

  const ReassignModal = () => {
    const [form, setForm] = useState({ stock: reassignModal?.stockNumber || "", year: reassignModal?.year?.toString() || "", make: reassignModal?.make || "", model: reassignModal?.model || "", color: reassignModal?.color || "" });
    if (!reassignModal) return null;
    return (
      <div className="modal-overlay" onClick={() => setReassignModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-handle" />
          <div className="modal-stock">{reassignModal.tagId}</div>
          <div className="modal-car" style={{ marginBottom:20 }}>Reassign Tag</div>
          <div className="reassign-form">
            {([["Stock Number","stock"],["Year","year"],["Make","make"],["Model","model"],["Color","color"]] as [string,string][]).map(([label,field]) => (
              <div key={field} className="form-field">
                <div className="form-label">{label.toUpperCase()}</div>
                <input className="form-input" value={form[field as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} placeholder={label} />
              </div>
            ))}
          </div>
          <div className="modal-actions" style={{ marginTop:20 }}>
            <button className="btn-cancel" onClick={() => setReassignModal(null)}>Cancel</button>
            <button className="btn-primary" onClick={() => handleReassign(reassignModal.tagId, form.stock, parseInt(form.year), form.make, form.model, form.color)}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const tabs = currentUser.role === "manager"
    ? [{ id:"scan", label:"Scan", icon:<IconNfc size={18}/> }, { id:"keys", label:"Keys", icon:<IconGrid size={18}/> }, { id:"activity", label:"Activity", icon:<IconList size={18}/> }, { id:"dashboard", label:"Manager", icon:<IconSettings size={18}/> }]
    : [{ id:"scan", label:"Scan", icon:<IconNfc size={18}/> }, { id:"keys", label:"Keys", icon:<IconGrid size={18}/> }, { id:"activity", label:"My Log", icon:<IconList size={18}/> }];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-left">
            <div className="header-logo"><IconKey size={16} color="white" /></div>
            <div className="header-title">Key<span>Track</span></div>
          </div>
          <div className="header-right">
            <div className="header-user">{currentUser.name.split(" ")[0]}{currentUser.role === "manager" ? " ★" : ""}</div>
            <button className="icon-btn" onClick={() => { setCurrentUser(null); setTab("scan"); }}><IconLogout /></button>
          </div>
        </div>
        <div className="content">
          {tab === "scan" && <ScanTab />}
          {tab === "keys" && <KeysTab />}
          {tab === "activity" && <ActivityTab />}
          {tab === "dashboard" && currentUser.role === "manager" && <DashboardTab />}
        </div>
        <nav className="nav">
          {tabs.map(t => (
            <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.icon}{t.label}
            </button>
          ))}
        </nav>
        <CheckModal />
        <ReassignModal />
      </div>
    </>
  );
}