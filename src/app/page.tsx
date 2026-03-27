'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import {
  Menu,
  X,
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  Zap,
  Package,
  DollarSign,
  Send,
  Instagram,
  Facebook,
  Twitter,
  Snowflake,
  Sun,
} from 'lucide-react'

// ============================================
// TYPES & INTERFACES
// ============================================
interface Testimonial {
  id: number
  name: string
  comment: string
  rating: number
  image: string
}

interface Product {
  id: number
  image: string
  thumbnail: string
  name: string
}

interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
}

// ============================================
// DATA - Replace with your actual images
// ============================================
const NAV_LINKS = [
  { href: '#hero', label: 'Inicio' },
  { href: '#productos', label: 'Productos' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#ubicacion', label: 'Ubicación' },
  { href: '#contacto', label: 'Contacto' },
]

const PRODUCTS: Product[] = [
  { id: 1, image: '/assets/carousel-1.webp', thumbnail: '/assets/thumb-1.webp', name: 'Zapato Elegante Classic' },
  { id: 2, image: '/assets/carousel-2.webp', thumbnail: '/assets/thumb-2.webp', name: 'Tenis Sport Premium' },
  { id: 3, image: '/assets/carousel-3.webp', thumbnail: '/assets/thumb-3.webp', name: 'Zapato Formal Ejecutivo' },
  { id: 4, image: '/assets/carousel-4.webp', thumbnail: '/assets/thumb-4.webp', name: 'Bota Urbana Moderna' },
  { id: 5, image: '/assets/carousel-5.webp', thumbnail: '/assets/thumb-5.webp', name: 'Sandalia Verano Cool' },
  { id: 6, image: '/assets/carousel-6.webp', thumbnail: '/assets/thumb-6.webp', name: 'Tenis Running Pro' },
]

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'María García',
    comment: '¡Increíble calidad! Encontré el par perfecto para mi evento y todos me preguntaron dónde los compré. El servicio fue excepcional.',
    rating: 5,
    image: '/assets/client-1.webp',
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    comment: 'Precios justos y gran variedad. La atención personalizada hizo toda la diferencia. Definitivamente volveré.',
    rating: 5,
    image: '/assets/client-2.webp',
  },
  {
    id: 3,
    name: 'Ana Martínez',
    comment: 'Me encantó la experiencia de comprar en Fancy Pies. Los zapatos son cómodos y el diseño es único.',
    rating: 5,
    image: '/assets/client-3.webp',
  },
  {
    id: 4,
    name: 'José López',
    comment: 'Primera vez que vengo y quedé sorprendido. Tienen tallas que en otros lados no encuentro. Muy recomendable.',
    rating: 4,
    image: '/assets/client-4.webp',
  },
  {
    id: 5,
    name: 'Laura Sánchez',
    comment: 'El mejor lugar para encontrar zapatos de calidad a precios accesibles. Ya es mi tercera visita este mes.',
    rating: 5,
    image: '/assets/client-5.webp',
  },
  {
    id: 6,
    name: 'Pedro Hernández',
    comment: 'Excelente ubicación y horarios convenientes. El personal muy amable y conocedor de los productos.',
    rating: 5,
    image: '/assets/client-6.webp',
  },
]

const BENEFITS: Benefit[] = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Atención al Instante',
    description: 'Te atendemos rápidamente porque sabemos que tu tiempo es valioso. Sin esperas ni complicaciones.',
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: 'Tallas Reales, Variedad Real',
    description: 'Tenemos la talla que buscas. Nuestro inventario está siempre actualizado con opciones para todos.',
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: 'Precios sin Drama',
    description: 'Precios justos y transparentes. Sin sorpresas ni costos ocultos. Calidad que puedes pagar.',
  },
]

const SCHEDULE = [
  { day: 'Lunes - Viernes', hours: '9:00 AM - 7:00 PM' },
  { day: 'Sábado', hours: '10:00 AM - 6:00 PM' },
  { day: 'Domingo', hours: '11:00 AM - 4:00 PM' },
]

// ============================================
// SNOW EFFECT COMPONENT
// ============================================
const SnowEffect: React.FC<{ active: boolean }> = ({ active }) => {
  // Generate snowflakes using useMemo to avoid setState in effect
  const snowflakes = React.useMemo(() => {
    if (!active) return []
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 15 + 8,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }))
  }, [active])

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  )
}

