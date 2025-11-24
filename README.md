# SELECT MURDER

A murder board game where you hae to resolve a murder mystery using SQL queries.

## Project informations

See the [public Google Docs](https://docs.google.com/document/d/1Vggfv2an8vyUxDZRbiIrWSMSksKew19H57iCzd16AD4/edit?usp=sharing).

## Developper informations

### QR Codes data

All QR-codes data is a JSON-based object, depending on the card's type, the JSON data changes. But all cards has a similar format :

```json
{
  "type": "<card-type>",
  "group": "table" | "modifier",
  "data": <data depending on the card>
}
```

#### Table cards

```json
{
  "type": "table",
  "group": "table",
  "data": {
    "table": "<database's table>"
  }
}
```

#### Table's join cards

```json
{
  "type": "table-join",
  "group": "table",
  "data": {
    "table": "<database's table>"
  }
}
```

#### Where cards

```json
{
  "type": "where",
  "group": "modifier",
  "data": {
    "type": "in" | "between" | "like" | null
  }
}
```

#### Order by cards

```json
{
  "type": "order-by",
  "group": "modifier",
  "data": null
}
```

#### Group By

```json
{
  "type": "group-by",
  "group": "modifier",
  "data": {
    "aggregater": "AVG" | "COUNT" | "MAX" | "MIN" | "SUM"
  }
}
```

#### Limit

```json
{
  "type": "limit",
  "group": "modifier",
  "data": null
}
```

#### Jocker

```json
{
  "type": "jocker",
  "group": "table" | "modifier",
}
```

#### Delete From suspects

```json
{
  "type": "suspicion",
  "group": "table" | "modifier",
  "data": null
}
```
