import { Fragment, useState, useEffect, useCallback, useRef } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import { useRouter } from 'next/router'


export default function ProductOptions({ name, values, selectedOptions, setOptions, inventory, handle }) {

  const router = useRouter()

  const initialColor = values.map(value => {
    if (selectedOptions[name] === value && name !== 'Size') {
      return value
    }
  }).join('')

  const [color, setColor] = useState('')

  const handleQuery = ((e, name, val) => {
    const url = new URL(window.location)
    url.searchParams.set('color', `${val}`)
    name !== 'Size' && window.history.replaceState({}, '', url)
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
  

  return (
    <fieldset className="mt-3 text-white">
      <legend className="text-xl font-semibold">{name}</legend>
      <div className="inline-flex items-center flex-wrap">
        {
          values.map(value => {
            const id = `option-${name}-${value}`
            const checked = selectedOptions[name] === value

            return (
              <label key={id} htmlFor={id} onClick={(e) => handleQuery(e, name, value)}>
                <input
                  className="sr-only"
                  type="radio"
                  id={id}
                  name={`option-${name}`}
                  value={value}
                  checked={checked}
                  onChange={() => {
                    setOptions(name, value)
                  }}
                />
                <div className={`p-2 mt-3 text-lg rounded-full block cursor-pointer mr-3 ${color === value ? "text-white bg-gray-900" : "text-gray-900 bg-gray-200"}`}>
                  <span className="px-2">{value}</span>
                </div>
              </label>
            )
          })
        }
      </div>
    </fieldset>
  )
}
