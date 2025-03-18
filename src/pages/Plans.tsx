import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star } from 'lucide-react';

export function Plans() {
  const { t } = useTranslation();

  const plans = [
    {
      name: 'Básico',
      price: '29',
      description: 'Perfecto para comenzar tu negocio',
      features: [
        'Hasta 100 productos',
        'Soporte por email',
        'Acceso a la API',
        'Análisis básicos',
        'Actualizaciones gratuitas'
      ]
    },
    {
      name: 'Profesional',
      price: '79',
      description: 'Ideal para negocios en crecimiento',
      popular: true,
      features: [
        'Hasta 1000 productos',
        'Soporte prioritario 24/7',
        'API con mayor límite',
        'Análisis avanzados',
        'Actualizaciones gratuitas',
        'Personalización avanzada',
        'Integración con marketplaces',
        'Reportes personalizados'
      ]
    },
    {
      name: 'Empresarial',
      price: '199',
      description: 'Para grandes empresas',
      features: [
        'Productos ilimitados',
        'Soporte dedicado',
        'API sin límites',
        'Análisis en tiempo real',
        'Actualizaciones prioritarias',
        'Personalización total',
        'Todas las integraciones',
        'Panel administrativo avanzado',
        'Capacitación personalizada'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Planes y Precios
        </h1>
        <p className="text-lg text-gray-600">
          Elige el plan perfecto para tu negocio. Todos los planes incluyen una prueba gratuita de 14 días.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl ${
              plan.popular
                ? 'bg-white border-2 border-primary-dark shadow-xl scale-105 z-10'
                : 'bg-white border border-gray-200 shadow-lg'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-0 right-0 flex justify-center">
                <div className="bg-primary-dark text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star size={16} className="mr-1" />
                  Popular
                </div>
              </div>
            )}

            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">S/ {plan.price}</span>
                <span className="text-gray-600">/mes</span>
              </div>

              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-primary-dark text-white hover:bg-primary'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Comenzar prueba gratuita
              </button>

              <div className="mt-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check size={20} className={`mr-3 flex-shrink-0 ${
                      plan.popular ? 'text-primary-dark' : 'text-gray-600'
                    }`} />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600">
          ¿Necesitas un plan personalizado?{' '}
          <a href="#" className="text-primary-dark font-medium hover:text-primary">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}