const helperProvider = {
  sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

  addSeparator: (x: string): string => {
    const modifiedNum = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return modifiedNum;
  },

  addCommasToNumber: (x: number | string = 0): string => {
    const num = x.toString();
    const numIndex = num.indexOf('.');

    if (numIndex !== -1) {
      const numBeforeDecimals = helperProvider.addSeparator(num.substring(0, numIndex));
      const numAfterDecimals = num.substring(numIndex);
      const modifiedNum = `${numBeforeDecimals}${numAfterDecimals}`;
      return modifiedNum;
    }

    return helperProvider.addSeparator(num);
  },
};

export default helperProvider;
