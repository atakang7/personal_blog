// src/pages/about.js
export default function AboutPage() {
  // Pre-calculate the decorative elements array to avoid recreation on renders
  const decorativeElements = Array(6).fill(null).map((_, i) => ({
    width: '40%',
    height: '40%',
    border: '1px solid',
    transform: `rotate(${i * 15}deg)`,
    left: '30%',
    top: '30%'
  }));

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-[60vh] bg-gradient-to-r from-slate-50 to-gray-50 relative overflow-hidden pb-32 pt-20">
        <div className="absolute inset-0 opacity-10">
          {decorativeElements.map((style, i) => (
            <div
              key={i}
              className="absolute border-slate-900/10"
              style={style}
            />
          ))}
        </div>
        <div className="max-w-3xl mx-auto px-6 h-full flex items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-slate-900">
              Notes & Thoughts<span className="text-slate-400">.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
              A personal space for engineering insights and occasional thoughts on daily discoveries
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-3xl mx-auto px-6 -mt-24 z-10 mb-20">
        <div className="bg-white p-6 md:p-8 shadow-sm border-t border-slate-100 rounded-lg">
          <p className="text-slate-700 text-base md:text-lg leading-relaxed">
            Welcome to my corner of the web. Here, I write primarily about software engineering 
            and system design, interspersed with observations from everyday experiences that 
            shape my approach to problem-solving.
          </p>
        </div>

        <div className="mt-8 md:mt-12">
          <div className="bg-white p-6 md:p-8 shadow-sm border border-slate-100 rounded-lg">
            <p className="text-slate-600 leading-relaxed">
              From technical deep-dives to casual observations, these writings reflect 
              both the professional and personal sides of an engineering journey.
            </p>
          </div>
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Updated regularly with new insights and experiences
          </p>
        </div>
      </div>
    </div>
  );
}