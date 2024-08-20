// global.d.ts
export {};

declare global {
    namespace NodeJS {
      interface Global {
        testTaskUrl: string; // You can specify a type other than `any` as needed
      }
    }
  }
