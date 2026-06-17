import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPortfolioThunk,
  addHoldingThunk,
  updateHoldingThunk,
  deleteHoldingThunk,
  simulatePortfolioThunk,
} from '../redux/thunks/portfolioThunks';
import { resetPortfolioState } from '../redux/slices/portfolioSlice';

/**
 * usePortfolio Hook
 */
export function usePortfolio() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.portfolio);

  const fetchPortfolio = useCallback(
    () => dispatch(fetchPortfolioThunk()),
    [dispatch]
  );

  const addHolding = useCallback(
    (data) => dispatch(addHoldingThunk(data)),
    [dispatch]
  );

  const updateHolding = useCallback(
    (id, data) => dispatch(updateHoldingThunk({ id, data })),
    [dispatch]
  );

  const deleteHolding = useCallback(
    (id) => dispatch(deleteHoldingThunk(id)),
    [dispatch]
  );

  const simulatePortfolio = useCallback(
    (params) => dispatch(simulatePortfolioThunk(params)),
    [dispatch]
  );

  const clearPortfolioState = useCallback(
    () => dispatch(resetPortfolioState()),
    [dispatch]
  );

  return {
    ...state,
    fetchPortfolio,
    addHolding,
    updateHolding,
    deleteHolding,
    simulatePortfolio,
    clearPortfolioState,
  };
}

export default usePortfolio;
