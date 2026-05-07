# Mighty Picnic — Financial Dashboard

Vite + React + TypeScript dashboard, sourced from NetSuite (subsidiary id `2`).

## Run locally

```
npm install
npm run dev      # http://localhost:5173
npm run build    # static bundle in dist/
```

## Project layout

```
index.html
src/
  main.tsx          entry
  Dashboard.tsx     all UI + tabs (Overview, Sales vs LY, Profitable Items,
                    Quarterly Review, Inventory, Open Sales Orders, AR Days)
  data/
    revenue.json           monthly revenue + expenses
    ar.json                monthly AR days, balance, invoice count
    arAging.json           AR aging by customer
    customers.json         customer revenue by year (r24/r25/r26 + r25jf)
    newCustomers.json      new customer count by month
    newCustomerDetail.json new customer name + onboarding date
    newSkus.json           new SKU count by month
    newSkuDetail.json      new SKU name + launch date
    salesOrders.json       open SO pipeline
    profit.json            top profitable items per fiscal year
    inventory.json         on-hand value, FG/RM split, top items, by quarter
    quarterlyMargin.json   GM% and revenue by SKU across recent quarters
    meta.json              asOf date, fiscalYears, defaultYear
```

## Monthly refresh from NetSuite

The dashboard reads static JSON committed in `src/data/`. Each month, ask
Claude (with the NetSuite MCP connector enabled) to refresh those files from
NetSuite. The connector runs against subsidiary id `2` (Mighty Picnic).

Suggested prompt:

> Refresh the dashboard data for the new close month. Pull from NetSuite
> subsidiary 2 and update every JSON file under `src/data/`. Set
> `meta.json.asOf` to the new close date. Run `npm run build` to confirm it
> still compiles, then commit on `claude/financial-dashboard-LkDpD`.

### Source mapping

| File | NetSuite source |
| --- | --- |
| `revenue.json` | Income / Expense GL totals by posting period (Income Statement report or SuiteQL on `transaction` + `transactionline`) |
| `ar.json` | Invoice register per month: count, balance, weighted average days outstanding |
| `arAging.json` | A/R Aging Detail report (or `transaction` where `type='CustInvc'` and `status` open) |
| `customers.json` | Sales by Customer Summary, pivot by fiscal year |
| `newCustomers.json` / `newCustomerDetail.json` | `customer` records with `datecreated` in period |
| `newSkus.json` / `newSkuDetail.json` | `item` records with `created` in period |
| `salesOrders.json` | `transaction` where `type='SalesOrd'` and `status` in (`Pending Fulfillment`, `Partially Fulfilled`, `Pending Billing`) |
| `profit.json` | Item Profitability by fiscal year (top 14 by gross profit) |
| `inventory.json` | Inventory Valuation Detail + Inventory Activity Detail |
| `quarterlyMargin.json` | Item Profitability pivoted by quarter |

The exact SuiteQL queries can live in the prompt; we kept them out of the repo
so they can evolve without code changes.
