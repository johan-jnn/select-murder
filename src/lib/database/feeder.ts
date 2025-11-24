import Database from './main';

const HAS_BEEN_FEED_STORAGE_KEY = 'select-murder_db_filled';
export async function seedDB(force = false) {
  if (window.localStorage.getItem(HAS_BEEN_FEED_STORAGE_KEY) === '1' && !force) return;

  for await (const table of Database.tables) {
    const data = await fetch(`/tables-data/${table.name}.json`);
    if (data.ok) {
      await table.clear();
      await table.bulkPut(await data.json());
    }
  }

  window.localStorage.setItem(HAS_BEEN_FEED_STORAGE_KEY, '1');
}
