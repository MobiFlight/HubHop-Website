// Reporting presets is not finished yet: the dialogs send nothing to the API.
// Turn this on to show the "Reported" counts and the "Show reported presets" filter again.
export const REPORTING_ENABLED = false

// Promotions for MobiFlight (#98). Off until the real content is reviewed; the tests turn it on.
export const PROMOTIONS_ENABLED =
  process.env.NEXT_PUBLIC_PROMOTIONS_ENABLED === "true"
