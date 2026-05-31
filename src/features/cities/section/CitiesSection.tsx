"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CityCard from "../components/CityCard"; 
import { cities } from "../data/cities.mock"; 

export default function CitiesSection() {
  return (
    <section id="Cities" className="flex flex-col gap-[30px] mt-[100px] w-full">
      
      {/* Header */}
      <div className="w-full max-w-[1130px] mx-auto flex items-center justify-between">
        <h2 className="font-bold text-[32px] leading-[48px] text-nowrap">
          You Can Choose <br />Our Favorite Cities
        </h2>
      </div>

      {/* Swiper Component */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={30}
        slidesPerView="auto"
        grabCursor={true}
        touchEventsTarget="wrapper"
        touchRatio={1}
        touchAngle={45}
        simulateTouch={true}
        allowTouchMove={true}
        className="!pb-12 w-full"
        style={{
          paddingLeft: "max(1rem, calc((100vw - 1130px) / 2))",
          paddingRight: "max(1rem, calc((100vw - 1130px) / 2))"
        }}
      >
        {cities.map((city) => (
          <SwiperSlide key={city.id} style={{ width: "auto" }}>
            <CityCard city={city} />
          </SwiperSlide> 
        ))}
      </Swiper>

    </section>
  );
}