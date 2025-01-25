'use client'

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'XRP', 'LTC', 'ADA'];
const FIAT_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'];

interface ExchangeRate {
  [key: string]: number;
}

const CryptoExchange: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('BTC');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const fetchExchangeRate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency.toLowerCase()}&vs_currencies=${toCurrency.toLowerCase()}`);
      const data = await response.json();
      setExchangeRate(data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()]);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    if (exchangeRate && amount) {
      const result = parseFloat(amount) * exchangeRate;
      alert(`${amount} ${fromCurrency} is approximately ${result.toFixed(2)} ${toCurrency}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <form onSubmit={handleExchange} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700">From</label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger id="fromCurrency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CRYPTO_CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700">To</label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger id="toCurrency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {FIAT_CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {exchangeRate && (
          <p className="text-sm text-gray-600">
            Current rate: 1 {fromCurrency} = {exchangeRate.toFixed(2)} {toCurrency}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Loading...' : 'Exchange'}
        </Button>
      </form>
    </div>
  );
};

export default CryptoExchange;

