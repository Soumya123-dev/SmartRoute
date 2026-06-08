import React, { useEffect, useRef } from 'react';
import { Navigation } from 'lucide-react';

export default function MapVisualization({ routeData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!routeData || !routeData.stops || routeData.stops.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Auto resize canvas
    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      drawMap();
    };
    
    const drawMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const stops = routeData.stops;
      const order = routeData.optimized_order || stops.map((_, i) => i);
      
      // Calculate bounds
      let minLat = Infinity, maxLat = -Infinity;
      let minLon = Infinity, maxLon = -Infinity;
      
      stops.forEach(s => {
        if(s.lat < minLat) minLat = s.lat;
        if(s.lat > maxLat) maxLat = s.lat;
        if(s.lon < minLon) minLon = s.lon;
        if(s.lon > maxLon) maxLon = s.lon;
      });
      
      // Add slight padding to bounds to prevent extreme zooming on close points
      if (maxLat - minLat < 0.01) { maxLat += 0.01; minLat -= 0.01; }
      if (maxLon - minLon < 0.01) { maxLon += 0.01; minLon -= 0.01; }
      
      const padding = 80;
      const width = canvas.width - padding * 2;
      const height = canvas.height - padding * 2;
      
      const getCoord = (lat, lon) => {
        const latDiff = maxLat - minLat || 1;
        const lonDiff = maxLon - minLon || 1;
        
        const x = padding + ((lon - minLon) / lonDiff) * width;
        const y = padding + ((maxLat - lat) / latDiff) * height; // Invert Y
        return { x, y };
      };
      
      // Draw lines (Glow effect)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)'; // Orange glow
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      for (let i = 0; i < order.length; i++) {
        const stop = stops[order[i]];
        const { x, y } = getCoord(stop.lat, stop.lon);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw primary line
      ctx.beginPath();
      ctx.strokeStyle = '#f97316'; // Solid orange
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      
      for (let i = 0; i < order.length; i++) {
        const stop = stops[order[i]];
        const { x, y } = getCoord(stop.lat, stop.lon);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw points
      for (let i = 0; i < order.length; i++) {
        const stop = stops[order[i]];
        const { x, y } = getCoord(stop.lat, stop.lon);
        
        const isStart = i === 0;
        
        // Glow for nodes
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = isStart ? 'rgba(236, 72, 153, 0.2)' : 'rgba(249, 115, 22, 0.2)';
        ctx.fill();

        // Background circle
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fillStyle = isStart ? '#ec4899' : '#1e1b4b';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = isStart ? '#ffffff' : '#f97316';
        ctx.stroke();
        
        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((i + 1).toString(), x, y);
        
        // Address label
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = '500 13px Inter';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(stop.address.split(',')[0], x, y + 28);
        ctx.shadowBlur = 0; // reset
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
    
  }, [routeData]);

  if (!routeData) {
    return (
      <div className="map-container glass-panel flex flex-col items-center justify-center gap-6 h-full">
        <div className="map-bg"></div>
        <div className="p-6 rounded-full bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-white/5 z-10 relative">
          <Navigation size={64} className="text-orange-400 animate-pulse relative z-10" />
          <div className="absolute inset-0 bg-orange-400/20 blur-xl rounded-full"></div>
        </div>
        <p className="text-gray-400 z-10 text-lg font-medium tracking-wide">Ready to map your Indian delivery route.</p>
      </div>
    );
  }

  return (
    <div className="map-container glass-panel relative h-full">
      <div className="map-bg"></div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}></canvas>
      
      <div className="absolute top-6 left-6 z-20 flex gap-4 animate-fade-in">
        <div className="stat-card">
          <div className="stat-value">{routeData.total_distance_km?.toFixed(1)} <span className="text-sm text-gray-400 font-medium">km</span></div>
          <div className="stat-label">Total Distance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{routeData.total_time_min?.toFixed(0)} <span className="text-sm text-gray-400 font-medium">min</span></div>
          <div className="stat-label">Est. Time</div>
        </div>
      </div>
    </div>
  );
}
