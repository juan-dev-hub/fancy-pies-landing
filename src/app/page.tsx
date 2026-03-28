'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
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
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react'

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const letterAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.05,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

const glowHover = {
  rest: { boxShadow: "0 8px 32px rgba(76, 175, 80, 0.1)" },
  hover: { 
    boxShadow: "0 20px 50px rgba(76, 175, 80, 0.25), 0 0 40px rgba(76, 175, 80, 0.15)",
    transition: { duration: 0.3 }
  }
}

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
// DATA
// ============================================
const NAV_LINKS = [
  { href: '#hero', label: 'Inicio' },
  { href: '#productos', label: 'Productos' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#ubicacion', label: 'Ubicación' },
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
  { id: 1, name: 'María García', comment: '¡Increíble calidad! Encontré el par perfecto para mi evento.', rating: 5, image: '/assets/client-1.webp' },
  { id: 2, name: 'Carlos Rodríguez', comment: 'Precios justos y gran variedad. La atención fue excepcional.', rating: 5, image: '/assets/client-2.webp' },
  { id: 3, name: 'Ana Martínez', comment: 'Me encantó la experiencia. Los zapatos son cómodos y únicos.', rating: 5, image: '/assets/client-3.webp' },
  { id: 4, name: 'José López', comment: 'Tienen tallas que en otros lados no encuentro. Muy recomendable.', rating: 4, image: '/assets/client-4.webp' },
  { id: 5, name: 'Laura Sánchez', comment: 'El mejor lugar para encontrar zapatos de calidad.', rating: 5, image: '/assets/client-5.webp' },
  { id: 6, name: 'Pedro Hernández', comment: 'Excelente ubicación y horarios convenientes.', rating: 5, image: '/assets/client-6.webp' },
]

const BENEFITS: Benefit[] = [
  { icon: <Zap className="w-8 h-8" />, title: 'Atención al Instante', description: 'Te atendemos rápidamente porque sabemos que tu tiempo es valioso.' },
  { icon: <Package className="w-8 h-8" />, title: 'Tallas Reales, Variedad Real', description: 'Tenemos la talla que buscas. Inventario siempre actualizado.' },
  { icon: <DollarSign className="w-8 h-8" />, title: 'Precios sin Drama', description: 'Precios justos y transparentes. Calidad que puedes pagar.' },
]

const SCHEDULE = [
  { day: 'Lunes - Viernes', hours: '9:00 AM - 7:00 PM' },
  { day: 'Sábado', hours: '10:00 AM - 6:00 PM' },
  { day: 'Domingo', hours: '11:00 AM - 4:00 PM' },
]

// ============================================
// SEASON DETECTOR
// ============================================
type Season = 'spring' | 'summer' | 'autumn' | 'winter'

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

function getSeasonInfo(season: Season) {
  const info = {
    spring: { name: 'Primavera', emoji: '🌸', color: '#FFB7C5' },
    summer: { name: 'Verano', emoji: '☀️', color: '#FFD700' },
    autumn: { name: 'Otoño', emoji: '🍂', color: '#D2691E' },
    winter: { name: 'Invierno', emoji: '❄️', color: '#87CEEB' },
  }
  return info[season]
}

// ============================================
// SEASONAL EFFECTS COMPONENT
// ============================================
const SeasonalEffect: React.FC = () => {
  const season = getCurrentSeason()
  
  const particles = React.useMemo(() => {
    const count = season === 'winter' ? 60 : season === 'autumn' ? 40 : 50
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 15 + 10,
      duration: Math.random() * 8 + 5,
      delay: Math.random() * 5,
      drift: (Math.random() - 0.5) * 100,
    }))
  }, [season])

  const getParticleEmoji = () => {
    switch (season) {
      case 'winter': return '❄'
      case 'summer': return '💧'
      case 'autumn': return '🍂'
      case 'spring': return '🌸'
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={particle.id}
          className="seasonal-particle"
          initial={{ opacity: 0, y: -20, x: `${particle.left}vw` }}
          animate={{ 
            opacity: [0, 0.9, 0.9, 0],
            y: '120vh',
            x: `calc(${particle.left}vw + ${particle.drift}px)`
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: `${particle.left}%`,
            fontSize: `${particle.size}px`,
          }}
        >
          {getParticleEmoji()}
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// SEASON INDICATOR
// ============================================
const SeasonIndicator: React.FC = () => {
  const season = getCurrentSeason()
  const info = getSeasonInfo(season)
  
  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50 aero-card px-4 py-2 flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: "backOut" }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.span 
        className="text-lg"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        {info.emoji}
      </motion.span>
      <span className="text-sm font-medium text-foreground">{info.name}</span>
    </motion.div>
  )
}

