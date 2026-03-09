import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PassportSVG from "@/components/PassportSVG";
import StampAnimation from "@/components/StampAnimation";
import TravelerAnimation from "@/components/TravelerAnimation";
import HeaderConfigForm, { type CORSConfig } from "@/components/HeaderConfigForm";
import SimulationLog, { type LogEntry } from "@/components/SimulationLog";
import { conceptOrder, concepts } from "@/pages/ConceptPage";

const defaultConfig: CORSConfig = {
  clientOrigin: "https://myapp.com",
  method: "GET",
  contentType: "text/plain",
  customHeader: false,
  serverAllowOrigin: "*",
  serverAllowMethods: "GET, POST",
  serverAllowHeaders: "Content-Type",
};

type SimStage = "config" | "preflight-check" | "preflight" | "request" | "result";
type TravelerStage = "idle" | "flying" | "checkpoint" | "approved" | "denied";

const needsPreflight = (config: CORSConfig) => {
  const simpleMethods = ["GET", "HEAD", "POST"];
  const simpleContentTypes = ["text/plain", "application/x-www-form-urlencoded", "multipart/form-data"];
  if (!simpleMethods.includes(config.method)) return true;
  if (!simpleContentTypes.includes(config.contentType)) return true;
  if (config.customHeader) return true;
  return false;
};

const checkCORS = (config: CORSConfig) => {
  if (config.serverAllowOrigin === "none") return false;
  if (config.serverAllowOrigin !== "*" && config.serverAllowOrigin !== config.clientOrigin) return false;
  const allowedMethods = config.serverAllowMethods.split(",").map((m) => m.trim().toUpperCase());
  if (!allowedMethods.includes(config.method)) return false;
  if (config.customHeader) {
    const allowedHeaders = config.serverAllowHeaders.split(",").map((h) => h.trim().toLowerCase());
    if (!allowedHeaders.includes("x-custom-header")) return false;
  }
  return true;
};

