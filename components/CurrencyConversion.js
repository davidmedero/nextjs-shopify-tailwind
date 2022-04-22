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
      <div className="flex flex-col ml-4 cursor-pointer relative select-none">
        <div onClick={() => toggleCurrencies()}>
            {currentCurrency}
        </div>
            <div className="absolute top-8 bg-white border flex flex-col">
                {
                showCurrencies && (
                    <div className="p-3">
                        <div className="hover:bg-pink-100 whitespace-nowrap mb-2">United Kingdom</div>
                        <div className="hover:bg-pink-100 whitespace-nowrap">European Union</div>
                    </div>
                )   
                }
            </div>
      </div>
    )
}