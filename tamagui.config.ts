import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui } from "tamagui";

export const config = createTamagui(defaultConfig);

export default config;

export type AppConfig = typeof config;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}