const Index = () => {
  const [config, setConfig] = useState<CORSConfig>(defaultConfig);
  const [stage, setStage] = useState<SimStage>("config");
  const [travelerStage, setTravelerStage] = useState<TravelerStage>("idle");
  const [stampType, setStampType] = useState<"approved" | "denied" | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logId, setLogId] = useState(0);

  const addLog = useCallback(
    (type: LogEntry["type"], message: string, detail?: string) => {
      setLogId((prev) => {
        const newId = prev + 1;
        setLogs((l) => [...l, { id: newId, type, message, detail }]);
        return newId;
      });
    },
    []
  );

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const runSimulation = async () => {
    setLogs([]);
    setStampType(null);
    setStage("preflight-check");
    setTravelerStage("idle");

    await sleep(500);
    addLog("info", `출발지: ${config.clientOrigin}`, "Origin 헤더 설정");
    addLog("request", `${config.method} /api/data`, `Content-Type: ${config.contentType}`);

    await sleep(800);
    setTravelerStage("flying");

    const hasPreflight = needsPreflight(config);

    if (hasPreflight) {
      setStage("preflight");
      addLog("info", "⚠️ 사전 입국 심사 필요!", "Simple Request가 아닙니다");
      await sleep(600);
      addLog("request", "OPTIONS /api/data (Preflight)", "사전 심사 요청 전송");
      await sleep(800);
      setTravelerStage("checkpoint");
      addLog("response", `Allow-Origin: ${config.serverAllowOrigin}`, "서버 응답 확인 중...");
      addLog("response", `Allow-Methods: ${config.serverAllowMethods}`);
      if (config.customHeader) {
        addLog("response", `Allow-Headers: ${config.serverAllowHeaders}`);
      }
      await sleep(800);
    } else {
      addLog("info", "✅ Simple Request — 사전 심사 불필요", "GET/HEAD/POST + 기본 헤더");
      await sleep(600);
      setTravelerStage("checkpoint");
      setStage("request");
    }

    const allowed = checkCORS(config);
    await sleep(600);
    setStage("result");

    if (allowed) {
      addLog("success", "입국 허가! CORS 검사 통과 ✓");
      setStampType("approved");
      setTravelerStage("approved");
    } else {
      const reason =
        config.serverAllowOrigin === "none"
          ? "비자 없음 (Allow-Origin 미설정)"
          : config.serverAllowOrigin !== "*" && config.serverAllowOrigin !== config.clientOrigin
          ? `비자 불일치 (서버: ${config.serverAllowOrigin} ≠ 요청: ${config.clientOrigin})`
          : !config.serverAllowMethods.toUpperCase().includes(config.method)
          ? `비행편 거부 (${config.method} 미허용)`
          : "커스텀 헤더 미허용";
      addLog("error", `입국 거부! ${reason}`);
      addLog("error", "❌ CORS Error: blocked by CORS policy");
      setStampType("denied");
      setTravelerStage("denied");
    }
  };

  const reset = () => {
    setStage("config");
    setTravelerStage("idle");
    setStampType(null);
    setLogs([]);
  };

  const headers: Record<string, string> = {
    "Content-Type": config.contentType,
  };
  if (config.customHeader) headers["X-Custom-Header"] = "true";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="bg-navy py-12 px-4 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-3xl">🛂</span>
            <span className="text-3xl">×</span>
            <span className="text-3xl">✈️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-3">
            CORSport
          </h1>
          <p className="text-primary-foreground/70 font-body text-sm md:text-base leading-relaxed">
            CORS를 공항 출입국 심사로 이해하기
            <br className="hidden sm:block" />
            — 요청이 서버에 도착하려면 어떤 "여권 심사"를 통과해야 할까?
          </p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="gold-badge">Access-Control = 비자</span>
            <span className="gold-badge">Preflight = 사전심사</span>
            <span className="gold-badge">Headers = 여권</span>
          </div>
        </motion.div>
        {/* Decorative */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 text-8xl">🛂</div>
          <div className="absolute bottom-5 right-10 text-8xl">✈️</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Traveler animation */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <TravelerAnimation stage={travelerStage} />
        </motion.section>

        {/* Config form */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-display text-xl font-bold">헤더 설정</h2>
            <div className="flex gap-2">
              {stage !== "config" && (
                <Button variant="outline" size="sm" onClick={reset}>
                  초기화
                </Button>
              )}
              <Button
                size="sm"
                onClick={runSimulation}
                disabled={stage !== "config" && stage !== "result"}
                className="bg-navy hover:bg-navy-light text-primary-foreground"
              >
                {stage === "result" ? "다시 시뮬레이션" : "🛫 출발!"}
              </Button>
            </div>
          </div>
          <HeaderConfigForm config={config} onChange={setConfig} />
        </section>

        {/* Passport + Result area */}
        <section className="grid gap-6 md:grid-cols-2 items-start">
          <div className="relative">
            <h2 className="font-display text-xl font-bold mb-4">여권 (Request)</h2>
            <div className="relative">
              <PassportSVG origin={config.clientOrigin} method={config.method} headers={headers} />
              <StampAnimation type={stampType} />
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold mb-4">심사 로그</h2>
            <SimulationLog logs={logs} />

            {stage === "result" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 passport-card p-4 text-sm space-y-2"
              >
                <h3 className="font-display font-bold text-base">💡 무슨 일이 일어났나요?</h3>
                {needsPreflight(config) ? (
                  <p className="text-muted-foreground leading-relaxed">
                    이 요청은 <strong>Simple Request</strong>가 아니므로 브라우저가 자동으로{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">OPTIONS</code>{" "}
                    (Preflight) 요청을 먼저 보냈습니다.
                    서버가 사전 심사에서 허가해야만 실제 요청이 전송됩니다.
                  </p>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    이 요청은 <strong>Simple Request</strong>입니다.
                    GET/HEAD/POST + 기본 Content-Type만 사용하면
                    Preflight 없이 바로 요청이 전송되지만,
                    여전히 서버의 CORS 헤더 검사를 통과해야 합니다.
                  </p>
                )}
                {stampType === "denied" && (
                  <p className="text-stamp-red text-xs font-mono">
                    Tip: 서버의 Allow-Origin, Allow-Methods, Allow-Headers를 조정해보세요!
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* Concept cards - now link to detail pages */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4">📚 CORS 개념 배우기</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {conceptOrder.map((slug) => {
              const c = concepts[slug];
              return (
                <Link key={slug} to={`/concept/${slug}`}>
                  <motion.div
                    className="passport-card p-5 h-full cursor-pointer"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{c.emoji}</span>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-sm">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{c.subtitle}</p>
                        <div className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-gold">
                          자세히 보기 <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="text-center py-8 text-xs text-muted-foreground font-mono">
        CORSport — CORS 인터랙티브 튜토리얼
      </footer>
    </div>
  );
};

export default Index;
