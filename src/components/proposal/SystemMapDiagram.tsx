export default function SystemMapDiagram() {
  const todayTools = [
    "Monday.com",
    "Gmail",
    "WhatsApp",
    "Squarespace",
    "FreeAgent",
    "Google Drive",
  ];

  const withNotionTools = [
    { label: "Google Workspace", note: "Notion Mail · Drive sync", angle: -90 },
    { label: "Squarespace", note: "product updates", angle: -18 },
    { label: "FreeAgent", note: "auto invoices", angle: 54 },
    { label: "WhatsApp", note: "comms triage", angle: 126 },
    { label: "more tools", note: "", angle: 198 },
  ];

  const polar = (cx: number, cy: number, r: number, angleDeg: number) => {
    const angle = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const rectAnchor = (
    cx: number,
    cy: number,
    tx: number,
    ty: number,
    halfW = 48,
    halfH = 16,
  ) => {
    const dx = tx - cx;
    const dy = ty - cy;
    const scale = Math.min(
      halfW / Math.max(Math.abs(dx), 0.0001),
      halfH / Math.max(Math.abs(dy), 0.0001),
    );
    return { x: tx - dx * scale, y: ty - dy * scale };
  };

  return (
    <section className="w-full bg-white px-4 py-8 font-sans text-[#1E1E1E] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        <Panel title="Today" subtitle="Every tool depends on one person.">
          <svg viewBox="0 0 520 520" role="img" aria-labelledby="today-title today-desc" className="h-auto w-full">
            <title id="today-title">Today system map</title>
            <desc id="today-desc">
              Ruaraidh is at the centre with arrows pointing outward to each separate tool.
            </desc>
            <defs>
              <marker id="arrow-coral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#D85A30" />
              </marker>
            </defs>
            {todayTools.map((tool, index) => {
              const angle = index * 60;
              const node = polar(260, 260, 180, angle);
              const start = polar(260, 260, 48, angle);
              const end = rectAnchor(260, 260, node.x, node.y, 52, 18);
              return (
                <g key={tool}>
                  <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#D85A30" strokeWidth="1.8" markerEnd="url(#arrow-coral)" />
                  <rect x={node.x - 58} y={node.y - 19} width="116" height="38" rx="10" fill="#B4B2A9" />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-[#1E1E1E] text-[13px] font-medium">
                    {tool}
                  </text>
                </g>
              );
            })}
            <circle cx="260" cy="260" r="52" fill="#D85A30" />
            <text x="260" y="266" textAnchor="middle" className="fill-white text-[17px] font-semibold">
              Ruaraidh
            </text>
          </svg>
        </Panel>

        <div className="relative hidden w-12 items-center justify-center lg:flex">
          <div className="h-full w-px bg-[#B4B2A9]" />
          <div className="absolute rotate-90 bg-white px-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#77756F]">
            Thread &amp; Stack
          </div>
        </div>
        <div className="flex items-center gap-4 lg:hidden">
          <div className="h-px flex-1 bg-[#B4B2A9]" />
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#77756F]">Thread &amp; Stack</div>
          <div className="h-px flex-1 bg-[#B4B2A9]" />
        </div>

        <Panel title="With Notion" subtitle="Ruaraidh steers. The system runs.">
          <svg viewBox="0 0 620 560" role="img" aria-labelledby="notion-title notion-desc" className="h-auto w-full">
            <title id="notion-title">With Notion system map</title>
            <desc id="notion-desc">
              Notion acts as the source of truth, Claude wraps it as an AI layer, tools connect around the orbit, and Ruaraidh steers from above.
            </desc>
            <defs>
              <marker id="arrow-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#1D9E75" />
              </marker>
            </defs>
            <circle cx="310" cy="300" r="112" fill="none" stroke="#AFA9EC" strokeWidth="2" strokeDasharray="7 7" />
            <text x="310" y="176" textAnchor="middle" className="fill-[#7F77DD] text-[13px] font-medium">
              Claude AI layer
            </text>
            <line x1="310" y1="186" x2="310" y2="224" stroke="#7F77DD" strokeWidth="1.6" />
            <rect x="250" y="128" width="120" height="46" rx="13" fill="#7F77DD" />
            <text x="310" y="148" textAnchor="middle" className="fill-white text-[15px] font-semibold">
              Ruaraidh
            </text>
            <text x="310" y="164" textAnchor="middle" className="fill-white text-[10px] font-normal opacity-95">
              at the helm
            </text>
            <circle cx="310" cy="300" r="68" fill="#1D9E75" />
            <text x="310" y="294" textAnchor="middle" className="fill-white text-[18px] font-semibold">
              Notion
            </text>
            <text x="310" y="314" textAnchor="middle" className="fill-white text-[10px] font-normal opacity-95">
              one source of truth
            </text>
            {withNotionTools.map((tool) => {
              const node = polar(310, 300, 210, tool.angle);
              const ring = polar(310, 300, 112, tool.angle);
              const end = rectAnchor(310, 300, node.x, node.y, 62, 18);
              const label = polar(310, 300, 160, tool.angle);
              return (
                <g key={tool.label}>
                  <line x1={ring.x} y1={ring.y} x2={end.x} y2={end.y} stroke="#1D9E75" strokeWidth="1.6" markerEnd="url(#arrow-teal)" />
                  {tool.note && (
                    <text x={label.x} y={label.y} textAnchor="middle" className="fill-[#5E5C58] text-[10px] italic">
                      {tool.note}
                    </text>
                  )}
                  <rect x={node.x - 70} y={node.y - 20} width="140" height="40" rx="11" fill="#B4B2A9" />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-[#1E1E1E] text-[13px] font-medium">
                    {tool.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </Panel>
      </div>
    </section>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <article className="flex min-h-full flex-col rounded-none bg-white">
      <header className="mb-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#77756F]">{title}</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#1E1E1E] sm:text-2xl">{subtitle}</h2>
      </header>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </article>
  );
}
