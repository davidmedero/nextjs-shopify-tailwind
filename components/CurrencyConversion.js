import { useLayoutEffect, useEffect, useState, useRef } from "react"


export default function CurrencyConversion() {

    const ref = useRef()

    const [currentCurrency, setCurrentCurrency] = useState('USD')

    const [showCurrencies, setShowCurrencies] = useState(false)

    const toggleCurrencies = () => {
        setShowCurrencies(checked => !checked)
    }

    useEffect(() => {
        function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            setShowCurrencies(false)
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    useLayoutEffect(() => {
        if (localStorage.getItem('current_currency')) {
            setCurrentCurrency(JSON.parse(localStorage.getItem('current_currency')))
        } else {
            localStorage.setItem('current_currency', JSON.stringify(currentCurrency))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('current_currency', JSON.stringify(currentCurrency))
        window.dispatchEvent(new Event("storage"))
    }, [currentCurrency])
    

    return (
      <div className="flex flex-col ml-4 cursor-pointer relative select-none">
        <div ref={ref} onClick={() => toggleCurrencies()}>
            {currentCurrency}
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
            </div>
      </div>
    )
}
