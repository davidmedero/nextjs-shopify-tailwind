import { Fragment, useState, useEffect, useCallback, useRef } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import { useRouter } from 'next/router'


export default function ProductOptions({ name, values, selectedOptions, setOptions, inventory, handle }) {

  const router = useRouter()

  // const [selected, setSelected] = useState(`SELECT A ${name.toUpperCase()}...`)

  const [color, setColor] = useState('')

  const handleQuery = (e, nam, val) => {
    e.preventDefault()
    if (nam !== 'Size') {
      setColor(val)
    }
  }

  useEffect(() => {
    values.map(value => {
      if (color === value)  {
        router.push({pathname: `/${handle}`, query: {color: color}}, undefined, { shallow: true })
      }
    })
  }, [color])

  // useEffect(() => {
  //   if(!router.query) {
  //     router.reload()
  //   }
  //   console.log(router.query)
  // }, [router.query])


  return (
    // <fieldset>
    //     <legend className='text-xl font-semibold pt-4'></legend>
    // <div className="mt-2">
    //   <Listbox value={selected} onChange={setSelected}>
    //     <div className="relative mt-1">
    //       <Listbox.Button className="border relative w-full py-2 pl-3 pr-10 text-left bg-black text-white rounded-md shadow-md cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-1 hover:ring-offset-[#ff00a7] transition-all ease-in-out duration-200">
    //         <span className="block truncate xxs:text-center pl-7 select-none">{selected}</span>
    //         <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
    //           <SelectorIcon
    //             className="w-5 h-5 text-gray-400"
    //             aria-hidden="true"
    //           />
    //         </span>
    //       </Listbox.Button>
    //         <Listbox.Options className="dropdownOptions z-[9999] absolute w-full py-1 mt-1 text-base bg-black rounded-md shadow-lg max-h-60 ring-1 ring-black border ring-opacity-5 focus:outline-none sm:text-sm">
    //         <SlideDown className={'my-dropdown-slidedown'}>
    //           {
    //           values.map(value => {
    //             const quantity = inventory && inventory.map(item => {
    //               if ((item.title === value)) {
    //                 return item.quantityAvailable
    //               }
    //             }).filter(el => el !== undefined).join('')
    //             const disabledOption = inventory && inventory.map(item => {
    //               if ((item.title === value && item.quantityAvailable === 0)) {
    //                 return item.title
    //               }
    //             }).filter(el => el !== undefined).join('')
    //               const id = `option-${name}-${value}`
    //               const checked = selectedOptions[name] === value
    //             return (
    //             <label key={id} htmlFor={id} onClick={() => setOptions(name, value)} className={quantity == 0 ? 'cursor-not-allowed' : 'cursor-pointer'}>
    //             <Listbox.Option
    //               id={id}
    //               name={`option-${name}`}
    //               checked={checked}
    //               value={value}
    //               disabled={disabledOption}
    //               className={({ active }) =>
    //                 `${quantity == 0 ? 'text-white pointer-events-none border-b relative border-gray-100 select-none py-2 pl-10 pr-4' : 'text-white border-b border-gray-100 select-none relative py-2 pl-10 pr-4 cursor-pointer'} ${
    //                   active ? 'text-[#ff00a7] bg-gray-800' : 'text-white'
    //                 }`
    //               }
    //             >
    //               {({ selected }) => (
    //                 <>
    //                   <span 
    //                     className={`block truncate ${
    //                       selected ? 'font-medium text-[#ff00a7]' : 'font-normal'
    //                     }`}
    //                   >
    //                     <div className='flex flex-row justify-between w-full'>
    //                       <span>{value}</span>
    //                       <span>{quantity == 0 ? 'SOLD OUT' : quantity + ' ' + 'left in Stock'}</span>
    //                       </div>
    //                   </span>
    //                   {selected ? (
    //                     <span
    //                       className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ff00a7]">
    //                       <CheckIcon className="w-5 h-5" aria-hidden="true" />
    //                     </span>
    //                   ) : null}
    //                 </>
    //               )}
    //             </Listbox.Option>
    //             </label>
    //             )
    //           })
    //           }
    //           </SlideDown>
    //         </Listbox.Options>
    //     </div>
    //   </Listbox>
    // </div>
    // </fieldset>
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
                <div className={`p-2 mt-3 text-lg rounded-full block cursor-pointer mr-3 ${checked ? "text-white bg-gray-900" : "text-gray-900 bg-gray-200"}`}>
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
