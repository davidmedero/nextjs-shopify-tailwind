import { useState, useEffect } from 'react'
import useSWR from "swr"
import axios from "axios"
import Image from 'next/image'


const fetcher = (url, id) => (
  axios.get(url, {
      params: {
          id: id
      }
  }).then((res) => res.data)
)


export default function ProductOptions({ name, values, selectedOptions, setOptions, product }) {

  const { data: productInventory } = useSWR(
    ['/api/available', product.handle],
    (url, id) => fetcher(url, id), 
    { errorRetryCount: 3}
  )

  const initialColor = values.map(value => {
    if (selectedOptions[name] === value && name !== 'Size') {
      return value
    }
  }).join('')

  const [color, setColor] = useState('')

  const handleQuery = ((val) => {
    const url = new URL(window.location)
    url.searchParams.set('color', `${val}`)
    window.history.replaceState({}, '', url)
    setColor(url.searchParams.get('color'))
  })

  useEffect(() => {
    const url = new URL(window.location)
    if (url.searchParams.get('color')) {
      setOptions(name, url.searchParams.get('color'))
      setColor(url.searchParams.get('color'))
    } else {
      url.searchParams.set('color', initialColor)
      window.history.replaceState({}, '', url)
      setColor(initialColor)
    }
  }, [])

  useEffect(() => {
    window.dispatchEvent(new Event("color"))
  }, [color])

  const [inventory, setInventory] = useState([])

  useEffect(() => {
    if (productInventory) {
        setInventory(productInventory.variants.edges.map(item => item.node))
    }
  }, [productInventory])
  

  return (
    <fieldset className="mt-3 text-white">
      <div className={`${name === "Color" ? "inline-flex items-center flex-wrap" : "grid lg:grid-cols-4 md:grid-cols-3 gap-x-2"}`}>
        {
          values.map(value => {
            const id = `option-${name}-${value}`
            const checked = selectedOptions[name] === value

            const available = inventory && inventory.map(el => {
              if ((el.title === (selectedOptions.Color + ' / ' + value)) && (name === 'Size')) {
                return el.availableForSale
              } else if ((el.title === value) && (name === 'Size')) {
                return el.availableForSale
              }
            }).filter(el => el !== undefined).join('')

            const colorPicLookup = inventory && inventory.map(el => (
              (el.title === (value + ' / ' + '0'))
            ))

            const colorPicIndex = colorPicLookup.findIndex(el => el === true)
            
            return (
              <label key={id} htmlFor={id} onClick={() => available !== 'false' && name !== 'Size' && handleQuery(value)} className="cursor-pointer">
                <input
                  className="sr-only"
                  type="radio"
                  id={id}
                  name={`option-${name}`}
                  value={value}
                  checked={checked}
                  onChange={() => {
                    available !== 'false' && setOptions(name, value)
                  }}
                />
                {
                  name === 'Color' && colorPicIndex !== -1 ? (
                    <div className={`w-8 h-8 rounded-full mr-5 box-border hover:border-2 border-[#ff00a7] ${color === value && "hover:!border-4 border-4 border-[#ff00a7]"}`}>
                      <Image src={product.variants.edges[colorPicIndex]?.node.image.originalSrc} className="rounded-full" width='500' height='500' layout="responsive" objectFit="cover" />
                    </div>
                  ) : (
                    <div className={`${available == 'false' && 'cursor-not-allowed'}`}>
                      <div className={`${"flex items-center justify-center border-white border box-border lg:w-[88px] md:w-[120px] h-10 text-center md:mt-[7px] text-base rounded-sm cursor-pointer text-white bg-black font-semibold hover:border-[#ff00a7]"} ${checked && available !== 'false'  && "border-2 border-[#ff00a7]"} ${available == 'false'  && "soldOut pointer-events-none text-gray-400"} `}>
                        <span>{value}</span>
                      </div>
                  </div>
                  )
                }
              </label>
            )
          })
        }
      </div>
    </fieldset>
  )
}
