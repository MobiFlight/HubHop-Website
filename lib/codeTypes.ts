// X-Plane preset code types, as supported by the MobiFlight Connector.
// Defined here on purpose: new code types must not be created from data or user input.
export const CODE_TYPES = ["DataRef", "Command"] as const

export type CodeType = (typeof CODE_TYPES)[number]
