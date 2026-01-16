declare module 'pagedjs' {
  export class Previewer {
    constructor(options?: any)
    
    preview(
      content?: string | HTMLElement | DocumentFragment,
      stylesheets?: string[] | any[],
      renderTo?: HTMLElement
    ): Promise<{
      total: number
      performance: number
      size: any
      pages: any[]
    }>
    
    registerHandlers(...handlers: any[]): void
    
    hooks: {
      beforePreview: any
      afterPreview: any
    }
    
    on(event: string, callback: (...args: any[]) => void): void
    emit(event: string, ...args: any[]): void
  }

  export class Handler {
    constructor(chunker: any, polisher: any, caller: any)
    afterPreview?(): void | Promise<void>
  }
  
  export function registerHandlers(...handlers: any[]): void
  export function initializeHandlers(chunker: any, polisher: any, caller: any): any
}
