"use client";

import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { useServerInsertedHTML } from "next/navigation";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../tamagui.config";

export function NextTamaguiProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useRootTheme();

  useServerInsertedHTML(() => {
    const rnwStyle = StyleSheet.getSheet();
    return (
      <>
        <style
          dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }}
          id={rnwStyle.id}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: tamaguiConfig.getCSS({
              exclude:
                process.env.NODE_ENV === "production" ? "design-system" : null,
            }),
          }}
        />
      </>
    );
  });

  return (
    <NextThemeProvider
      skipNextHead
      onChangeTheme={(next) => {
        setTheme(next as "light" | "dark");
      }}
    >
      <TamaguiProvider
        config={tamaguiConfig}
        disableRootThemeClass
        defaultTheme={theme}
      >
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  );
}
