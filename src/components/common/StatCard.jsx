import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';

const StatCard = ({ title, value, trend, bgColor, animate, delay = 0, icon: IconComponent }) => {
  return (
    <Motion.div
      initial={{ x: -12, opacity: 0 }}
      animate={animate ? { x: 0, opacity: 1 } : { x: -12, opacity: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      <Card className={`${bgColor} text-white transform transition-all duration-300 hover:brightness-110 relative overflow-hidden h-full`}>
        <CardContent className="h-full flex flex-col justify-between">

          <div>
            {/* ICON */}
            {IconComponent && (
              <div className="mb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <IconComponent className="w-7 h-7" />
                </div>
              </div>
            )}

            {/* TITLE */}
            <div className="text-xm font-semibold mb-2">
              {title}
            </div>

            {/* VALUE */}
            <span
              className="text-2xl font-bold block max-w-full truncate cursor-pointer"
              title={value}
            >
              {value}
            </span>
          </div>

          {/* Trend Indicator */}
          {title !== 'Total Customers' && (
            <div className="flex justify-end -mr-5 -mb-5">
              <div className="bg-purple-100 rounded-lg p-3">
                {trend === 'up' && (
                  <ArrowUpRight className="w-6 h-6 text-green-400" strokeWidth={3} />
                )}
                {trend === 'down' && (
                  <ArrowDownRight className="w-6 h-6 text-red-600" strokeWidth={3} />
                )}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </Motion.div>
  );
};

export default StatCard;
