import Feature from '../../Component/Home/Feature/Feature'
import Hero from '../../Component/Home/Hero/Hero'
import Ready from '../../Component/Home/Ready/Ready'
import Testimonials from '../../Component/Home/Testimonials/Testimonials'
import Whu_us from '../../Component/Home/Whu_us/Whu_us'
import './Home.css'

const Home = () => {
  return (
    <>
      <Hero />
      <Feature />
      <Whu_us />
      <Testimonials />
      <Ready />
    </>
  )
}

export default Home