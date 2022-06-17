import React from 'react'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'


export default function ProductOptions({ name, values, selectedOptions, setOptions, inventory }) {

    const [selected, setSelected] = useState(`SELECT A ${name.toUpperCase()}...`)

  return (
    <fieldset>
        <legend className='text-xl font-semibold pt-4'></legend>
    <div className="mt-2">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="border relative w-full py-2 pl-3 pr-10 text-left bg-black hover:bg-gray-800 text-white rounded-md shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7]">
            <span className="block truncate xxs:text-center pl-7 select-none">{selected}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-[9999] absolute w-full py-1 mt-1 overflow-auto text-base bg-black rounded-md shadow-lg max-h-60 ring-1 ring-black border ring-opacity-5 focus:outline-none sm:text-sm">
              {
              values.map(value => {
                const quantity = inventory && inventory.map(item => {
                  if ((item.title === value)) {
                    return item.quantityAvailable
                  }
                }).filter(el => el !== undefined).join('')
                  const id = `option-${name}-${value}`
                  const checked = selectedOptions[name] === value
                return (
                <label key={id} htmlFor={id} onClick={() => {setOptions(name, value)}} className={quantity == 0 ? 'cursor-not-allowed' : 'cursor-pointer'}>
                <Listbox.Option
                  id={id}
                  name={`option-${name}`}
                  checked={checked}
                  value={value}
                  className={({ active }) =>
                    `${quantity == 0 ? 'text-white pointer-events-none border-b relative border-gray-100 select-none py-2 pl-10 pr-4' : 'text-white border-b border-gray-100 select-none relative py-2 pl-10 pr-4 cursor-pointer'} ${
                      active ? 'text-[#ff00a7] bg-gray-800' : 'text-white'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span 
                        className={`block truncate ${
                          selected ? 'font-medium text-[#ff00a7]' : 'font-normal'
                        }`}
                      >
                        <div className='flex flex-row justify-between w-full'>
                          <span>{value}</span>
                          <span>{quantity == 0 ? 'SOLD OUT' : quantity + ' ' + 'left in Stock'}</span>
                          </div>
                      </span>
                      {selected ? (
                        <span
                          className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ff00a7]">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
                </label>
                )
              })
              }
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
    </fieldset>
  )
}
