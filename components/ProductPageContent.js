import Image from 'next/image'
import ProductForm from './ProductForm'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import RecommendedList from './RecommendedList'
import { useState } from 'react'
import Zoom from 'react-img-zoom'
import LazyLoad from 'react-lazyload'


export default function ProductPageContent({ product }) {

  const images = []

  product.images.edges.map((image, i) => {
    images.push(
      <SwiperSlide key={`slide-${i}`}>
        <Image src={image.node.originalSrc} atl={image.node.altText} width='500' height='500' layout="responsive" objectFit="cover" />
      </SwiperSlide>
    )
  })

  SwiperCore.use([Navigation, Pagination])

  const [imageIndex, setImageIndex] = useState(0)

  const findImage = (e) => {
    setImageIndex(product.images.edges.findIndex(el => el.node.id === JSON.parse(e.target.dataset.info).id))
  }

  const imgDelay = () => {
    setTimeout(() => {
      setShow(false)
    }, 300)
  }

  const [show, setShow] = useState(false)


  return (
    <div>
      <div className="flex flex-col justify-center items-center md:px-6 space-y-8 md:flex-row md:items-start md:space-y-0 md:space-x-4 lg:space-x-8 md:max-w-6xl mx-auto">
      <div className="xxs:hidden lg:block w-[10%]">
        {
            product.images.edges.map(image => (
              <div
              className="mb-6">
                <Image 
                src={image.node.originalSrc} 
                atl={image.node.altText} 
                data-info={JSON.stringify(image.node)}
                onMouseEnter={(e) => {
                  findImage(e);
                }}
                className="rounded-2xl"
                width='100' height='100' layout="responsive" objectFit="cover" />
              </div>
            ))
          }
          </div>
          <div className="xxs:hidden lg:block w-[40%]">
            {
              [product.images.edges[imageIndex]].map(image => (
                <div>
                  {
                    !show && (
                      <Image 
                  src={image.node.originalSrc} 
                  atl={image.node.altText}
                  onMouseOver={() => {
                    setShow(true);
                  }} 
                  className="rounded-2xl" 
                  width='500' height='500' layout="responsive" objectFit="cover" />
                    ) 
                  }
                  {
                    show && (
                      <div onMouseLeave={() => {
                          imgDelay();
                          }} 
                      className="rounded-2xl overflow-hidden" >
                        <LazyLoad height={450} overflow={true} offset={100}>
                          <Zoom img={image.node.originalSrc}
                          zoomScale={3}
                          width={450}
                          height={450}
                          transitionTime={0.3}/>
                        </LazyLoad>
                      </div>
                      )
                  }
                  </div>
              ))
            }
          </div>
        <div className="lg:hidden w-full md:max-w-md border bg-white md:rounded-2xl shadow-lg">
            <Swiper
            style={{ '--swiper-navigation-color': '#000', '--swiper-pagination-color': '#000' }}
            navigation
            pagination={{ clickable: true }}
            className="w-full md:rounded-2xl"
            loop="true"
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
