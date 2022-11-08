// Type definitions for SockJS 0.3.x
// Project: https://github.com/sockjs/sockjs-client
// Definitions by: Emil Ivanov <https://github.com/vladev>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

export interface SockJSSimpleEvent {
  type      : string;
  toString(): string;
}

//noinspection TsLint
export interface SJSOpenEvent extends SockJSSimpleEvent {
}

export interface SJSCloseEvent extends SockJSSimpleEvent {
  code      : number;
  reason    : string;
  wasClean  : boolean;
}

export interface SJSMessageEvent extends SockJSSimpleEvent {
  data : string;
}

export interface SockJS extends EventTarget {
  OPEN        : number;
  CLOSING     : number;
  CONNECTING  : number;
  CLOSED      : number;
  protocol    : string;
  readyState  : number;
  onopen      : (ev: SJSOpenEvent) => any;
  onmessage   : (ev: SJSMessageEvent) => any;
  onclose     : (ev: SJSCloseEvent) => any;
  send(data: any): void;
  close(code?: number, reason?: string): void;
}

declare var SockJS: {
  prototype : SockJS;
  new (url: string, _reserved?: any, options?: {
    debug?                : boolean;
    devel?                : boolean;
    protocols_whitelist?  : string[];
    server?               : string;
    rtt?                  : number;
    rto?                  : number;
    info?                 : {
      websocket?      : boolean;
      cookie_needed?  : boolean;
      null_origin?    : boolean;
    };
  }): SockJS;
};