// ============================================
// FLOATING BUBBLES COMPONENT
// ============================================
const FloatingBubbles: React.FC = () => {
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 80 + 30,
    duration: Math.random() * 8 + 8,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            left: `${bubble.left}%`,
            width: bubble.size,
            height: bubble.size,
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05))',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ 
            y: '-20vh',
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear"
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'navbar-aero py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a 
            href="#hero" 
            className="flex items-center gap-3 group" 
            onClick={(e) => { e.preventDefault(); scrollToSection('#hero') }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-primary/30"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="/assets/logo.webp" 
                alt="Fancy Pies Logo" 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </motion.div>
            <motion.span 
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              whileHover={{ x: 3 }}
            >
              Fancy Pies
            </motion.span>
          </motion.a>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden lg:flex items-center gap-1"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                variants={fadeInDown}
                custom={i}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group rounded-lg hover:bg-primary/5"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {link.label}
                <motion.span 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "75%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-xl glass hover:scale-105 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-6 h-6 text-foreground" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu className="w-6 h-6 text-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0"
          >
            <motion.div 
              className="navbar-aero mx-4 mt-2 rounded-2xl overflow-hidden"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-4 flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollToSection(link.href)}
                    className="w-full px-4 py-3 text-left font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ============================================
// HERO SECTION
// ============================================
const HeroSection: React.FC = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const title = "Fancy Pies"

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img
          src="/assets/hero-bg.webp"
          alt="Fancy Pies - Zapatería Premium"
          className="w-full h-full object-cover scale-110"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="hero-overlay absolute inset-0" />
      </motion.div>

      <FloatingBubbles />

      {/* Content */}
      <motion.div className="relative z-10 container mx-auto px-4 text-center" style={{ opacity }}>
        <div className="max-w-4xl mx-auto">
          {/* Animated Title */}
          <motion.h1 
            className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg flex justify-center flex-wrap"
            initial="hidden"
            animate="visible"
          >
            {title.split('').map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterAnimation}
                className={char === ' ' ? 'mx-2 sm:mx-4' : 'inline-block'}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: [0, -10, 10, 0],
                  textShadow: "0 0 20px rgba(255,255,255,0.8)"
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            Mientras dudas, alguien más ya se probó el último par de tu talla.{' '}
            <motion.span 
              className="text-yellow-300 font-semibold inline-block"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Corre a la Pulga 59 antes que se agote.
            </motion.span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              variants={scaleIn}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(33, 150, 243, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#ubicacion')}
              className="aero-button-blue aero-button w-full sm:w-auto text-lg px-8 py-4"
            >
              <MapPin className="w-5 h-5 inline-block mr-2" />
              Ver cómo llegar
            </motion.button>
            
            <motion.button
              variants={scaleIn}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(76, 175, 80, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#ubicacion')}
              className="aero-button w-full sm:w-auto text-lg px-8 py-4"
            >
              <MessageCircle className="w-5 h-5 inline-block mr-2" />
              ¿Quieres saber si hay tu talla?
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div 
            className="w-1.5 h-3 bg-white/70 rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ============================================
// PRODUCTS SECTION
// ============================================
const ProductsSection: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)
  const [emblaApi, setEmblaApi] = useState<ReturnType<typeof useEmblaCarousel>[1] | null>(null)

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  return (
    <section id="productos" ref={ref} className="py-16 sm:py-20 lg:py-24 aero-gradient relative overflow-hidden">
      <FloatingBubbles />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <motion.h2 
            className="section-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground"
            whileHover={{ scale: 1.02 }}
          >
            Elige Antes Que Se Agoten
          </motion.h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Los mejores zapatos te esperan, pero no por mucho tiempo.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
          {/* Thumbnails */}
          <motion.div 
            className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[550px] pb-2 lg:pb-0 lg:pr-2 flex-shrink-0"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {PRODUCTS.map((product, index) => (
              <motion.button
                key={product.id}
                variants={scaleIn}
                onClick={() => scrollTo(index)}
                className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                  activeIndex === index
                    ? 'border-primary ring-2 ring-primary/50 scale-105 shadow-lg'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                whileHover={{ scale: activeIndex === index ? 1.05 : 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={product.thumbnail}
                  alt={`${product.name} - Vista previa`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/200x200/81C784/FFFFFF?text=${index + 1}`
                  }}
                />
              </motion.button>
            ))}
          </motion.div>

          {/* Main Carousel */}
          <motion.div 
            className="order-1 lg:order-2 flex-1 min-w-0"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInRight}
          >
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
                      <motion.div 
                        className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden"
                        initial={{ opacity: 0.5, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/800x600/4CAF50/FFFFFF?text=Producto+${index + 1}`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <motion.div 
                          className="absolute bottom-4 left-4 right-4"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="glass rounded-xl px-4 py-2 inline-block">
                            <p className="font-semibold text-foreground text-sm sm:text-base">{product.name}</p>
                          </div>
                        </motion.div>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="carousel-arrow left-4" />
                <CarouselNext className="carousel-arrow right-4" />
              </Carousel>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// BENEFITS SECTION
// ============================================
const BenefitsSection: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="beneficios" ref={ref} className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Por qué venir
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            No somos solo una zapatería, somos la solución a tus necesidades de calzado.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="aero-card p-6 sm:p-8 text-center group"
              whileHover="hover"
              initial="rest"
              animate="rest"
              style={{ perspective: 1000 }}
            >
              <motion.div
                variants={cardHover}
                className="h-full"
              >
                {/* Icon */}
                <motion.div 
                  className="icon-container-aero mx-auto mb-6"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-primary">{benefit.icon}</div>
                </motion.div>
                
                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">
                  {benefit.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
const TestimonialsSection: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="testimonios" ref={ref} className="py-16 sm:py-20 lg:py-24 aero-gradient-green relative overflow-hidden">
      <FloatingBubbles />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Opiniones que no pedimos...
          </h2>
          <p className="text-lg sm:text-xl text-white/80">
            ...pero igual nos dejaron
          </p>
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 px-2"
          style={{ scrollbarWidth: 'none' }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              variants={scaleIn}
              className="testimonial-card flex-shrink-0 w-[280px] sm:w-[320px] p-6"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <motion.div 
                  className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/30"
                  whileHover={{ scale: 1.1 }}
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/100x100/4CAF50/FFFFFF?text=${testimonial.name.charAt(0)}`
                    }}
                  />
                </motion.div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <motion.div key={j} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: j * 0.1 }}>
                        <Star
                          className={`w-4 h-4 ${
                            j < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Comment */}
              <p className="text-muted-foreground text-sm leading-relaxed italic">
                &quot;{testimonial.comment}&quot;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// LOCATION SECTION
// ============================================
const LocationSection: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="ubicacion" ref={ref} className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Cómo llegar
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Visítanos y encuentra el par perfecto para ti
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map / Store Image */}
          <motion.div 
            className="aero-card overflow-hidden p-2"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInLeft}
          >
            <motion.div 
              className="relative aspect-[4/3] rounded-xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src="/assets/store-front.webp"
                alt="Fancy Pies - Fachada"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/800x600/4CAF50/FFFFFF?text=Nuestra+Tienda'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <motion.div 
                className="absolute bottom-4 left-4 right-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
              >
                <div className="glass rounded-xl p-4">
                  <p className="font-bold text-foreground">Pulga 59, Local 23</p>
                  <p className="text-sm text-muted-foreground">Mercado de Pulgas, Zona Centro</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Info */}
          <motion.div 
            className="flex flex-col gap-6"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* Address */}
            <motion.div variants={fadeInRight} className="aero-card p-6" whileHover={{ scale: 1.02 }}>
              <div className="flex items-start gap-4">
                <motion.div 
                  className="icon-container-aero flex-shrink-0 w-12 h-12"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <MapPin className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Dirección</h3>
                  <p className="text-muted-foreground">
                    Pulga 59, Local 23<br />
                    Mercado de Pulgas, Zona Centro<br />
                    Ciudad de México, CDMX
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Schedule */}
            <motion.div variants={fadeInRight} className="aero-card p-6" whileHover={{ scale: 1.02 }}>
              <div className="flex items-start gap-4">
                <motion.div 
                  className="icon-container-aero flex-shrink-0 w-12 h-12"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Clock className="w-5 h-5 text-primary" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-3 text-foreground">Horarios de Atención</h3>
                  <div className="space-y-2">
                    {SCHEDULE.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="flex justify-between items-center text-sm"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-muted-foreground">{item.day}</span>
                        <span className="font-medium text-foreground">{item.hours}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map Button */}
            <motion.a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="aero-button-blue aero-button text-center py-4"
              variants={scaleIn}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(33, 150, 243, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin className="w-5 h-5 inline-block mr-2" />
              Ver ubicación en Google Maps
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// FOOTER
// ============================================
const Footer: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <footer ref={ref} className="bg-foreground text-white py-12 sm:py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-accent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {/* Brand */}
          <motion.div variants={fadeInUp} className="sm:col-span-2 lg:col-span-1">
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/50"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="/assets/logo.webp" 
                  alt="Fancy Pies Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </motion.div>
              <span className="text-2xl font-bold">Fancy Pies</span>
            </motion.div>
            <p className="text-white/60 text-sm leading-relaxed">
              Tu destino para encontrar los zapatos perfectos. Calidad, estilo y precios justos.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-bold mb-4 text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 4).map((link, i) => (
                <motion.li 
                  key={link.href}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-bold mb-4 text-lg">Contacto</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5, color: "rgb(76, 175, 80)" }}
              >
                <MapPin className="w-4 h-4 text-primary" />
                Pulga 59, Local 23
              </motion.li>
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5, color: "rgb(76, 175, 80)" }}
              >
                <Phone className="w-4 h-4 text-primary" />
                +52 55 1234 5678
              </motion.li>
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5, color: "rgb(76, 175, 80)" }}
              >
                <Mail className="w-4 h-4 text-primary" />
                contacto@fancypies.com
              </motion.li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-bold mb-4 text-lg">Síguenos</h4>
            <div className="flex gap-3">
              {[
                { icon: <Instagram className="w-5 h-5" />, href: "#" },
                { icon: <Facebook className="w-5 h-5" />, href: "#" },
                { icon: <Twitter className="w-5 h-5" />, href: "#" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div 
          className="pt-8 border-t border-white/10 text-center text-white/40 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>© {new Date().getFullYear()} Fancy Pies. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </footer>
  )
}

// ============================================
// CHAT BUTTON
// ============================================
const ChatButton: React.FC = () => {
  return (
    <motion.a
      href="https://wa.me/525512345678"
      target="_blank"
      rel="noopener noreferrer"
      className="chat-button group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <motion.span 
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        1
      </motion.span>
    </motion.a>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <SeasonalEffect />
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <BenefitsSection />
      <TestimonialsSection />
      <LocationSection />
      <Footer />
      <SeasonIndicator />
      <ChatButton />
    </main>
  )
}
