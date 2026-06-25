// Minimal, controlled, presentational props. The parent owns `activeTab` and
// drives navigation; content per tab is intentionally blank for now.
export interface ControlPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch?: (term: string) => void;
}
