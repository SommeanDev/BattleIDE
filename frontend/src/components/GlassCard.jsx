const GlassCard = ({ children, className = "" }) => (
    <div className={`bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl ${className}`}>
        {children}
    </div>
);
export default GlassCard