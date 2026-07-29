import { useEffect, useState } from "react";

export default function useCarousel(
  totalItems: number,
  visibleItems = 3
) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = Math.max(
    0,
    totalItems - visibleItems + 1
  );

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }

  useEffect(() => {
    setCurrentSlide(0);
  }, [totalItems]);

  return {
    currentSlide,
    nextSlide,
    prevSlide,
    totalSlides,
  };
}