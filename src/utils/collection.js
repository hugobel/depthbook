const collection = {
  appendCumulative: (entries) => {
    let sum = 0;

    const output = entries.map((entry) => {
      sum += Number(entry.amount);
      return { ...entry, ...{ sum } };
    });

    return output;
  },
};

export default collection;
