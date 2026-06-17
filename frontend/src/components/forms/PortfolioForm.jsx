import React from 'react';
import { useForm } from 'react-hook-form';

export function PortfolioForm({ coins = [], defaultValues, onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      coinId: defaultValues?.coinId || (coins.length > 0 ? coins[0].coinId : ''),
      quantity: defaultValues?.quantity || '',
      buyPrice: defaultValues?.buyPrice || '',
    },
  });

  const handleCoinChange = (e) => {
    const selectedCoinId = e.target.value;
    setValue('coinId', selectedCoinId);
    const coin = coins.find((c) => c.coinId === selectedCoinId);
    if (coin) {
      setValue('buyPrice', coin.price || coin.close || '');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="simulator-form" noValidate>
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="pf-coin-select">Select Asset</label>
        <select
          id="pf-coin-select"
          className="form-select"
          {...register('coinId', { required: 'Please select an asset' })}
          onChange={handleCoinChange}
        >
          <option value="">-- Choose Asset --</option>
          {coins.map((coin) => (
            <option key={coin._id || coin.id} value={coin.coinId}>
              {coin.name} ({coin.symbol}) - ${parseFloat(coin.price || 0).toLocaleString()}
            </option>
          ))}
        </select>
        {errors.coinId && (
          <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
            {errors.coinId.message}
          </span>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="pf-quantity">Quantity</label>
        <input
          id="pf-quantity"
          type="number"
          step="any"
          className={`form-input ${errors.quantity ? 'error' : ''}`}
          placeholder="e.g. 1.5"
          {...register('quantity', {
            required: 'Quantity is required',
            validate: (value) => parseFloat(value) > 0 || 'Quantity must be positive',
          })}
        />
        {errors.quantity && (
          <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
            {errors.quantity.message}
          </span>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="pf-buy-price">Buy Price (USD)</label>
        <input
          id="pf-buy-price"
          type="number"
          step="any"
          className={`form-input ${errors.buyPrice ? 'error' : ''}`}
          placeholder="e.g. 35000"
          {...register('buyPrice', {
            required: 'Buy price is required',
            validate: (value) => parseFloat(value) >= 0 || 'Buy price cannot be negative',
          })}
        />
        {errors.buyPrice && (
          <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
            {errors.buyPrice.message}
          </span>
        )}
      </div>

      <div className="modal-footer" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <span className="spinner" style={{ width: '1rem', height: '1rem' }} /> : 'Add Asset'}
        </button>
      </div>
    </form>
  );
}

export default PortfolioForm;
