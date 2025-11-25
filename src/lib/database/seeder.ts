import settings, { BindedSetting } from '$lib/settings';
import Database from './main';

/**
 * Allow to setup the databases
 */
export default class GameSeeder {
  private static IS_SEEDED_VALUE: string = '1';
  private static IS_SEEDED_STORE: BindedSetting = settings.binded('db.is_seeded');

  /**
   * Does the database has been seeded
   */
  static get isSeeded() {
    return this.IS_SEEDED_STORE.get() === this.IS_SEEDED_VALUE;
  }
  /**
   * Seed the database
   * @param force If the database has already been seeded, do you want to clear and re-seed it ?
   */
  static async seed(force = false) {
    if (this.isSeeded && !force) return;

    for await (const table of Database.tables) {
      const data = await fetch(`/tables-data/${table.name}.json`);
      if (data.ok) {
        await table.clear();
        await table.bulkPut(await data.json());
      }
    }

    this.IS_SEEDED_STORE.set(this.IS_SEEDED_VALUE);
  }

  static forceRefreshOnNextPageLoad() {
    this.IS_SEEDED_STORE.delete();
  }
}
