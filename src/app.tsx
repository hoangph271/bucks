import { computed, signal } from "@preact/signals";

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

const apyPercents = signal(5)
const moneyPerMonth = signal(6_000_000)
const yearsCount = signal(20)

const originalInvests = computed(() => {
  return Array.from({ length: yearsCount.value }).fill([
    ...new Array(MONTHS_IN_A_YEAR).fill(moneyPerMonth),
  ]) as Array<number[]>
})

const investmentsAfterYears = computed(() => {
  const apy = apyPercents.value / 100

  return originalInvests.value.map((investsInYear, index) => {
    const savedInYear = sum(investsInYear)
    const finalValue = savedInYear * Math.pow((1 + apy), yearsCount.value - index)
  
    return finalValue
  })
})

const totalSaved = computed(() => sum(originalInvests.value.map(sum)))
const totalEarned = computed(() => sum(investmentsAfterYears.value))

export function App () {
  return (
    <div className="App">
      <InvestSummary />
      <InvestList />
    </div>
  )
}

const InvestList = () => {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {investmentsAfterYears.value.map((value, index) => {
        return (
          <li key={index}>
            <span>{`Year #${index + 1} - `}</span>
            <span>{formatVnd(sum(originalInvests.value[index]))}</span>
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
          onChange={(e) => {
            yearsCount.value = Number.parseInt((e.target as unknown as { value: string }).value, 10)
          }}
        />
        <span> years of investing </span>
        <input
          type="number"
          value={moneyPerMonth}
          onChange={(e) => {
            moneyPerMonth.value = Number.parseInt((e.target as unknown as { value: string }).value, 10)
          }}
        />
        <span> per month</span>
        <div>
          <span>with an APY of </span>
          <input
            type="number"
            value={apyPercents}
            onChange={(e) => {
              apyPercents.value = Number.parseInt((e.target as unknown as { value: string }).value, 10)
            }}
          />
          <span>%</span>
        </div>
        <div>
          <span>you got </span>
          <span>
            {formatVnd(totalEarned.value)}
          </span>
          <span> from an original investment of </span>
          <span>
            {formatVnd(totalSaved.value)}
          </span>
        </div>
        <div>
          {`That's a ${(totalEarned.value / totalSaved.value).toFixed(2)}x`}
        </div>
      </div>
    </>
  )
}
