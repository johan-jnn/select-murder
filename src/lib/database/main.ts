import Dexie, { type EntityTable } from 'dexie';

const database = new Dexie('SELECT_MURDER') as Dexie & {
  suspects: EntityTable<
    {
      id: number;
      name: string;
      birthdate: Date;
      crime_scene_id: number;
    },
    'id'
  >;
  clues: EntityTable<
    {
      id: number;
      object: string;
      details?: string;
      crime_scene_id: number;
      suspect_id?: number;
    },
    'id'
  >;
  crime_scenes: EntityTable<
    {
      id: number;
      name: string;
      description: string;
      date: Date;
      place_id: number;
    },
    'id'
  >;
  testimonies: EntityTable<
    {
      id: number;
      testimony: string;
      suspect_id: number;
    },
    'id'
  >;
  cameras: EntityTable<
    {
      id: number;
      angle: string;
      record_starts: Date;
      record_ends: Date;
      record?: string;
      place_id: number;
    },
    'id'
  >;

  places: EntityTable<
    {
      id: number;
      name: string;
    },
    'id'
  >;
};
database.version(1).stores({
  suspects: '++id,&name,birthdate,crime_scene_id',
  clues: '++id,object,details,crime_scene_id,suspect_id',
  crime_scenes: '++id,name,date,place_id,description',
  testimonies: '++id,testimony,suspect_id',
  cameras: '++id, place_id,angle,record_starts,record_ends,record',

  places: '++id,name'
});

export default database;
