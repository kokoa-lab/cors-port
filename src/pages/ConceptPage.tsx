import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ConceptSection {
  title: string;
  airport: string;
  content: string;
  code?: string;
}

interface ConceptData {
  emoji: string;
  title: string;
  subtitle: string;
  airportMetaphor: string;
  sections: ConceptSection[];
  nextSlug?: string;
  nextTitle?: string;
  prevSlug?: string;
  prevTitle?: string;
}

const concepts: Record<string, ConceptData> = {
  "same-origin-policy": {
    emoji: "🏛️",
    title: "Same-Origin Policy",
    subtitle: "동일 출처 정책",
    airportMetaphor: "국내선 vs 국제선 — 같은 나라(Origin) 안에서는 자유롭게 이동하지만, 다른 나라로 가려면 반드시 출입국 심사를 받아야 합니다.",
    sections: [
      {
        title: "Origin이란?",
        airport: "🌍 Origin = 국가 (프로토콜 + 도메인 + 포트)",
        content:
          "웹에서 Origin은 프로토콜(https), 도메인(myapp.com), 포트(443)의 조합입니다. 이 세 가지가 모두 같아야 '같은 Origin'입니다. 공항에 비유하면, 같은 나라 안의 국내선은 여권 없이 탈 수 있지만, 다른 나라로 가는 국제선은 반드시 여권 심사를 거쳐야 하는 것과 같습니다.",
        code: `// 같은 Origin (국내선 ✈️ → 여권 불필요)
https://myapp.com/page1
https://myapp.com/page2

// 다른 Origin (국제선 🌏 → 여권 심사 필요)
https://myapp.com  →  https://api.other.com  ❌
http://myapp.com   →  https://myapp.com      ❌  (프로토콜 다름)
https://myapp.com  →  https://myapp.com:8080  ❌  (포트 다름)`,
      },
      {
        title: "왜 필요한가?",
        airport: "🔒 국경 보안 = 브라우저 보안",
        content:
          "만약 국경이 없다면, 악의적인 사이트가 당신의 은행 사이트에 마음대로 요청을 보내 개인정보를 훔칠 수 있습니다. Same-Origin Policy는 브라우저가 자동으로 설정하는 '국경'입니다. 공항의 출입국 관리처럼, 허가 없는 외국인(다른 Origin)의 접근을 기본적으로 차단합니다.",
      },
      {
        title: "SOP의 범위",
        airport: "📋 어떤 항목이 국경 심사 대상인가?",
        content:
          "SOP는 XMLHttpRequest, Fetch API 호출, Web Fonts(@font-face), WebGL 텍스처, Canvas의 drawImage 등에 적용됩니다. 반면, <img>, <script>, <link> 태그 등은 역사적 이유로 cross-origin이 허용됩니다. 이는 마치 관광 비자 면제 국가처럼, 특정 '안전한' 자원은 심사 없이 통과시키는 것과 같습니다.",
      },
    ],
    nextSlug: "simple-vs-preflight",
    nextTitle: "Simple vs Preflight Request",
  },
  "simple-vs-preflight": {
    emoji: "📋",
    title: "Simple vs Preflight Request",
    subtitle: "일반 입국 vs 사전 심사",
    airportMetaphor: "일부 국가는 무비자로 바로 입국(Simple Request)할 수 있지만, 특수한 경우엔 사전 입국 허가(Preflight)를 받아야 합니다.",
    sections: [
      {
        title: "Simple Request 조건",
        airport: "🟢 무비자 입국 = Simple Request",
        content:
          "다음 조건을 모두 충족하면 브라우저는 Preflight 없이 바로 요청을 보냅니다. 마치 무비자 협정 국가에서 온 여행자가 바로 입국 심사대에 설 수 있는 것과 같습니다.",
        code: `// Simple Request 조건 (무비자 입국 자격)
✅ Method: GET, HEAD, POST 중 하나
✅ Content-Type: text/plain, multipart/form-data,
   application/x-www-form-urlencoded 중 하나
✅ 커스텀 헤더 없음 (Accept, Content-Type 등 기본만)

// 예시: 무비자 입국 가능
fetch("https://api.com/data")  // GET + 기본 헤더`,
      },
      {
        title: "Preflight가 필요한 경우",
        airport: "🔶 사전 입국 심사 = OPTIONS 요청",
        content:
          "조건을 하나라도 벗어나면 브라우저는 자동으로 OPTIONS 메서드로 '사전 심사' 요청을 보냅니다. 이는 비자가 필요한 국가에서 사전에 비자 신청서를 제출하는 것과 같습니다. 서버가 허가 응답을 보내야만 실제 요청이 전송됩니다.",
        code: `// Preflight 발생 (사전 심사 필요)
fetch("https://api.com/data", {
  method: "PUT",           // ❌ Simple이 아닌 메서드
  headers: {
    "Content-Type": "application/json",  // ❌ 비표준 타입
    "Authorization": "Bearer token"      // ❌ 커스텀 헤더
  }
})

// 브라우저가 자동으로 보내는 Preflight:
// OPTIONS /data
// Access-Control-Request-Method: PUT
// Access-Control-Request-Headers: content-type, authorization`,
      },
      {
        title: "Preflight 응답",
        airport: "🛂 심사관의 허가/거부 도장",
        content:
          "서버는 Preflight 요청에 대해 어떤 Origin, Method, Header를 허용하는지 응답합니다. 또한 max-age로 '비자 유효기간'을 설정해, 일정 시간 동안은 재심사 없이 통과할 수 있게 합니다.",
        code: `// 서버의 Preflight 응답 (입국 허가서)
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400  // 비자 유효기간: 24시간`,
      },
    ],
    prevSlug: "same-origin-policy",
    prevTitle: "Same-Origin Policy",
    nextSlug: "credentials",
    nextTitle: "Credentials",
  },
  credentials: {
    emoji: "🔐",
    title: "Credentials",
    subtitle: "신원 증명 (쿠키, 인증 토큰)",
    airportMetaphor: "일반 관광과 달리, 출입국 시 특수한 신분증(쿠키/인증 토큰)을 제시하려면 더 엄격한 심사를 받아야 합니다. '모든 국가 허용(*)' 비자로는 신분증을 들고 입국할 수 없습니다.",
    sections: [
      {
        title: "Credentials란?",
        airport: "🪪 신분증 = 쿠키, Authorization 헤더, TLS 인증서",
        content:
          "CORS에서 credentials란 쿠키, HTTP 인증 헤더, TLS 클라이언트 인증서를 뜻합니다. 기본적으로 cross-origin 요청에는 이런 자격 정보가 포함되지 않습니다. 공항에 비유하면, 보통 관광객은 짐만 들고 오지만, 외교관은 특별한 신분증을 제시해야 하는 것과 같습니다.",
        code: `// Credentials 포함 요청 (신분증 제시)
fetch("https://api.com/me", {
  credentials: "include"  // 쿠키를 함께 전송
})

// XMLHttpRequest의 경우
xhr.withCredentials = true;`,
      },
      {
        title: "서버 측 요구사항",
        airport: "⚠️ 와일드카드(*) 비자로는 신분증 입국 불가",
        content:
          "Credentials를 포함한 요청을 받으려면, 서버는 Access-Control-Allow-Origin에 와일드카드(*)를 사용할 수 없고, 정확한 Origin을 명시해야 합니다. 또한 Access-Control-Allow-Credentials: true를 반드시 설정해야 합니다. 이는 마치 '모든 국가 무비자 입국' 정책으로는 외교관 신분증 심사를 할 수 없어, 국가별 협정이 필요한 것과 같습니다.",
        code: `// ❌ 잘못된 설정 (와일드카드 + Credentials)
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
// → 브라우저가 차단!

// ✅ 올바른 설정 (정확한 Origin 명시)
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Credentials: true`,
      },
      {
        title: "보안 주의사항",
        airport: "🛡️ 신분증 위조 방지 = SameSite, Secure",
        content:
          "Credentials를 사용할 때는 CSRF 공격에 특히 주의해야 합니다. 쿠키의 SameSite 속성과 Secure 플래그를 적절히 설정하고, 서버에서 Origin 검증을 철저히 해야 합니다. 공항 보안처럼, 신분증(쿠키)의 진위 여부를 반드시 확인하는 절차가 필요합니다.",
        code: `// 안전한 쿠키 설정 (위조 방지)
Set-Cookie: session=abc123;
  SameSite=None;   // cross-site 전송 허용
  Secure;          // HTTPS에서만 전송
  HttpOnly;        // JS 접근 차단`,
      },
    ],
    prevSlug: "simple-vs-preflight",
    prevTitle: "Simple vs Preflight Request",
    nextSlug: "common-headers",
    nextTitle: "주요 CORS 헤더",
  },
  "common-headers": {
    emoji: "📄",
    title: "주요 CORS 헤더 총정리",
    subtitle: "여권에 들어가는 모든 도장들",
    airportMetaphor: "출입국 심사에서 확인하는 다양한 서류(헤더)들을 하나씩 살펴봅시다. 각 헤더는 입국 심사의 특정 질문에 해당합니다.",
    sections: [
      {
        title: "요청 헤더 (여행자가 제출하는 서류)",
        airport: "📤 여행자 → 심사관",
        content:
          "브라우저가 Preflight 요청에 자동으로 추가하는 헤더입니다. 여행자가 '이런 목적으로, 이런 물건을 가지고 입국하겠습니다'라고 신고하는 것과 같습니다.",
        code: `// 브라우저가 자동 추가하는 요청 헤더
Origin: https://myapp.com
// → "저는 이 나라에서 왔습니다"

Access-Control-Request-Method: PUT
// → "이런 목적(메서드)으로 입국합니다"

Access-Control-Request-Headers: Authorization, Content-Type
// → "이런 물건(헤더)을 반입합니다"`,
      },
      {
        title: "응답 헤더 (심사관의 판정)",
        airport: "📥 심사관 → 여행자",
        content:
          "서버가 응답에 포함하는 CORS 헤더들입니다. 각각이 심사관의 질문에 대한 답변이자 허가/거부 도장입니다.",
        code: `// 서버 응답 헤더 (심사관의 판정)
Access-Control-Allow-Origin: https://myapp.com
// → "이 국가 출신은 입국 허가"

Access-Control-Allow-Methods: GET, POST, PUT
// → "이 목적들은 허가"

Access-Control-Allow-Headers: Authorization, Content-Type
// → "이 물건 반입 허가"

Access-Control-Expose-Headers: X-Custom-Header
// → "이 정보는 열람 가능" (기본 외 헤더 노출)

Access-Control-Max-Age: 86400
// → "비자 유효기간: 24시간 (재심사 불필요)"

Access-Control-Allow-Credentials: true
// → "신분증(쿠키) 제시 허가"`,
      },
    ],
    prevSlug: "credentials",
    prevTitle: "Credentials",
  },
};

