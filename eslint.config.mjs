import nextConfig from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["legacy/**", ".next/**", "node_modules/**"],
  },
];

export default eslintConfig;
