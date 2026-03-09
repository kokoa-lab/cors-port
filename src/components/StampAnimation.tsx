import { motion, AnimatePresence } from "framer-motion";

interface StampAnimationProps {
  type: "approved" | "denied" | null;
}

const StampAnimation = ({ type }: StampAnimationProps) => {
  if (!type) return null;

  const isApproved = type === "approved";

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        initial={{ scale: 3, opacity: 0, rotate: -25 }}
        animate={{ scale: 1, opacity: 0.85, rotate: -12 }}
        transition={{ type: "spring", damping: 12, stiffness: 200, duration: 0.4 }}
      >
        <div
          className={`px-8 py-4 rounded-lg border-4 ${
            isApproved ? "border-stamp-green text-stamp-green" : "border-stamp-red text-stamp-red"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <div className="text-2xl font-bold tracking-[0.2em] uppercase">
            {isApproved ? "✓ APPROVED" : "✗ DENIED"}
          </div>
          <div className="text-xs text-center tracking-widest mt-1">
            {isApproved ? "ACCESS-CONTROL: PASS" : "CORS VIOLATION"}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StampAnimation;
