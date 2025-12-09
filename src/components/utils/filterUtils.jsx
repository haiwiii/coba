export const applyFilters = (customers, filters) => {
  return customers.filter(customer => {
    // Category filter
    if (filters.categories?.length > 0) {
      if (!filters.categories.includes(customer.category)) {
        return false;
      }
    }

    // Probability range filter
    if (filters.probabilityRanges?.length > 0) {
      const score = parseInt(customer.probability.replace('%', ''));
      const inRange = filters.probabilityRanges.some(range => {
        if (range === '<10%') return score < 10;
        if (range === '10%-30%') return score >= 10 && score < 30;
        if (range === '30%-50%') return score >= 30 && score < 50;
        if (range === '50%-70%') return score >= 50 && score < 70;
        if (range === '70%-90%') return score >= 70 && score < 90;
        if (range === '>90%') return score >= 90;
        return false;
      });
      if (!inRange) return false;
    }

    // Age range filter
    if (filters.ageRanges?.length > 0) {
      const inRange = filters.ageRanges.some(range => {
        if (range === '<30 yo') return customer.age < 30;
        if (range === '30-50 yo') return customer.age >= 30 && customer.age < 50;
        if (range === '50-70 yo') return customer.age >= 50 && customer.age < 70;
        if (range === '>70 yo') return customer.age >= 70;
        return false;
      });
      if (!inRange) return false;
    }

    return true;
  });
};

export const sortByRank = (customers, rank) => {
  if (!rank) return customers;
  
  const sorted = [...customers].sort((a, b) => {
    const scoreA = parseInt(a.probability.replace('%', ''));
    const scoreB = parseInt(b.probability.replace('%', ''));
    return rank === 'highest' ? scoreB - scoreA : scoreA - scoreB;
  });
  
  return sorted;
};