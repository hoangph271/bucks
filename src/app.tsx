import { useState } from 'preact/hooks'

import './app.css'

function sum (numbers: number[]) {
  return numbers.reduce((prev, val) => prev + val, 0)
}

const formatVnd = (amount: number) => {
  const numberFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  })
  return numberFormatter.format(amount)
}

const MONTHS_IN_A_YEAR = 12

export function App () {
  const [apyPercents, setApyPercents] = useState(5)
  const [moneyPerMonth, setMoneyPerMonth] = useState(6_000_000)
  const [yearsCount, setYearsCount] = useState(20)

  const apy = apyPercents / 100

  const originalInvests = Array.from({ length: yearsCount }).fill([
    ...new Array(MONTHS_IN_A_YEAR).fill(moneyPerMonth),
  ]) as Array<number[]>

  const TOTAL_MONEY_SAVED = sum(originalInvests.map(sum))

  const investmentsAfterYears = originalInvests.map((investsInYear, index) => {
    const savedInYear = sum(investsInYear)
    const finalValue = savedInYear * Math.pow((1 + apy), yearsCount - index)

    return finalValue
  })

  const TOTAL_MONEY_EARNED = sum(investmentsAfterYears)

  const InvestList = () => {
    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {investmentsAfterYears.map((value, index) => {
          return (
            <li key={index}>
              <span>{`Year #${index + 1} - `}</span>
              <span>{formatVnd(sum(originalInvests[index]))}</span>
              <span>{` (it grew into ${formatVnd(value)})`}</span>
              <span>{``}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  const InvestSummary = () => {

    return (
      <>
        <div>
          <span>After </span>
          <input
            type="number"
            min={0}
            value={yearsCount}
            onChange={(e) => setYearsCount(Number.parseInt((e.target as unknown as { value: string }).value, 10))}
          />
          <span> years of investing </span>
          <input
            type="number"
            value={moneyPerMonth}
            onChange={(e) => setMoneyPerMonth(Number.parseInt((e.target as unknown as { value: string }).value, 10))}
          />
          <span> per month</span>
          <div>
            <span>with an APY of </span>
            <input
              type="number"
              value={apyPercents}
              onChange={(e) => setApyPercents(Number.parseInt((e.target as unknown as { value: string }).value, 10))}
            />
            <span>%</span>
          </div>
          <div>
            <span>you got </span>
            <span>
              {formatVnd(TOTAL_MONEY_EARNED)}
            </span>
            <span> from an original investment of </span>
            <span>
              {formatVnd(TOTAL_MONEY_SAVED)}
            </span>
          </div>
          <div>
            {`That's a ${(TOTAL_MONEY_EARNED / TOTAL_MONEY_SAVED).toFixed(2)}x`}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="App">
      <InvestSummary />
      <InvestList />
    </div>
  )
}