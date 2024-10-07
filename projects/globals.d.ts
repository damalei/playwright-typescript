// global.d.ts
export {};

declare global {
    namespace NodeJS {
      interface Global {
        testTaskUrl: string; 
        shipperUrl: string;
      }
    }
  }
