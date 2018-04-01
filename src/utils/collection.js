const collection = {
  cumulative: (entries) => {
    let aggregated = 0;
    const sum = {};

    entries.forEach((entry) => {
      aggregated += Number(entry.amount);
      sum[entry.price] = aggregated;
    });

    return sum;
  },

  topElements: entries => (
    entries.slice(0, 50)
  ),

  parseInitData: data => ({
    asks: collection.topElements(data.asks),
    bids: collection.topElements(data.bids),
    asksAggregate: collection.cumulative(collection.topElements(data.asks)),
    bidsAggregate: collection.cumulative(collection.topElements(data.bids)),
  }),
};

export default collection;
