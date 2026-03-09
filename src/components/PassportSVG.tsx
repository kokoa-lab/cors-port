import { motion } from "framer-motion";

interface PassportSVGProps {
  origin: string;
  method: string;
  headers: Record<string, string>;
  className?: string;
}

const PassportSVG = ({ origin, method, headers, className = "" }: PassportSVGProps) => {
  return (
    <motion.div
      className={`passport-card p-6 w-72 ${className}`}
      initial={{ rotateY: -20, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Passport cover */}
      <div className="text-center mb-4">
        <div className="text-xs font-mono tracking-[0.3em] text-muted-foreground uppercase mb-1">
          Web Passport
        </div>
        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-navy flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="hsl(45, 80%, 55%)" strokeWidth="1.5" />
            <ellipse cx="16" cy="16" rx="8" ry="14" stroke="hsl(45, 80%, 55%)" strokeWidth="1" />
            <line x1="2" y1="16" x2="30" y2="16" stroke="hsl(45, 80%, 55%)" strokeWidth="1" />
            <line x1="16" y1="2" x2="16" y2="30" stroke="hsl(45, 80%, 55%)" strokeWidth="1" />
          </svg>
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">HTTP Request</h3>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b border-border/50 pb-1">
          <span className="text-muted-foreground font-mono text-xs">Origin</span>
          <span className="font-mono text-xs font-semibold text-foreground">{origin}</span>
        </div>
        <div className="flex justify-between border-b border-border/50 pb-1">
          <span className="text-muted-foreground font-mono text-xs">Method</span>
          <span className="gold-badge">{method}</span>
        </div>
        {Object.entries(headers).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b border-border/50 pb-1">
            <span className="text-muted-foreground font-mono text-xs truncate max-w-[100px]">{key}</span>
            <span className="font-mono text-xs text-foreground truncate max-w-[120px]">{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PassportSVG;
