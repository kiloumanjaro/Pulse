import type { NextConfig } from "next";
import { withTamagui } from "@tamagui/next-plugin";

// Tamagui's Next plugin is webpack-based; Next 16 defaults to Turbopack, which
// cannot run webpack plugins, so the dev/build scripts opt into `--webpack`.
const tamaguiPlugin = withTamagui({
  config: "./tamagui.config.ts",
  components: ["tamagui"],
  appDir: true,
  disableExtraction: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Allow the ngrok tunnel host to access dev resources (HMR, etc.).
  allowedDevOrigins: ["kind-intensely-herring.ngrok-free.app"],
  transpilePackages: [
    "react-native-web",
    "tamagui",
    "@tamagui/core",
    "@tamagui/config",
    "@tamagui/next-theme",
  ],
};

export default tamaguiPlugin(nextConfig);
