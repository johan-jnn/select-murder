import type { Component } from 'svelte';

let id = 0;
type MaybePromise<T> = T | Promise<T>;
export abstract class Buildable<Data extends QRCard, Binded = unknown> {
  abstract binded: Binded;
  abstract readonly COMPONENT: Promise<Component>;
  abstract readonly PRIORITY: number;
  readonly id: number;
  constructor(public readonly QRData: Data) {
    id++;
    this.id = id;
  }

  abstract build(
    query: { [key: string]: string }[],
    table: TableCard,
    stack: Buildable<QRCard>[]
  ): MaybePromise<{ [key: string]: string }[]>;
}
