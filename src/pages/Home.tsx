import React from 'react';
import { MessageSquare, Shield, Package, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=600&q=80",
    title: "ESCALA TU E-COMMERCE 360°",
    subtitle: "Los grandes líderes del e-commerce eligen Dropi para escalar",
    event: {
      type: "Gran Workshop Virtual",
      speaker: "FRANKZ KASTNER",
      role: "Especialista en Escalamiento",
      date: "JUEVES 06 DE FEBRERO",
      time: "20:00 HRS.",
      country: "PERU"
    }
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&q=80",
    title: "OPTIMIZA TUS VENTAS",
    subtitle: "Aprende las mejores estrategias de e-commerce",
    event: {
      type: "Webinar Exclusivo",
      speaker: "MARIA RODRIGUEZ",
      role: "E-commerce Strategist",
      date: "MARTES 10 DE FEBRERO",
      time: "18:00 HRS.",
      country: "PERU"
    }
  }
];

export function Home() {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Slider */}
        <div className="relative h-[500px] bg-gray-900 rounded-lg overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="https://flagcdn.com/pe.svg" alt="Peru" className="w-6 h-4" />
                <span className="text-white font-medium">I {slides[currentSlide].event.country}</span>
              </div>
            </div>

            <div className="text-white">
              <h1 className="text-4xl font-bold mb-4">{slides[currentSlide].title}</h1>
              <p className="text-xl mb-8">{slides[currentSlide].subtitle}</p>
              
              <div className="space-y-4">
                <div className="text-2xl font-semibold">{slides[currentSlide].event.type}</div>
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80"
                    alt={slides[currentSlide].event.speaker}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <div className="text-xl font-bold">{slides[currentSlide].event.speaker}</div>
                    <div className="text-gray-300">{slides[currentSlide].event.role}</div>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{slides[currentSlide].event.date}</div>
                  <div className="text-xl">{slides[currentSlide].event.time}</div>
                </div>
                <button className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                  ¡Conéctate aquí!
                </button>
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="text-white" size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="text-white" size={24} />
            </button>
          </div>
        </div>

        {/* Warranty Module */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Módulo de Garantías</h2>
          <div className="aspect-video bg-orange-100 rounded-lg flex items-center justify-center">
            <Shield size={48} className="text-orange-500" />
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Announcement Banner */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-6">
            <div className="bg-orange-100 p-4 rounded-full flex-shrink-0">
              <MessageSquare size={24} className="text-orange-500" />
            </div>
            <p className="text-gray-600">
              Tu satisfacción es muy importante para nosotros, por eso, recientemente estuvimos
              generando actualizaciones para mejorar tu experiencia en la Plataforma.
            </p>
          </div>
        </div>

        {/* Training Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Capacitaciones</h2>
          <div className="space-y-4">
            {[
              { name: 'Dropshipper', icon: Package },
              { name: 'Proveedor', icon: Package },
              { name: 'Baratísimo', icon: Package },
              { name: 'El Gran Yo Soy', icon: Package }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <item.icon size={20} className="text-orange-500" />
                  </div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  Agendarme
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}