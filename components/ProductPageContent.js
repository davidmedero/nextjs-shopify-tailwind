import Image from 'next/image'
import ProductForm from './ProductForm'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import RecommendedList from './RecommendedList'
import { useState, useEffect } from 'react'


export default function ProductPageContent({ product }) {

  const images = []

  product.images.edges.map((image, i) => {
    images.push(
      <SwiperSlide key={`slide-${i}`}>
        <Image src={image.node.originalSrc} atl={image.node.altText} width='600' height='850' layout="responsive" objectFit="cover" />
      </SwiperSlide>
    )
  })

  SwiperCore.use([Navigation, Pagination])

  const [imageIndex, setImageIndex] = useState(0)

  const [mousePosition, setMousePosition] = useState({
    backgroundImage: `url(${[product.images.edges[imageIndex]].map(image => image.node.originalSrc)})`,
    backgroundPosition: '0% 0%'
  })

  const findImage = (e) => {
    setImageIndex(product.images.edges.findIndex(el => el.node.id === JSON.parse(e.target.dataset.info).id))
  }

  useEffect(() => {
    const src = [product.images.edges[imageIndex]].map(image => image.node.originalSrc)
    setMousePosition({ backgroundImage: `url(${src})` })
  }, [imageIndex]); 

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.pageX - left) / width * 100
    const y = (e.pageY - top) / height * 100
    setMousePosition({ ...mousePosition, backgroundPosition: `${x}% ${y}%` })
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center md:pb-6 md:flex-row md:items-start lg:space-x-8 md:max-w-[1080px] mx-auto">
      <div className="xxs:hidden lg:block w-[8.35%]">
        {
            product.images.edges.map(image => (
              <div
              className="mb-6">
                <Image 
                src={image.node.originalSrc} 
                atl={image.node.altText} 
                data-info={JSON.stringify(image.node)}
                onMouseOver={(e) => findImage(e)}
                width='200' height='300' layout="responsive" objectFit="cover" />
              </div>
            ))
          }
          </div>
          <div className="xxs:hidden lg:block w-[40%]">
            {
              [product.images.edges[imageIndex]].map(image => (
                <div>
                  {
                    <figure 
                    className="w-full block bg-no-repeat cursor-move"
                    onMouseMove={(e) => handleMouseMove(e)} 
                    style={mousePosition}>
                      <Image 
                      className="opacity-100 hover:opacity-0 transition-all ease-in-out duration-500" 
                      src={image.node.originalSrc} 
                      width='600' height='850' layout="responsive" objectFit="cover" />
                    </figure>
                  }
                  </div>
              ))
            }
          </div>
        <div className="lg:hidden w-full flex justify-center md:mr-[calc(15%-100px)] md:max-w-[432px] bg-white">
            <Swiper
            style={{ '--swiper-navigation-color': '#000', '--swiper-pagination-color': '#000' }}
            navigation={true}
            pagination={{ clickable: true }}
            className="w-full"
            loop='true'
          >
            {images}
          </Swiper>
        </div>
        <ProductForm product={product} />
      </div>
      <RecommendedList current={product.id} products={product.collections.edges[0].node.products.edges} />
    </div>
  )
}
