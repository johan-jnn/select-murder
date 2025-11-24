type CardGroup = 'table' | 'modifier';
type Tables = 'suspects' | 'testimonies' | 'crime_scenes' | 'cameras' | 'clues';

type QRData<type extends string, group extends CardGroup | null, data> = {
  type: type;
  group: group;
  data: data;
};

type TableCard = QRData<
  'table',
  'table',
  {
    table: Tables;
  }
>;
type TableJoinCard = QRData<
  'table-join',
  'table',
  {
    table: Tables;
  }
>;

type WhereCard = QRData<
  'where',
  'modifier',
  {
    type: 'in' | 'between' | 'like' | null;
  }
>;
type OrderByCard = QRData<'order-by', 'modifier', null>;
type GroupBy = QRData<
  'group-by',
  'modifier',
  {
    aggregater: 'SUM' | 'SVG' | 'MAX' | 'MIN' | 'COUNT';
  }
>;
type LimitCard = QRData<'limit', 'modifier', null>;
type JockerCard = QRData<'jocker', CardGroup, null>;
type DeleteCard = QRData<'suspicion', null, null>;
