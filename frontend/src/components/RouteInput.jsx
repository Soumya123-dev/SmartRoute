import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Rocket, Loader, Map } from 'lucide-react';

export default function RouteInput({ onOptimize, isLoading }) {
  // Indian Default Routes
  const [stops, setStops] = useState([
    "Gateway of India, Mumbai, MH",
    "Marine Drive, Mumbai, MH",
    "Bandra Kurla Complex, Mumbai, MH",
    "Chhatrapati Shivaji Terminus, Mumbai, MH"
  ]);
  const [newStop, setNewStop] = useState("");

  const addStop = (e) => {
    e.preventDefault();
    if (newStop.trim()) {
      setStops([...stops, newStop.trim()]);
      setNewStop("");
    }
  };

  const removeStop = (index) => {
    const newStops = [...stops];
    newStops.splice(index, 1);
    setStops(newStops);
  };

  const handleOptimize = () => {
    if (stops.length >= 2) {
      onOptimize(stops);
    }
  };

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg">
            <Map size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Delivery Stops</h2>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-lg text-gray-400 border border-white/5">
          {stops.length} Stops
        </span>
      </div>

      <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2">
        {stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-black/20 hover:bg-black/40 transition-all rounded-xl border border-white/5 group">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center text-sm font-bold shadow-lg">
              {i + 1}
            </div>
            <div className="flex-1 text-sm truncate text-gray-300 font-medium" title={stop}>
              {stop}
            </div>
            <button 
              onClick={() => removeStop(i)}
              className="text-gray-500 hover:text-red-400 transition-all p-2"
              title="Remove Stop"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={addStop} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={newStop}
          onChange={(e) => setNewStop(e.target.value)}
          placeholder="Add an address in India..."
          className="input-field shadow-inner"
        />
        <button type="submit" className="btn !px-4" disabled={!newStop.trim() || isLoading}>
          <Plus size={22} />
        </button>
      </form>

      <button 
        onClick={handleOptimize} 
        disabled={stops.length < 2 || isLoading}
        className="btn w-full !text-lg !py-3 flex justify-center items-center gap-3"
      >
        {isLoading ? (
          <><Loader size={24} className="animate-spin" /> Optimizing...</>
        ) : (
          <><Rocket size={24} /> Optimize Route</>
        )}
      </button>
      {stops.length < 2 && (
        <p className="text-xs text-red-400 mt-3 text-center">Please add at least 2 stops to optimize.</p>
      )}
    </div>
  );
}
