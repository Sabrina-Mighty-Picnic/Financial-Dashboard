# Monthly P&L refresh from NetSuite

The Overview tab sources Revenue, COGS, Gross Margin, Operating Expenses,
and Operating Margin from `src/data/revenue.json` (monthly rows). Each
row has three fields:

| field | meaning | NetSuite accounttype |
| --- | --- | --- |
| `r` | Revenue | `Income` (credit minus debit) |
| `c` | COGS | `COGS` (debit minus credit) |
| `e` | Operating Expenses (excl. COGS) | `Expense` (debit minus credit) |

Subsidiary scope: Mighty Picnic (id = 2) — there's only one subsidiary
posting, so no filter is needed.

## SuiteQL to run

Adjust `dateFrom`/`dateTo` to the months you need to refresh:

```sql
SELECT
  TO_CHAR(t.trandate, 'YYYY-MM') AS m,
  SUM(CASE WHEN tal.accounttype='Income'
           THEN NVL(tal.credit,0) - NVL(tal.debit,0)
           ELSE 0 END) AS r,
  SUM(CASE WHEN tal.accounttype='COGS'
           THEN NVL(tal.debit,0)  - NVL(tal.credit,0)
           ELSE 0 END) AS c,
  SUM(CASE WHEN tal.accounttype='Expense'
           THEN NVL(tal.debit,0)  - NVL(tal.credit,0)
           ELSE 0 END) AS e
FROM transactionaccountingline tal
JOIN transaction t ON t.id = tal.transaction
WHERE t.posting = 'T'
  AND t.trandate BETWEEN TO_DATE('<from>','YYYY-MM-DD')
                     AND TO_DATE('<to>','YYYY-MM-DD')
GROUP BY TO_CHAR(t.trandate, 'YYYY-MM')
ORDER BY m;
```

Notes:

- `NVL(...,0)` is required — the SUM returns null otherwise.
- `tal.accounttype = 'Income'` works **inside CASE** but the same string
  comparison in WHERE returns null. Use IN if you need to filter in
  WHERE: `tal.accounttype IN ('Income')`.
- `t.posting='T'` excludes non-posting transactions (estimates, etc.).

## After refresh

1. Round to whole dollars and overwrite the affected rows in
   `src/data/revenue.json`.
2. Recompute annual totals for `src/data/profit.json` — sum `r` and `c`
   for the year, compute `pft = rev - cst` and `gp = pft / rev * 100`.
3. Run `npm run build` to confirm.
4. Commit + push — GitHub Actions redeploys to Pages automatically.

## Other income / expense (below the line)

For Net Income vs Operating Income, also pull `OthIncome` and
`OthExpense`. These aren't shown on the Overview today; if you want
them surfaced add an `o` column to `revenue.json` and another KPI.
