'use client';

import { SearchBar } from './search-bar';
import { LinkBar } from './link-bar';
import {
  ProfileProgress,
  type ProfileStep,
} from '@/components/ui/profile-progress';

interface TopBarProps {
  activeTab: string;
  onSearch?: (term: string) => void;
}

// Placeholder profile steps until real profile data is wired up.
const PROFILE_STEPS: ProfileStep[] = [
  { title: 'Basic Information', description: 'Complete your name', completed: true },
  { title: 'Profile Picture', description: 'Upload a profile picture', completed: true },
  { title: 'Verification', description: 'Verify your email address', completed: false },
  { title: 'Link', description: 'Link your account', completed: false },
];

export function TopBar({ activeTab, onSearch }: TopBarProps) {
  const showSearchBar = activeTab === 'stats';
  const showProfileProgress = activeTab === 'profile';
  const showLinkBar = activeTab === 'simulations' || activeTab === 'chatbot';

  return (
    // Top bar chrome — a 1px gray-20 hairline below it, echoing the blueprint
    // grid (§5, §9). Controls inside are shadcn/Radix.
    <div className="flex flex-row items-center gap-2 py-3 px-4 border-b border-gray-20">
      {showSearchBar && <SearchBar onSearch={onSearch ?? (() => {})} />}

      {showProfileProgress && (
        <ProfileProgress
          current={PROFILE_STEPS.filter((step) => step.completed).length}
          total={PROFILE_STEPS.length}
          steps={PROFILE_STEPS}
        />
      )}

      {showLinkBar && (
        <div className="h-8.5 flex-1">
          <LinkBar link="project-drain.vercel.app/simulation" />
        </div>
      )}
    </div>
  );
}
