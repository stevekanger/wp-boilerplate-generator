export type BoilerplateType = "plugin" | "theme";
export type WpContentLocation = "plugins" | "themes";

export interface TemplateVars {
  type: BoilerplateType;
  isPlugin: boolean;
  isTheme: boolean;
  title: string;
  author: string;
  authorHandle: string;
  description: string;
  slug: string;
  prefix: string;
  phpNamespace: string;
  wordpressVersion: string;
  wordpressVersionMajorMinor: string;
  phpVersion: string;
  installPath: string;
  installTests: boolean;
  wpContentLocation: WpContentLocation;
}
