import HomeLayout from '../components/layout/HomeLayout';
import Hero from '../components/home/Hero';
import FeaturedCaterers from '../components/home/FeaturedCaterers';
import EventCategories from '../components/home/EventCategories';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import BlogTips from '../components/home/BlogTips';
import BecomeCatererCTA from '../components/home/BecomeCatererCTA';

export default function Home() {
  return (
    <HomeLayout>
      <Hero />
      <FeaturedCaterers />
      <EventCategories />
      <HowItWorks />
      <Testimonials />
      <BlogTips />
      <BecomeCatererCTA />
    </HomeLayout>
  );
}