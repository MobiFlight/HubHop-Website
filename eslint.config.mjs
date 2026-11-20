import { FlatCompat } from "@eslint/eslintrc"
import prettier from "eslint-config-prettier/flat"

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

const config = [
  {
    ignores: [
      ".next/",
      "out/",
      "playwright-report/",
      "test-results/",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Legacy code uses these widely; tighten during the code review
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "react-hooks/exhaustive-deps": "warn",
      // unused imports and variables are errors (next/typescript only warns)
      "@typescript-eslint/no-unused-vars": "error",
      // import project files from the root: "@/components/…", not "../…"
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./*", "../*"],
              message:
                'Use an absolute import: "@/<path from the project root>".',
            },
          ],
        },
      ],
    },
  },
  prettier,
]

export default config
