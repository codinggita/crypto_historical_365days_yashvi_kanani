export const getPaginationOptions = (query) => {
  const page  = Math.max(1, parseInt(query.page,  10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

export const getPaginationMeta = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  return {
    page,
    limit,
    total:       totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
