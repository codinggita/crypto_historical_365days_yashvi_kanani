/**
 * Table configuration constants
 */

export const TABLE_PAGE_SIZES = [10, 20, 50, 100];

export const DEFAULT_TABLE_PAGE_SIZE = 20;

export const COIN_TABLE_COLUMNS = [
  { key: 'rank',       label: '#',           sortable: true  },
  { key: 'name',       label: 'Name',        sortable: true  },
  { key: 'symbol',     label: 'Symbol',      sortable: false },
  { key: 'price',      label: 'Price',       sortable: true  },
  { key: 'dailyReturn',label: '24h %',       sortable: true  },
  { key: 'marketCap',  label: 'Market Cap',  sortable: true  },
  { key: 'volume',     label: 'Volume',      sortable: true  },
  { key: 'actions',    label: '',            sortable: false },
];

export const PORTFOLIO_TABLE_COLUMNS = [
  { key: 'coin',          label: 'Coin',           sortable: false },
  { key: 'quantity',      label: 'Qty',            sortable: false },
  { key: 'buyPrice',      label: 'Buy Price',      sortable: false },
  { key: 'currentPrice',  label: 'Current Price',  sortable: false },
  { key: 'invested',      label: 'Invested',       sortable: false },
  { key: 'currentValue',  label: 'Current Value',  sortable: false },
  { key: 'pnl',           label: 'P&L',            sortable: false },
  { key: 'actions',       label: '',               sortable: false },
];

export const WATCHLIST_TABLE_COLUMNS = [
  { key: 'coin',        label: 'Coin',         sortable: false },
  { key: 'addedPrice',  label: 'Added Price',  sortable: false },
  { key: 'price',       label: 'Current',      sortable: false },
  { key: 'change',      label: 'Change',       sortable: false },
  { key: 'category',    label: 'Category',     sortable: false },
  { key: 'actions',     label: '',             sortable: false },
];

export const SORT_INDICATORS = {
  asc:  '↑',
  desc: '↓',
  none: '⇅',
};
