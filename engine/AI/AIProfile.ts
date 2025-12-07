export interface AIProfile {
  aggressiveness: number
  bluffFrequency: number
  looseness: number
}

export type AIArchetype = "ROCK" | "MATHEMATICIAN" | "MANIAC" | "SHARK" | "CALLING_STATION"

export function getAIProfile(archetype: AIArchetype): AIProfile {
  switch (archetype) {
    case "ROCK":
      return { aggressiveness: 0.2, bluffFrequency: 0.05, looseness: 0.15 }
    case "CALLING_STATION":
      return { aggressiveness: 0.1, bluffFrequency: 0.1, looseness: 0.99 }
    case "MANIAC":
      return { aggressiveness: 0.95, bluffFrequency: 0.8, looseness: 0.8 }
    case "MATHEMATICIAN":
      return { aggressiveness: 0.5, bluffFrequency: 0.1, looseness: 0.4 }
    case "SHARK":
      return { aggressiveness: 0.8, bluffFrequency: 0.35, looseness: 0.25 }
    default:
      throw new Error("Invalid archetype")
  }
}
