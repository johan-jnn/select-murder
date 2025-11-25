import type { Collection } from 'dexie';
import type { Component } from 'svelte';

export abstract class Buildable<Data extends QRCard, Binded = unknown> {
  abstract binded: Binded;
  abstract readonly COMPONENT: Promise<Component>;
  constructor(public readonly QRData: Data) {}

  abstract build(query: Collection): Collection;
}
