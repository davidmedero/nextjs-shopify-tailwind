import { useState, useContext, useEffect } from "react"
import { formatter } from "../utils/helpers"
import ProductOptions from "./ProductOptions"
import { CartContext } from '../context/shopContext'
import useSWR from "swr"
import axios from "axios"


const fetcher = (url, id) => (
    axios.get(url, {
        params: {
            id: id
        }
    }).then((res) => res.data)
)

export default function ProductForm({ product }) {

    const { data: productInventory } = useSWR(
        ['/api/available', product.handle],
        (url, id) => fetcher(url, id), 
        { errorRetryCount: 3 }
    )

    const [available, setAvailable] = useState(true)

    const { cart, addToCart } = useContext(CartContext)

    const allVariantOptions = product.variants.edges?.map(variant => {
        const allOptions = {}

        variant.node.selectedOptions.map(item => {
            allOptions[item.name] = item.value
        })

        return {
            id: variant.node.id,
            title: product.title,
            handle: product.handle,
            image: variant.node.image?.originalSrc,
            options: allOptions,
            variantTitle: variant.node.title,
            variantPrice: variant.node.priceV2.amount,
            variantQuantity: 1,
            newVariantQuantity: 1
        }
    })

    const defaultValues = {}
    product.options.map(item => {
        defaultValues[item.name] = item.values[0]
    })

    const [selectedVariant, setSelectedVariant] = useState(allVariantOptions[0])
    const [selectedOptions, setSelectedOptions] = useState(defaultValues)
    const [counter, setCounter] = useState(1);
    

    function setOptions(name, value) {
        setSelectedOptions(prevState => {
            return { ...prevState, [name]: value }
        })

        const selection = {
            ...selectedOptions, 
            [name]: value
        }

        allVariantOptions.map(item => {
            if (JSON.stringify(item.options) === JSON.stringify(selection)) {
                setSelectedVariant(item)
                setCounter(1)
            }
        })
    }

    const increment = () => {
        counter += 1
        setCounter(counter)

        cart.map(item => {
            if (item.id === selectedVariant.id) {
                selectedVariant.newVariantQuantity += 1
                setCounter(selectedVariant.newVariantQuantity)
            } else {
                selectedVariant.variantQuantity = counter
                setCounter(selectedVariant.variantQuantity)
            }
        })
        if (cart.length === 0) {
            selectedVariant.variantQuantity = counter
            setCounter(selectedVariant.variantQuantity)
        }
    }

    const decrement = () => {
        counter > 1 ? counter -= 1 : setCounter(1)
        setCounter(counter)

        cart.map(item => {
            if (item.id === selectedVariant.id) {
                selectedVariant.newVariantQuantity -= 1
                setCounter(selectedVariant.newVariantQuantity)
            } else {
                selectedVariant.variantQuantity = counter
                setCounter(selectedVariant.variantQuantity)
            }
        })
        if (cart.length === 0) {
            selectedVariant.variantQuantity = counter
            setCounter(selectedVariant.variantQuantity)
        }
    }

    const handleChange = (e) => {
        counter = Number(e.target.value);
        setCounter(counter)

        cart.map(item => {
            if (item.id === selectedVariant.id) {
                selectedVariant.newVariantQuantity = counter
                setCounter(selectedVariant.newVariantQuantity)
            } else {
                selectedVariant.variantQuantity = counter
                setCounter(selectedVariant.variantQuantity)
            }
        })
        if (cart.length === 0) {
            selectedVariant.variantQuantity = counter
            setCounter(selectedVariant.variantQuantity)
        }
        if (e.key === 0 || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 ) {
            e.target.blur();
        }
        if (isNaN(counter) || (e.target.value == 0)) {
            e.target.value = 1
            parseInt(e.target.value)
            counter = 1
            selectedVariant.variantQuantity = counter
            selectedVariant.newVariantQuantity = counter
            setCounter(1)
        }
    }

    useEffect(() => {
        if (productInventory) {
            const checkAvailable = productInventory?.variants.edges.filter(item => item.node.id === selectedVariant.id)

            if (checkAvailable[0].node.availableForSale) {
                setAvailable(true)
            } else {
                setAvailable(false)
            }
        }
    }, [productInventory, selectedVariant])


  return (
    <div className="rounded-2xl p-4 relative -top-4 md:top-0 shadow-lg flex flex-col w-11/12 md:w-[390px]">
      <h2 className="text-2xl font-bold">{product.title}</h2>
      <span className="pb-3 text-xl">{formatter.format(product.variants.edges[0].node.priceV2.amount)}</span>
      {
          product.options.map(({ name, values }) => (
              <ProductOptions 
              key={`key-${name}`}
              name={name}
              values={values}
              selectedOptions={selectedOptions}
              setOptions={setOptions}
              selectedVariant={selectedVariant}
              productInventory={productInventory}
              available={available}
              />
          ))
      }
      <legend className='text-xl font-semibold mt-6'>Qty</legend>
       <div className="shadow-md rounded-lg inline-block my-2 xxs:w-[142.5px] xs:!w-[142px]">
        <button 
        onClick={decrement}
        className='text-black highlight-removal transition-all ease-in-out duration-100 px-3 rounded-l-lg py-1 font-semibold hover:bg-gray-200 active:bg-black active:text-white'>
          &mdash;
        </button>
        
        <input id="input" inputMode='numeric' pattern="[0-9]*" onFocus={(e) => e.target.value = ""} onBlur={(e) => e.target.value = counter} className="text-black transition-all ease-in-out duration-100 relative z-50 focus:outline-2 outline-blue-400 caret-indigo-400 text-center rounded-none w-16 py-1" type="text"  value={counter} onChange={handleChange} />
        
        <button 
        onClick={increment}
        className='text-black highlight-removal transition-all ease-in-out duration-100 px-3 rounded-r-lg py-1 font-semibold hover:bg-gray-200 active:bg-black active:text-white'>
          &#xff0b;
        </button>  
      </div>   
      {
          available ?
          <button 
          onClick={() => {
              addToCart(selectedVariant)
              setCounter(1)
          }}
          className="transition-all ease-in-out duration-400 font-bold bg-amber-300 rounded-lg text-black px-2 py-3 mt-8 hover:bg-amber-400">Add to Cart</button> 
          :
          <button 
          className="bg-gray-800 rounded-lg text-white px-2 py-3 mt-8 cursor-not-allowed">SOLD OUT!</button>
      }
      
    </div>
  )
}
