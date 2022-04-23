import { useLayoutEffect, useEffect, useState, useRef } from "react"
import ProductCard from "./ProductCard"


export default function CurrencyConversion({ productsByCollection }) {

    const ref = useRef()

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

    useEffect(() => {
        function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            setTimeout(() => {
                setShowCurrencies(false)
            }, 150)
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    useLayoutEffect(() => {
        if (window.localStorage.getItem('current_currency')) {
            setCurrentCurrency(JSON.parse(window.localStorage.getItem('current_currency')))
        } else {
            window.localStorage.setItem('current_currency', JSON.stringify(currentCurrency))
        }
    }, [])

    useEffect(() => {
        window.localStorage.setItem('current_currency', JSON.stringify(currentCurrency))
    }, [currentCurrency])

    const GBPcurrency = [currencyRates].map(currency => currency.GBP).join('')

    const EURcurrency = [currencyRates].map(currency => currency.EUR).join('')
    

    return (
      <div className="flex flex-col ml-4 cursor-pointer relative select-none">
        <div ref={ref} onClick={() => toggleCurrencies()}>
            {currentCurrency}
        </div>
            {
            showCurrencies && (
                <div className="p-3 border absolute top-8 bg-white flex flex-col right-[1px]">
                    <div 
                    onClick={() => {
                        setCurrentCurrency('USD');
                    }} 
                    className="hover:bg-pink-100 whitespace-nowrap mb-2">United States</div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('GBP');
                    }} 
                    className="hover:bg-pink-100 whitespace-nowrap mb-2">United Kingdom</div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('EUR');
                    }} 
                    className="hover:bg-pink-100 whitespace-nowrap">European Union</div>
                </div>
            )   
            }
            <div className="hidden">
            {
                productsByCollection?.map(product => (
                    <ProductCard key={product.node.id} product={product} currentCurrency={currentCurrency} />
                ))
              }
            </div>
      </div>
    )
}