declare module "next-pwa" {
    import { NextConfig } from "next";
    import { Options } from "workbox-build";
  
    interface PWAConfig {
      dest: string;
      disable?: boolean;
      register?: boolean;
      skipWaiting?: boolean;
      runtimeCaching?: Options["runtimeCaching"];
      buildExcludes?: string[];
      [key: string]: any;
    }
  
    function withPWA(config: NextConfig & { pwa?: PWAConfig }): NextConfig;
  
    export default withPWA;
  }