// ============================================
// FLOATING BUBBLES COMPONENT
// ============================================
const FloatingBubbles: React.FC = () => {
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 100 + 20,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bubble"
          style={{
            left: `${bubble.left}%`,
            bottom: '-150px',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// NAVBAR COMPONENT
// ============================================
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'navbar-aero py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group" onClick={(e) => { e.preventDefault(); scrollToSection('#hero') }}>
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 ring-2 ring-primary/30">
              <img 
                src="/assets/logo.webp" 
                alt="Fancy Pies Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <div className="hidden w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Fancy Pies
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group rounded-lg hover:bg-primary/5"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl glass hover:scale-105 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="navbar-aero mx-4 mt-2 rounded-2xl overflow-hidden">
          <div className="p-4 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="w-full px-4 py-3 text-left font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

// ============================================
// HERO SECTION
// ============================================
const HeroSection: React.FC = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        {/* Video option - uncomment if using video */}
        {/* <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video> */}
        <img
          src="/assets/hero-bg.webp"
          alt="Fancy Pies - Zapatería Premium en la Pulga 59"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Floating Bubbles */}
      <FloatingBubbles />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
            <span className="inline-block float-animation">F</span>
            <span className="inline-block float-animation" style={{ animationDelay: '0.1s' }}>a</span>
            <span className="inline-block float-animation" style={{ animationDelay: '0.2s' }}>n</span>
            <span className="inline-block float-animation" style={{ animationDelay: '0.3s' }}>c</span>
            <span className="inline-block float-animation" style={{ animationDelay: '0.4s' }}>y</span>
            <span className="inline-block mx-2 sm:mx-4"> </span>
            <span className="inline-block float-animation" style={{ animationDelay: '0.5s' }}>P</span>
            <span className="inline-block float-animation" style={{ animationDelay: '0.6s' }}>i</span>
            <span className="inline-block float-animation" style={{ animationDelay: '0.7s' }}>e</span>
            <span className="inline-block float-animation" style={{ animationDelay: '0.8s' }}>s</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Mientras dudas, alguien más ya se probó el último par de tu talla.{' '}
            <span className="text-yellow-300 font-semibold">Corre a la Pulga 59 antes que se agote.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button
              onClick={() => scrollToSection('#ubicacion')}
              className="aero-button-blue aero-button w-full sm:w-auto text-lg px-8 py-4"
            >
              <MapPin className="w-5 h-5 inline-block mr-2" />
              Ver cómo llegar
            </button>
            <button
              onClick={() => scrollToSection('#contacto')}
              className="aero-button w-full sm:w-auto text-lg px-8 py-4"
            >
              <MessageCircle className="w-5 h-5 inline-block mr-2" />
              ¿Quieres saber si hay tu talla?
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}

// ============================================
// PRODUCTS SECTION (Carousel)
// ============================================
const ProductsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [emblaApi, setEmblaApi] = useState<ReturnType<typeof useEmblaCarousel>[1] | null>(null)

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index)
    }
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <section id="productos" className="py-16 sm:py-20 lg:py-24 aero-gradient relative overflow-hidden">
      <FloatingBubbles />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Elige Antes Que Se Agoten
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Los mejores zapatos te esperan, pero no por mucho tiempo. Encuentra tu par perfecto.
          </p>
        </div>

        {/* Main Content - Flexbox with thumbnails on LEFT */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
          {/* Thumbnails - LEFT SIDE (Vertical on Desktop) */}
          <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[550px] pb-2 lg:pb-0 lg:pr-2 flex-shrink-0">
            {PRODUCTS.map((product, index) => (
              <button
                key={product.id}
                onClick={() => scrollTo(index)}
                className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                  activeIndex === index
                    ? 'border-primary ring-2 ring-primary/50 scale-105 shadow-lg'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={product.thumbnail}
                  alt={`${product.name} - Vista previa`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/200x200/81C784/FFFFFF?text=${index + 1}`
                  }}
                />
              </button>
            ))}
          </div>

          {/* Main Image - RIGHT SIDE */}
          <div className="order-1 lg:order-2 flex-1 min-w-0">
            <div className="aero-card p-3 sm:p-4 relative">
              <Carousel
                opts={{ align: 'center', loop: true }}
                plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
                setApi={setEmblaApi}
                className="w-full"
              >
                <CarouselContent>
                  {PRODUCTS.map((product, index) => (
                    <CarouselItem key={product.id}>
                      <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/800x600/4CAF50/FFFFFF?text=Producto+${index + 1}`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        {/* Product Name Overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="glass rounded-xl px-4 py-2 inline-block">
                            <p className="font-semibold text-foreground text-sm sm:text-base">{product.name}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="carousel-arrow left-4" />
                <CarouselNext className="carousel-arrow right-4" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// BENEFITS SECTION
// ============================================
const BenefitsSection: React.FC = () => {
  return (
    <section id="beneficios" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Por qué venir
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            No somos solo una zapatería, somos la solución a tus necesidades de calzado.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {BENEFITS.map((benefit, index) => (
            <div
              key={index}
              className="aero-card aero-card-hover p-6 sm:p-8 text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="icon-container-aero mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-primary">
                  {benefit.icon}
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">
                {benefit.title}
              </h3>
              
              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
const TestimonialsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [checkScrollButtons])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section id="testimonios" className="py-16 sm:py-20 lg:py-24 aero-gradient-green relative overflow-hidden">
      <FloatingBubbles />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Opiniones que no pedimos...
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            ...pero igual nos dejaron
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className={`carousel-arrow absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex ${
              !canScrollLeft ? 'opacity-30 pointer-events-none' : ''
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className={`carousel-arrow absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex ${
              !canScrollRight ? 'opacity-30 pointer-events-none' : ''
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Testimonials Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 px-2 sm:px-12 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="testimonial-card flex-shrink-0 w-[280px] sm:w-[320px] p-6"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/30">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/100x100/4CAF50/FFFFFF?text=${testimonial.name.charAt(0)}`
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Comment */}
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  &quot;{testimonial.comment}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// LOCATION SECTION
// ============================================
const LocationSection: React.FC = () => {
  return (
    <section id="ubicacion" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Cómo llegar
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Visítanos y encuentra el par perfecto para ti
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map / Store Image */}
          <div className="aero-card overflow-hidden p-2">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src="/assets/store-front.webp"
                alt="Fancy Pies - Fachada de la tienda en la Pulga 59, Local 23"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/800x600/4CAF50/FFFFFF?text=Nuestra+Tienda'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass rounded-xl p-4">
                  <p className="font-bold text-foreground">Pulga 59, Local 23</p>
                  <p className="text-sm text-muted-foreground">Mercado de Pulgas, Zona Centro</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {/* Address */}
            <div className="aero-card p-6">
              <div className="flex items-start gap-4">
                <div className="icon-container-aero flex-shrink-0 w-12 h-12">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Dirección</h3>
                  <p className="text-muted-foreground">
                    Pulga 59, Local 23<br />
                    Mercado de Pulgas, Zona Centro<br />
                    Ciudad de México, CDMX
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="aero-card p-6">
              <div className="flex items-start gap-4">
                <div className="icon-container-aero flex-shrink-0 w-12 h-12">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-3 text-foreground">Horarios de Atención</h3>
                  <div className="space-y-2">
                    {SCHEDULE.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{item.day}</span>
                        <span className="font-medium text-foreground">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Map Button */}
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="aero-button-blue aero-button text-center py-4"
            >
              <MapPin className="w-5 h-5 inline-block mr-2" />
              Ver ubicación en Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// CONTACT SECTION
// ============================================
const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al enviar el mensaje')
      }

      // Success
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el mensaje')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" className="py-16 sm:py-20 lg:py-24 aero-gradient relative overflow-hidden">
      <FloatingBubbles />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Contáctanos
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes dudas? Escríbenos y te respondemos al instante
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="aero-card p-6">
              <div className="flex items-center gap-4">
                <div className="icon-container-aero w-12 h-12">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Email</h3>
                  <p className="text-muted-foreground">contacto@fancypies.com</p>
                </div>
              </div>
            </div>

            <div className="aero-card p-6">
              <div className="flex items-center gap-4">
                <div className="icon-container-aero w-12 h-12">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Teléfono</h3>
                  <p className="text-muted-foreground">+52 55 1234 5678</p>
                </div>
              </div>
            </div>

            <div className="aero-card p-6">
              <div className="flex items-center gap-4">
                <div className="icon-container-aero w-12 h-12">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">WhatsApp</h3>
                  <p className="text-muted-foreground">+52 55 1234 5678</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="aero-card p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nombre</label>
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-aero w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-aero w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Mensaje</label>
                <Textarea
                  placeholder="¿En qué podemos ayudarte?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-aero w-full min-h-[120px] resize-none"
                  required
                />
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
                  <p className="font-medium">⚠️ {error}</p>
                </div>
              )}
              
              {/* Success Message */}
              {submitted && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 text-sm">
                  <p className="font-medium">✅ ¡Mensaje enviado correctamente! Te contactaremos pronto.</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="aero-button w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : submitted ? (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    ¡Mensaje Enviado!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Enviar Mensaje
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// FOOTER
// ============================================
const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-white py-12 sm:py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-accent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/50">
                <img 
                  src="/assets/logo.webp" 
                  alt="Fancy Pies Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold">Fancy Pies</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Tu destino para encontrar los zapatos perfectos. Calidad, estilo y precios justos en un solo lugar.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Contacto</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Pulga 59, Local 23
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                +52 55 1234 5678
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                contacto@fancypies.com
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Síguenos</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Fancy Pies. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// SNOW TOGGLE COMPONENT
// ============================================
const SnowToggle: React.FC<{ enabled: boolean; onToggle: (value: boolean) => void }> = ({
  enabled,
  onToggle,
}) => {
  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div className="aero-card p-3 flex items-center gap-3">
        {enabled ? (
          <Snowflake className="w-5 h-5 text-primary animate-pulse" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  )
}

// ============================================
// CHAT BUTTON
// ============================================
const ChatButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/525512345678"
      target="_blank"
      rel="noopener noreferrer"
      className="chat-button group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
        1
      </span>
    </a>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function Home() {
  const [snowEnabled, setSnowEnabled] = useState(false)

  return (
    <main className="min-h-screen flex flex-col">
      <SnowEffect active={snowEnabled} />
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <BenefitsSection />
      <TestimonialsSection />
      <LocationSection />
      <ContactSection />
      <Footer />
      <SnowToggle enabled={snowEnabled} onToggle={setSnowEnabled} />
      <ChatButton />
    </main>
  )
}
