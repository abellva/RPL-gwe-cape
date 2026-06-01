"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

export default function OfficeHeader({
  image,
  images,
}:{
  image: string;
  images?: string[];
}) {
  const imageList = images?.filter(img => img) || [];

  return (
    <section id="Gallery" className="relative w-full h-[550px] -mb-[50px] overflow-hidden">
      <div className="w-full h-full">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1.5}
          spaceBetween={20}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          <SwiperSlide className="w-full h-[550px] overflow-hidden">
            <Image
              src={image}
              width={600}
              height={550}
              className="w-full h-full object-cover"
              alt="cover-thumbnail"
            />
          </SwiperSlide>

          {imageList.map((img, index) => (
          <SwiperSlide key={index} className="w-full h-[550px] overflow-hidden">
            <Image
              src={img}
              width={600}
              height={550}
              className="w-full h-full object-cover"
              alt="cover-thumbnail"
            />
          </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}