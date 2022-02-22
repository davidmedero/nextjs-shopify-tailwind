import React from 'react'

export default function ProductOptions({ name, values, selectedOptions, setOptions }) {
  return (
    <fieldset>
        <legend className='text-xl font-semibold pt-4'>{name}</legend>
        <div className="highlight-removal inline-flex items-center flex-wrap">
        {
            values.map(value => {
                const id = `option-${name}-${value}`
                const checked = selectedOptions[name] === value
                return (
                    <label key={id} htmlFor={id}>
                        <input
                        className='sr-only'
                        type="radio"
                        id={id}
                        name={`option-${name}`}
                        value={value}
                        checked={checked}
                        onChange={() => {
                            setOptions(name, value)
                        }}
                        />
                        <div className={`hover:scale-110 p-2 my-2 text-lg rounded-full block cursor-pointer mr-3 ${checked ? "text-white bg-gray-900" : "text-gray-900 bg-gray-200 hover:bg-gray-300"}`}>
                            <span className='px-2'>{value}</span>
                        </div>
                    </label>
                )
            })
        }</div>
    </fieldset>
  )
}
