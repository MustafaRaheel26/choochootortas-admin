import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Plus, Edit2, Trash2, EyeOff, Eye, X, PlusCircle, MinusCircle, Image as ImageIcon, Star, Search } from 'lucide-react';
import { cn } from '../utils/cn';
import { MenuItem } from '../types';

export function Menu() {
  const { menu, fetchMenu, addCategory, deleteCategory, addItem, updateItem, deleteItem, toggleItemAvailability } = useStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Modal State for Item
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    itemName: '',
    price: 0,
    description: '',
    ingredients: [],
    removeOptions: [],
    extras: [],
    categoryId: '',
    available: true,
    isBestseller: false,
    image: ''
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    if (menu.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(menu[0].id);
      // Also update formData categoryId when selected category changes
      setFormData(prev => ({ ...prev, categoryId: menu[0].id }));
    }
  }, [menu]);

  const selectedCategory = menu.find(c => c.id === selectedCategoryId);
  const filteredItems = searchTerm.trim() 
    ? menu.flatMap(c => c.items.map(item => ({ ...item, categoryName: c.name })))
        .filter(item => 
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : selectedCategory?.items || [];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await addCategory(newCategoryName);
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const openAddItemModal = () => {
    if (!selectedCategoryId) {
      alert('Please select a category first');
      return;
    }
    setEditingItemId(null);
    setFormData({
      itemName: '',
      price: 0,
      description: '',
      ingredients: [],
      removeOptions: [],
      extras: [],
      categoryId: selectedCategoryId,
      available: true,
      isBestseller: false,
      image: ''
    });
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: MenuItem) => {
    setEditingItemId(item.id);
    setFormData({
      itemName: item.itemName,
      price: item.price,
      description: item.description,
      ingredients: [...item.ingredients],
      removeOptions: [...(item.removeOptions || [])],
      extras: item.extras.map(e => ({ ...e })),
      categoryId: item.categoryId,
      available: item.available,
      isBestseller: item.isBestseller || false,
      image: item.image || ''
    });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async () => {
    console.log('🔍 handleSaveItem called');
    console.log('🔍 Current formData:', formData);
    
    // Validate required fields
    if (!formData.itemName || formData.itemName.trim() === '') {
      alert('Item name is required');
      console.log('❌ Validation failed: itemName is empty');
      return;
    }
    if (!formData.categoryId) {
      alert('Please select a category');
      console.log('❌ Validation failed: categoryId is missing');
      return;
    }
    if (formData.price <= 0) {
      alert('Please enter a valid price');
      console.log('❌ Validation failed: price is invalid');
      return;
    }

    try {
      console.log('✅ Validation passed, saving item...');
      
      // Prepare the data exactly as backend expects
      const itemToSave = {
        itemName: formData.itemName.trim(),
        price: formData.price,
        description: formData.description,
        ingredients: formData.ingredients.filter(i => i.trim() !== ''),
        removeOptions: formData.removeOptions,
        extras: formData.extras.filter(e => e.name.trim() !== ''),
        categoryId: formData.categoryId,
        available: formData.available,
        isBestseller: formData.isBestseller,
        image: formData.image || '',
      };
      
      console.log('📤 Sending to backend:', itemToSave);
      
      if (editingItemId) {
        await updateItem(editingItemId, itemToSave);
        alert('Item updated successfully!');
      } else {
        await addItem(formData.categoryId, itemToSave);
        alert('Item added successfully!');
      }
      setIsItemModalOpen(false);
      await fetchMenu();
    } catch (error: any) {
      console.error('❌ Failed to save item:', error);
      alert(`Failed to save item: ${error.message || 'Please try again'}`);
    }
  };

  // Dynamic List Handlers
  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const updateIngredient = (index: number, val: string) => {
    const nextArr = [...formData.ingredients];
    nextArr[index] = val;
    setFormData(prev => ({ ...prev, ingredients: nextArr }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }));
  };

  const addExtra = () => {
    setFormData(prev => ({ ...prev, extras: [...prev.extras, { name: '', price: 0 }] }));
  };

  const updateExtra = (index: number, field: 'name' | 'price', val: any) => {
    const nextExtras = [...formData.extras];
    nextExtras[index] = { ...nextExtras[index], [field]: field === 'price' ? parseFloat(val) || 0 : val };
    setFormData(prev => ({ ...prev, extras: nextExtras }));
  };

  const removeExtra = (index: number) => {
    setFormData(prev => ({ ...prev, extras: prev.extras.filter((_, i) => i !== index) }));
  };

  const toggleRemoveOption = (ingredient: string) => {
    setFormData(prev => {
      const current = prev.removeOptions || [];
      if (current.includes(ingredient)) {
        return { ...prev, removeOptions: current.filter(i => i !== ingredient) };
      } else {
        return { ...prev, removeOptions: [...current, ingredient] };
      }
    });
  };

  return (
    <div className="flex gap-8 relative">
      {/* Category Sidebar */}
      <aside className="w-80 space-y-6">
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-zinc-900">Categories</h3>
            <button 
              onClick={() => setIsAddingCategory(true)}
              className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              <Plus size={18} />
            </button>
          </div>

          {isAddingCategory && (
            <div className="mb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
              <input 
                autoFocus
                type="text" 
                placeholder="Category Name..." 
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={handleAddCategory} className="flex-1 bg-zinc-900 text-white py-2 rounded-xl text-xs font-bold cursor-pointer">Save</button>
                <button onClick={() => setIsAddingCategory(false)} className="flex-1 bg-zinc-100 text-zinc-500 py-2 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            {menu.map((cat) => (
              <div key={cat.id} className="group flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setFormData(prev => ({ ...prev, categoryId: cat.id }));
                  }}
                  className={cn(
                    "flex-1 flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all cursor-pointer",
                    selectedCategoryId === cat.id ? "bg-red-600 text-white shadow-lg" : "text-zinc-500 hover:bg-zinc-50"
                  )}
                >
                  <span>{cat.name}</span>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full", selectedCategoryId === cat.id ? "bg-red-500/50" : "bg-zinc-100")}>
                    {cat.items.length}
                  </span>
                </button>
                <button 
                  onClick={() => { if(confirm('Delete category and all items?')) deleteCategory(cat.id); }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-zinc-300 hover:text-red-500 transition-all cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Items Section */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              {searchTerm.trim() ? `Search: "${searchTerm}"` : (selectedCategory ? selectedCategory.name : 'Select Category')}
            </h1>
            <p className="text-zinc-500 mt-1">
              {searchTerm.trim() ? `Showing all matches from across the menu.` : 'Configure your kiosk items and customization rules.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search items..." 
                className="w-64 bg-white border border-zinc-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-red-500 transition-all shadow-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={openAddItemModal}
              className="flex items-center gap-2 bg-red-600 px-6 py-3 rounded-2xl text-sm font-bold text-white hover:bg-red-700 shadow-xl shadow-red-900/10 transition-all cursor-pointer"
            >
              <Plus size={20} />
              Add New Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems?.map((item) => (
            <div 
              key={item.id} 
              className={cn(
                "bg-white rounded-3xl border-2 transition-all duration-300 flex flex-col group overflow-hidden",
                item.available ? "border-transparent shadow-sm hover:shadow-xl shadow-zinc-200/50" : "border-zinc-100 bg-zinc-50 opacity-60 grayscale"
              )}
            >
              {item.image && (
                <div className="h-48 w-full relative overflow-hidden bg-zinc-100">
                  <img 
                    src={item.image} 
                    alt={item.itemName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  {item.isBestseller && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl shadow-red-900/20">
                      <Star size={12} className="fill-white" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Bestseller</span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {searchTerm.trim() && (item as any).categoryName && (
                      <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-widest mb-2 inline-block shadow-sm shadow-red-900/5">
                        {(item as any).categoryName}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xl text-zinc-900 uppercase tracking-tight">{item.itemName}</h4>
                      {!item.image && item.isBestseller && <Star size={16} className="text-amber-500 fill-amber-500" />}
                    </div>
                    <p className="text-sm text-zinc-500 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                  <span className="text-2xl font-black text-zinc-900 tracking-tighter">${item.price.toFixed(2)}</span>
                </div>

              <div className="flex-1 flex flex-wrap gap-2 mb-6">
                {item.ingredients.map(ing => (
                  <span key={ing} className="bg-zinc-100 text-[10px] font-bold text-zinc-500 px-3 py-1 rounded-full uppercase tracking-wide">
                    {ing}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={item.available} onChange={() => toggleItemAvailability(item.id, !item.available)} />
                    <div className="w-11 h-6 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
                    <span className="ms-3 text-xs font-bold text-zinc-400 peer-checked:text-zinc-900 uppercase">Available</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditItemModal(item)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer"><Edit2 size={18} /></button>
                  <button onClick={() => { if(confirm('Delete this item?')) deleteItem(item.id); }} className="p-2 text-zinc-400 hover:text-red-500 transition-all cursor-pointer"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* Item Modal (Overlay) */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsItemModalOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-zinc-100 p-8 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">{editingItemId ? 'Edit Menu Item' : 'New Menu Item'}</h2>
                <p className="text-zinc-400 text-sm font-medium">Fine-tune the perfect dish for your customers.</p>
              </div>
              <button 
                onClick={() => setIsItemModalOpen(false)}
                className="w-12 h-12 bg-zinc-100 text-zinc-500 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 block">Item Name *</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 outline-none focus:border-red-500 text-lg font-bold"
                      placeholder="e.g. Torta Hawaiiana"
                      value={formData.itemName}
                      onChange={(e) => {
                        console.log('📝 Item name changed:', e.target.value);
                        setFormData({...formData, itemName: e.target.value});
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 block">Description</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 outline-none focus:border-red-500 font-medium resize-none"
                      placeholder="Describe the flavors..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 block">Price ($) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 outline-none focus:border-red-500 text-lg font-black"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 block">Category *</label>
                    <select 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 outline-none focus:border-red-500 font-bold appearance-none cursor-pointer"
                      value={formData.categoryId}
                      onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    >
                      <option value="" disabled>Select Category</option>
                      {menu.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Ingredients */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ingredients</label>
                    <button onClick={addIngredient} className="text-red-600 text-xs font-black uppercase flex items-center gap-1 hover:underline cursor-pointer">
                      <PlusCircle size={14} /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2 text-sm font-bold"
                          placeholder="Ingredient name..."
                          value={ing}
                          onChange={e => updateIngredient(idx, e.target.value)}
                        />
                        <button onClick={() => removeIngredient(idx)} className="p-2 text-zinc-300 hover:text-red-500 cursor-pointer">
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    ))}
                    {formData.ingredients.length === 0 && <p className="text-zinc-300 text-xs italic">No ingredients listed.</p>}
                  </div>

                  <div className="pt-6">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-3">Allow Customers to Remove:</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.ingredients.filter(ing => ing.trim() !== '').map(ing => (
                        <button
                          key={ing}
                          onClick={() => toggleRemoveOption(ing)}
                          className={cn(
                            "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wide transition-all border cursor-pointer",
                            formData.removeOptions?.includes(ing) 
                              ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-900/10" 
                              : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300"
                          )}
                        >
                          {ing}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Extras */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Paid Extras / Upgrades</label>
                    <button onClick={addExtra} className="text-red-600 text-xs font-black uppercase flex items-center gap-1 hover:underline cursor-pointer">
                      <PlusCircle size={14} /> Add Extra
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.extras.map((ex, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2 text-sm font-bold"
                          placeholder="Extra name..."
                          value={ex.name}
                          onChange={e => updateExtra(idx, 'name', e.target.value)}
                        />
                        <div className="relative w-24">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                          <input 
                            type="number" 
                            step="0.01"
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-xl pl-6 pr-4 py-2 text-sm font-black"
                            placeholder="0.00"
                            value={ex.price}
                            onChange={e => updateExtra(idx, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <button onClick={() => removeExtra(idx)} className="p-2 text-zinc-300 hover:text-red-500 cursor-pointer">
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    ))}
                    {formData.extras.length === 0 && <p className="text-zinc-300 text-xs italic">No extras configured.</p>}
                  </div>

                  <div className="pt-6 space-y-4">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Visibility & Highlights</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded-md border-zinc-200 text-red-600 focus:ring-red-500" 
                          checked={formData.available}
                          onChange={e => setFormData({...formData, available: e.target.checked})}
                        />
                        <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900">Available on Kiosk</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded-md border-zinc-200 text-amber-500 focus:ring-amber-500" 
                          checked={formData.isBestseller}
                          onChange={e => setFormData({...formData, isBestseller: e.target.checked})}
                        />
                        <span className="text-sm font-bold text-zinc-600 group-hover:text-amber-500 flex items-center gap-1.5">
                          Most Popular <Star size={14} />
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="pt-4 space-y-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Item Photography</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div 
                    className="relative border-4 border-dashed border-zinc-100 rounded-[32px] p-8 flex flex-col items-center justify-center gap-3 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer group h-64"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => document.getElementById('imageUpload')?.click()}
                  >
                    <input 
                      id="imageUpload"
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-zinc-300 group-hover:scale-110 group-hover:text-red-500 transition-all shadow-md">
                      <ImageIcon size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-900">Drop item photo here</p>
                      <p className="text-xs text-zinc-400 font-medium mt-1">or click to browse files</p>
                    </div>
                  </div>

                  <div className="h-64 rounded-[32px] bg-zinc-50 border border-zinc-100 overflow-hidden relative group">
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, image: '' })); }}
                          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                        <ImageIcon size={48} className="opacity-10" />
                        <p className="text-[10px] font-black uppercase tracking-widest mt-4">Preview Window</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 block">External Image URL (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-3 outline-none focus:border-red-500 text-sm font-medium"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-100 flex justify-end gap-3 pb-8">
                <button 
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-10 py-4 rounded-2xl text-sm font-black uppercase text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSaveItem}
                  className="bg-zinc-900 text-white px-12 py-4 rounded-2xl text-sm font-black uppercase shadow-xl hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {editingItemId ? 'Update Dish' : 'Publish Dish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}