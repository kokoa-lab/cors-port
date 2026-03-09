import { motion, AnimatePresence } from "framer-motion";

export interface LogEntry {
  id: number;
  type: "info" | "request" | "response" | "success" | "error";
  message: string;
  detail?: string;
}

interface SimulationLogProps {
  logs: LogEntry[];
}

const typeStyles: Record<LogEntry["type"], string> = {
  info: "text-muted-foreground",
  request: "text-foreground",
  response: "text-accent-foreground",
  success: "text-stamp-green",
  error: "text-stamp-red",
};

const typeIcons: Record<LogEntry["type"], string> = {
  info: "ℹ️",
  request: "→",
  response: "←",
  success: "✓",
  error: "✗",
};

const SimulationLog = ({ logs }: SimulationLogProps) => {
  return (
    <div className="terminal-box max-h-64 overflow-y-auto space-y-1">
      <AnimatePresence>
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-xs ${typeStyles[log.type]}`}
          >
            <span className="mr-2">{typeIcons[log.type]}</span>
            <span>{log.message}</span>
            {log.detail && (
              <span className="text-muted-foreground ml-2">// {log.detail}</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {logs.length === 0 && (
        <div className="text-xs text-muted-foreground italic">시뮬레이션을 시작하세요...</div>
      )}
    </div>
  );
};

export default SimulationLog;
