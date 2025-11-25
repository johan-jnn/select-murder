import type { Collection } from 'dexie';
import type { Component } from 'svelte';

let id = 0;
export abstract class Buildable<Data extends QRCard, Binded = unknown> {
  abstract binded: Binded;
  abstract readonly COMPONENT: Promise<Component>;
  readonly id: number;
  constructor(public readonly QRData: Data) {
    id++;
    this.id = id;
  }

  abstract build(query: Collection, stack: Buildable<QRCard>[]): Collection;
}