const conceptOrder = ["same-origin-policy", "simple-vs-preflight", "credentials", "common-headers"];

const ConceptPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const concept = slug ? concepts[slug] : null;

  if (!concept) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">개념을 찾을 수 없습니다.</p>
          <Link to="/">
            <Button variant="outline">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIdx = conceptOrder.indexOf(slug!);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy py-10 px-4 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground/90 transition-colors text-sm font-mono mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            CORSport 홈으로
          </Link>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-4xl mb-3 block">{concept.emoji}</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">
              {concept.title}
            </h1>
            <p className="text-primary-foreground/60 font-mono text-sm">{concept.subtitle}</p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Airport metaphor intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="passport-card p-6"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">✈️</span>
            <p className="text-sm leading-relaxed text-foreground">{concept.airportMetaphor}</p>
          </div>
        </motion.div>

        {/* Sections */}
        {concept.sections.map((section, i) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="space-y-4"
          >
            <h2 className="font-display text-xl font-bold">{section.title}</h2>

            <div className="gold-badge text-xs">{section.airport}</div>

            <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>

            {section.code && (
              <div className="terminal-box overflow-x-auto">
                <pre className="text-xs leading-relaxed whitespace-pre">{section.code}</pre>
              </div>
            )}
          </motion.section>
        ))}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          {concept.prevSlug ? (
            <Link to={`/concept/${concept.prevSlug}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-3 h-3" />
                {concept.prevTitle}
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {concept.nextSlug ? (
            <Link to={`/concept/${concept.nextSlug}`}>
              <Button variant="outline" size="sm" className="gap-2">
                {concept.nextTitle}
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          ) : (
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                시뮬레이터로 돌아가기
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          )}
        </div>

        {/* All concepts nav */}
        <div className="passport-card p-5">
          <h3 className="font-display font-bold text-sm mb-3">📚 모든 개념</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {conceptOrder.map((s) => {
              const c = concepts[s];
              const isCurrent = s === slug;
              return (
                <Link
                  key={s}
                  to={`/concept/${s}`}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isCurrent
                      ? "bg-accent/20 font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span>{c.emoji}</span>
                  <span className="truncate">{c.title}</span>
                  {isCurrent && <span className="ml-auto text-xs text-gold">현재</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-xs text-muted-foreground font-mono">
        CORSport — CORS 인터랙티브 튜토리얼
      </footer>
    </div>
  );
};

export { conceptOrder, concepts };
export default ConceptPage;
