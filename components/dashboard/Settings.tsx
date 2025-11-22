import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Trash2, Plus, Save, Loader2 } from 'lucide-react';
import { FormOptions } from '../../types';

export const Settings = () => {
  const [options, setOptions] = useState<FormOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newReason, setNewReason] = useState('');
  const [newSource, setNewSource] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await fetch('/api/options');
      if (res.ok) {
        const data = await res.json();
        setOptions(data);
      }
    } catch (error) {
      console.error('Failed to fetch options', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOptions = async (updatedOptions: FormOptions) => {
    setSaving(true);
    try {
      await fetch('/api/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOptions),
      });
      setOptions(updatedOptions);
    } catch (error) {
      console.error('Failed to save options', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddReason = () => {
    if (!newReason.trim() || !options) return;
    const updated = { ...options, reasons: [...options.reasons, newReason.trim()] };
    saveOptions(updated);
    setNewReason('');
  };

  const handleDeleteReason = (index: number) => {
    if (!options) return;
    const updated = { ...options, reasons: options.reasons.filter((_, i) => i !== index) };
    saveOptions(updated);
  };

  const handleAddSource = () => {
    if (!newSource.trim() || !options) return;
    const updated = { ...options, sources: [...options.sources, newSource.trim()] };
    saveOptions(updated);
    setNewSource('');
  };

  const handleDeleteSource = (index: number) => {
    if (!options) return;
    const updated = { ...options, sources: options.sources.filter((_, i) => i !== index) };
    saveOptions(updated);
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#9F6449]" /></div>;
  if (!options) return <div>Error loading settings</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Reasons Management */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#9F6449]/10">
        <h3 className="text-lg font-bold text-[#9F6449] mb-4 flex items-center gap-2">
          Manage Visit Reasons
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        </h3>
        
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="Add new reason..."
            className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:border-[#9F6449] outline-none"
          />
          <button onClick={handleAddReason} className="bg-[#9F6449] text-white p-2 rounded-lg hover:bg-[#85523d]">
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {options.reasons.map((reason, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
              <span className="text-gray-700">{reason}</span>
              <button 
                onClick={() => handleDeleteReason(idx)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sources Management */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#9F6449]/10">
        <h3 className="text-lg font-bold text-[#9F6449] mb-4 flex items-center gap-2">
          Manage Lead Sources
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        </h3>

        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="Add new source..."
            className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:border-[#9F6449] outline-none"
          />
          <button onClick={handleAddSource} className="bg-[#9F6449] text-white p-2 rounded-lg hover:bg-[#85523d]">
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {options.sources.map((source, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
              <span className="text-gray-700">{source}</span>
              {source !== 'Other' && ( // Protect 'Other' from deletion if desired, or allow it
                <button 
                  onClick={() => handleDeleteSource(idx)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};