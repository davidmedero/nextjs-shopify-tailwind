import { Fragment, useState, useEffect, useCallback, useRef } from 'react'
import useSWR, { useSWRConfig } from "swr"
import axios from "axios"
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import { useRouter } from 'next/router'
import Image from 'next/image'


const fetcher = (url, id) => (
  axios.get(url, {
      params: {
          id: id
      }
  }).then((res) => res.data)
)


export default function ProductOptions({ name, values, selectedOptions, setOptions, product }) {

  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath);
  }

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
      <div className="inline-flex items-center flex-wrap">
        {
          values.map(value => {
            const id = `option-${name}-${value}`
            const checked = selectedOptions[name] === value

            const available = inventory && inventory.map(el => {
              if ((el.title === (selectedOptions.Color + ' / ' + value)) && (name === 'Size')) {
                return el.availableForSale
              }
            }).filter(el => el !== undefined).join('')

            const colorPicLookup = inventory && inventory.map(el => (
              (el.title === (value + ' / ' + 'XX-SMALL'))
            ))

            const colorPicIndex = colorPicLookup.findIndex(el => el === true)
            
            return (
              <label key={id} htmlFor={id} onClick={() => available !== 'false' && name !== 'Size' && handleQuery(value)}>
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
                    <div className={`w-8 h-8 rounded-full mr-5 cursor-pointer box-border hover:border-4 border-[#ff00a7] transition-all ease-in-out duration-200 ${color === value && "cursor-not-allowed border-4 border-[#ff00a7] transition-all ease-in-out duration-200"}`}>
                      <Image src={product.variants.edges[colorPicIndex]?.node.image.originalSrc} className="rounded-full" width='500' height='500' layout="responsive" objectFit="cover" />
                    </div>
                  ) : (
                    <div className={`${available == 'false' && 'cursor-not-allowed'}`}>
                      <div className={`${"p-2 mt-3 text-base rounded-md block cursor-pointer mr-3"} ${checked && available !== 'false'  ? "text-white bg-gray-900" : "text-gray-900 bg-gray-200"} ${available == 'false'  ? "bg-red-500 pointer-events-none" : "bg-gray-200"} `}>
                        <span className="px-2">{value}</span>
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
