import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.@(js|jsx|ts|tsx)"], // 👈 Update this path!
  addons: ["@storybook/addon-essentials"],
  framework: "@storybook/nextjs",
};

export default config;
