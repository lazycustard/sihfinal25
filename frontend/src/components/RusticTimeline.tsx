import React from 'react';
import { motion } from 'framer-motion';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  icon: string;
  status: 'completed' | 'current' | 'pending';
  details?: {
    temperature?: string;
    humidity?: string;
    quality?: string;
    certifications?: string[];
  };
}

interface RusticTimelineProps {
  steps: TimelineStep[];
  productName: string;
}

const RusticTimeline: React.FC<RusticTimelineProps> = ({ steps, productName }) => {
  return (
    <div className="rustic-card p-8">
      {/* Timeline Header */}
      <div className="text-center mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-deep-green font-heading mb-2"
        >
          🌾 Journey of {productName}
        </motion.h2>
        <p className="text-warm-brown font-body">From farm to your table - every step traced</p>
      </div>

      {/* Timeline Path */}
      <div className="relative">
        {/* Background Path */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-warm-brown via-deep-green to-accent-yellow rounded-full transform -translate-y-1/2 z-0"></div>
        
        {/* Timeline Steps */}
        <div className="flex justify-between items-center relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center"
            >
              {/* Wooden Signboard */}
              <div className={`wooden-signboard p-4 mb-4 min-w-[200px] ${
                step.status === 'current' ? 'sprouting' : ''
              }`}>
                <div className="text-center">
                  <div className="text-3xl mb-2 hand-drawn-icon">{step.icon}</div>
                  <h3 className="font-bold text-cream-bg font-heading text-lg mb-1">{step.title}</h3>
                  <p className="text-cream-bg text-sm font-body opacity-90">{step.description}</p>
                  <div className="mt-2 text-xs text-cream-bg opacity-75">
                    <div>{step.date}</div>
                    <div>{step.location}</div>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className={`w-6 h-6 rounded-full border-4 ${
                step.status === 'completed' 
                  ? 'bg-deep-green border-cream-bg' 
                  : step.status === 'current'
                  ? 'bg-accent-yellow border-warm-brown animate-pulse'
                  : 'bg-gray-300 border-gray-400'
              }`}>
                {step.status === 'completed' && (
                  <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>
                )}
              </div>

              {/* Details Card */}
              {step.details && step.status !== 'pending' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="parchment-card p-3 mt-4 min-w-[180px]"
                >
                  <div className="text-xs space-y-1 text-dark-brown font-body">
                    {step.details.temperature && (
                      <div className="flex justify-between">
                        <span>🌡️ Temp:</span>
                        <span>{step.details.temperature}</span>
                      </div>
                    )}
                    {step.details.humidity && (
                      <div className="flex justify-between">
                        <span>💧 Humidity:</span>
                        <span>{step.details.humidity}</span>
                      </div>
                    )}
                    {step.details.quality && (
                      <div className="flex justify-between">
                        <span>⭐ Quality:</span>
                        <span>{step.details.quality}</span>
                      </div>
                    )}
                    {step.details.certifications && (
                      <div className="mt-2">
                        <div className="text-xs font-semibold mb-1">Certifications:</div>
                        <div className="flex flex-wrap gap-1">
                          {step.details.certifications.map((cert, i) => (
                            <span key={i} className="bg-deep-green text-cream-bg px-2 py-1 rounded-full text-xs">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline Legend */}
      <div className="mt-8 flex justify-center space-x-6 text-sm font-body">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-deep-green rounded-full"></div>
          <span className="text-warm-brown">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-accent-yellow rounded-full animate-pulse"></div>
          <span className="text-warm-brown">Current</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <span className="text-warm-brown">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default RusticTimeline;
