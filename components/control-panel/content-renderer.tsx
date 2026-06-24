// Blank slate: every tab renders empty, ready for per-tab content to be built.
// The sidebar + top-bar shell still switch tabs; each lands on a blank canvas.
interface ContentRendererProps {
  activeTab: string;
}

export function ContentRenderer({ activeTab }: ContentRendererProps) {
  return <div key={activeTab} className="h-full w-full" />;
}
