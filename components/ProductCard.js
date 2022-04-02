import Link from 'next/link'
import Image from 'next/image'
import { formatter } from "../utils/helpers"


const ProductCard = ({ product }) => {

    const { handle, title } = product.node

    const { altText, originalSrc } = product.node.images.edges[0].node

    const price = product.node.priceRange.minVariantPrice.amount


  return (
    <Link href={`/${handle}`}>
      <a className="group">
        <div className="w-full bg-gray-200 rounded-3xl overflow-hidden">
            <div className="relative group-hover:opacity-75 w-full h-full">
                <Image
                    src={originalSrc}
                    alt={altText}
                    width='500' 
                    height='500' 
                    layout="responsive" 
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                />
            </div>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className='mt-1 text-sm text-gray-700'>{formatter.format(price)}</p>
      </a>
    </Link>
  )
}

export default ProductCard