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
    // Remove the "s" from the table's name and then replace the separator by 's;
    return key.replace(`s${this.SEPARATOR}`, this.SEPARATOR).replace(this.SEPARATOR, "'s ");
  }

  /**
   * Transform the row's keys to include the table information
   * @param row The row to transform
   * @param table The table the row is attached to
   */
  static transform_row(row: { [key: string]: any }, table: string): { [key: string]: any } {
    const transformed = {} as { [key: string]: any };

    for (const key in row) {
      //@ts-ignore
      transformed[this.get_key(table, key)] = row[key];
    }

    return transformed;
  }
}
