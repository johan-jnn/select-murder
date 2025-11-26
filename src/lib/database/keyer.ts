export class DBKeyer {
  private static SEPARATOR = '.';

  /**
   * @param table The table the datas come from
   * @param column The column
   */
  static get_key(table: string, column: string) {
    return table + this.SEPARATOR + column;
  }
  /**
   * Retreive the table and column names from a parsed key
   * @param key The parsed key
   */
  static from_key(key: string) {
    const [table, column] = key.split(this.SEPARATOR, 2);
    return { table, column };
  }

  /**
   * Get the column's label from the key
   * @param key The parsed key
   */
  static get_label(key: string): string {
    return key.replace(this.SEPARATOR, "'s ");
  }

  /**
   * Transform the row's keys to include the table information
   * @param row The row to transform
   * @param table The table the row is attached to
   */
  static transform_row<ROW extends { [key: string]: any }>(row: ROW, table: string): ROW {
    const transformed = {} as ROW;

    for (const key in row) {
      //@ts-ignore
      transformed[this.get_key(table, key)] = row[key];
    }

    return transformed;
  }
}
