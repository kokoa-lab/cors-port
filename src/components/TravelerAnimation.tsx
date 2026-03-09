import { motion } from "framer-motion";

interface TravelerAnimationProps {
  stage: "idle" | "flying" | "checkpoint" | "approved" | "denied";
}

const TravelerAnimation = ({ stage }: TravelerAnimationProps) => {
  const getX = () => {
    switch (stage) {
      case "idle": return "5%";
      case "flying": return "40%";
      case "checkpoint": return "55%";
      case "approved": return "90%";
      case "denied": return "5%";
    }
  };

  return (
    <div className="relative w-full h-24 overflow-hidden rounded-lg bg-muted/30">
      {/* Origin label */}
      <div className="absolute left-4 top-2 text-xs font-mono text-muted-foreground">
        🌐 Origin
      </div>
      {/* Checkpoint */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2 text-xs font-mono text-muted-foreground">
        🛂 CORS 심사대
      </div>
      {/* Server */}
      <div className="absolute right-4 top-2 text-xs font-mono text-muted-foreground">
        🖥️ Server
      </div>

      {/* Runway */}
      <div className="absolute bottom-8 left-0 right-0 runway" />

      {/* Traveler */}
      <motion.div
        className="absolute bottom-10 text-3xl"
        animate={{
          left: getX(),
          rotate: stage === "denied" ? [0, -10, 10, -10, 0] : 0,
        }}
        transition={{
          left: { type: "spring", damping: 20, stiffness: 80 },
          rotate: { duration: 0.5 },
        }}
      >
        {stage === "denied" ? "😰" : stage === "approved" ? "😊" : "✈️"}
      </motion.div>

      {/* Checkpoint gate */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 top-10 w-0.5 border-l-2 border-dashed border-muted-foreground/30" />
    </div>
  );
};

export default TravelerAnimation;
