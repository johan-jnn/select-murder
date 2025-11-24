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
  "data": <data depending on the card>
}
```

#### Table cards

```json
{
  "type": "table",
  "data": {
    "table": "<database's table>"
  }
}
```

#### Table's join cards

```json
{
  "type": "table-join",
  "data": {
    "table": "<database's table>"
  }
}
```

#### Where cards

```json
{
  "type": "where",
  "data": {
    "type": "in" | "between" | "like" | null
  }
}
```

#### Order by cards

```json
{
  "type": "order-by",
  "data": null
}
```

#### Group By

```json
{
  "type": "group-by",
  "data": {
    "aggregater": "AVG" | "COUNT" | "MAX" | "MIN" | "SUM"
  }
}
```

#### Limit

```json
{
  "type": "limit",
  "data": null
}
```

#### Jocker

```json
{
  "type": "jocker",
  "data": null
}
```

#### Delete From suspects

```json
{
  "type": "suspicion",
  "data": null
}
```
