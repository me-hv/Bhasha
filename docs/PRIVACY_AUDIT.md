# BHASHA — PRIVACY & NETWORK TELEMETRY AUDIT

---

## 1. Privacy Guarantee & Policy

BHASHA is built on an uncompromising privacy promise:
> **"Your lyrics, rhymes, vocabulary notes, and creative ideas never leave your machine."**

Songwriters frequently write their most personal, unreleased, vulnerable, and confidential thoughts inside BHASHA. BHASHA is designed from the ground up as a **zero-network, local-first instrument**.

---

## 2. Technical Network Surface Audit

| Network Mechanism | Status in BHASHA | Verification Result |
|---|---|---|
| `fetch()` calls to external APIs | **0 Calls** | Verified across all `src/` modules. |
| `XMLHttpRequest` (XHR) | **0 Calls** | Verified. No legacy AJAX requests. |
| `WebSocket` connections | **0 Connections** | Verified. No live sockets. |
| Cloud Analytics / Trackers (Google Analytics, Mixpanel, Sentry) | **0 Trackers** | Verified. Zero tracking pixels, scripts, or telemetry SDKs. |
| External LLM / AI APIs (OpenAI, Gemini, Anthropic) | **0 Integrations** | Verified. All phonetic, syllable, rhyme, and graph engines execute locally in pure TypeScript. |
| Remote Logging / Crash Reporting | **0 Remote Endpoints** | Verified. All errors logged to browser console or local diagnostics. |
| User Accounts / Authentication Systems | **0 External Auth** | Verified. No login, OAuth, passwords, or cookies required. |
| Audio/Microphone Permissions | **0 Recording** | Verified. Metronome audio synthesis uses local Web Audio API synthesizer oscillators (`AudioContext`) only. |

---

## 3. Local Storage & File Access Boundaries

- **Persistence Target**: `window.localStorage` (scoped strictly to `http://localhost:3000` or local origin).
- **Export/Import Mechanism**: Standard HTML5 Blob download and FileReader APIs executing 100% in client memory without server roundtrips.
- **Corpus Data**: Packaged directly as static TypeScript modules within the application bundle (`src/data/words.ts`, `src/lib/language-engine/`).

---

## 4. Audit Signoff

BHASHA is **100% private, offline, and air-gapped capable**. It requires no internet connection to operate any of its rhyme discovery, syllable meter, song workspace, or library functions.
