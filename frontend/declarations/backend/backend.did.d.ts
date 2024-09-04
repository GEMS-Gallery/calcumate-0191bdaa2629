import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : number } |
  { 'err' : string };
export interface _SERVICE {
  'calculate' : ActorMethod<[string, number, number], Result>,
  'clearHistory' : ActorMethod<[], undefined>,
  'getHistory' : ActorMethod<[], Array<[string, number, number, number]>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
