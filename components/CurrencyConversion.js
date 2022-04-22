import { useEffect, useState } from "react"

export default function CurrencyConversion() {

    const [currencyRates, setCurrencyRates] = useState(0)

    const [currentCurrency, setCurrentCurrency] = useState('USD')

    const [showCurrencies, setShowCurrencies] = useState(false)

    const toggleCurrencies = () => {
        setShowCurrencies(checked => !checked)
    }

    useEffect(() => {
        fetch('http://api.exchangeratesapi.io/v1/latest?access_key=35ec150f1f16d6ce49fa8427128872c1&base=USD')
        .then(res => res.json())
        .then(data => setCurrencyRates(data.rates))
    }, [])

    const GBPcurrency = [currencyRates].map(currency => currency.GBP).join('')

    const EURcurrency = [currencyRates].map(currency => currency.EUR).join('')


    return (
      <div className="flex flex-col ml-4 cursor-pointer relative">
        <div onClick={() => toggleCurrencies()}>
            {currentCurrency}
        </div>
            <div className="absolute top-5 bg-white border">
                {
                showCurrencies && (
                    <>
                        <div>GBP</div>
                        <div>EUR</div>
                    </>
                )   
                }
            </div>
      </div>
    )
}