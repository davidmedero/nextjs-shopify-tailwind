import React from 'react'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'


export default function ProductOptions({ name, values, selectedOptions, setOptions }) {

    const [selected, setSelected] = useState(`Select a ${name}...`)

  return (
    <fieldset>
        <legend className='text-xl font-semibold pt-4'></legend>
    <div className="mt-2">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="border relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-pink-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500">
            <span className="block truncate xxs:text-center">{selected}</span>
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
            <Listbox.Options className="z-[9999] absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {
              values.map(value => {
                  const id = `option-${name}-${value}`
                  const checked = selectedOptions[name] === value
                return (
                <label key={id} htmlFor={id} onClick={() => {setOptions(name, value)}}>
                <Listbox.Option
                  id={id}
                  name={`option-${name}`}
                  checked={checked}
                  value={value}
                  className={({ active }) =>
                    `border-b border-gray-100  cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                      active ? 'text-pink-900 bg-pink-100' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span 
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {value}
                      </span>
                      {selected ? (
                        <span
                          className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-600">
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
