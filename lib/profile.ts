import type { Profile } from "./types";
export const defaultProfile: Profile = {
  track: "javascript",
  level: "beginner",
  activeUnit: "javascript-01",
  calm: false,
  theme: "light",
  dailyGoal: 1,
  runnerUrl: "http://127.0.0.1:4319",
  aiEnabled: true,
  hintsEnabled: true,
  analogiesEnabled: true,
  mathEnabled: true,
  rewardsEnabled: true,
  largeText: false,
  autoSync: true,
};

// Old account settings and offline queues may still contain the retired cap.
export function normalizeProfile(
  settings: Partial<Profile> | Record<string, unknown>,
): Profile {
  const { tutorLimit: retiredLimit, ...current } = settings as Record<
    string,
    unknown
  >;
  return { ...defaultProfile, ...current };
}
