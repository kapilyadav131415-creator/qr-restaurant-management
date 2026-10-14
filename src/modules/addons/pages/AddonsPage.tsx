import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowRight, LayoutGrid, Plus, Layers } from 'lucide-react';
import { addonsApi } from '../api';
import { catalogApi } from '../../items/api';
import type { AddonGroupEntity, AddonItemEntity } from '../types';
import { AddonGroupCard } from '../components/AddonGroupCard';
import { AddonGroupModal } from '../components/AddonGroupModal';
import { AddonItemModal } from '../components/AddonItemModal';

const AddonsPage = () => {
  const { primaryColor, isDark } = useOutletContext<any>();
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  // Base menu items
  const [items, setItems] = useState<any[]>([]);
  const [searchItem, setSearchItem] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [loadingItems, setLoadingItems] = useState(true);

  // Addon data
  const [groups, setGroups] = useState<AddonGroupEntity[]>([]);
  const [allAddonItems, setAllAddonItems] = useState<AddonItemEntity[]>([]);
  const [loadingAddons, setLoadingAddons] = useState(false);

  // Modals state
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<AddonGroupEntity | null>(null);
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [selectedAddonItem, setSelectedAddonItem] = useState<AddonItemEntity | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<number>(0);

  // ------------------------------------------------------------------------
  // Data fetching
  // ------------------------------------------------------------------------
  const fetchBaseItems = async () => {
    setLoadingItems(true);
    try {
      const data = await catalogApi.getItems();
      setItems(data || []);
    } catch (err) {
      console.error('Failed to load menu items:', err);
      toast.error('Failed to load menu items');
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchAddonData = async (itemId: number) => {
    if (!itemId) return;
    setLoadingAddons(true);
    try {
      // Fetch groups for this item
      const fetchedGroups = await addonsApi.getGroups(itemId);
      setGroups(fetchedGroups);

      if (fetchedGroups.length) {
        // Fetch ALL addon items first (without filtering by group)
        const allItems = await addonsApi.getAddonItems();
        setAllAddonItems(allItems);
      } else {
        setAllAddonItems([]);
      }
    } catch (err) {
      console.error('Failed to load addon data:', err);
      toast.error('Failed to load addon data');
    } finally {
      setLoadingAddons(false);
    }
  };

  useEffect(() => {
    fetchBaseItems();
  }, []);

  useEffect(() => {
    if (selectedItemId) {
      fetchAddonData(selectedItemId);
    } else {
      setGroups([]);
      setAllAddonItems([]);
    }
  }, [selectedItemId]);

  // ------------------------------------------------------------------------
  // Group mutations
  // ------------------------------------------------------------------------
  const handleGroupSubmit = async (data: any) => {
    try {
      if (data.group_id) {
        await addonsApi.updateGroup(data);
        toast.success('Group updated successfully');
      } else {
        await addonsApi.createGroup(data);
        toast.success('Group created successfully');
      }
      setGroupModalOpen(false);
      if (selectedItemId) await fetchAddonData(selectedItemId);
    } catch (err: any) {
      console.error('Group save failed:', err);
      toast.error(err?.response?.data?.message || 'Save failed');
    }
  };

  const handleGroupDelete = async (id: number) => {
    if (!window.confirm('Delete this group and all its addon items?')) return;
    try {
      await addonsApi.deleteGroup(id);
      toast.success('Group deleted successfully');
      if (selectedItemId) await fetchAddonData(selectedItemId);
    } catch (err: any) {
      console.error('Group delete failed:', err);
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  // ------------------------------------------------------------------------
  // Item mutations
  // ------------------------------------------------------------------------
  const handleItemSubmit = async (data: any) => {
    try {
      if (data.addon_item_id) {
        await addonsApi.updateAddonItem(data);
        toast.success('Addon updated successfully');
      } else {
        await addonsApi.createAddonItem(data);
        toast.success('Addon created successfully');
      }
      setItemModalOpen(false);
      if (selectedItemId) await fetchAddonData(selectedItemId);
    } catch (err: any) {
      console.error('Addon save failed:', err);
      toast.error(err?.response?.data?.message || 'Save failed');
    }
  };

  const handleItemDelete = async (id: number) => {
    if (!window.confirm('Delete this addon?')) return;
    try {
      await addonsApi.deleteAddonItem(id);
      toast.success('Addon deleted successfully');
      if (selectedItemId) await fetchAddonData(selectedItemId);
    } catch (err: any) {
      console.error('Addon delete failed:', err);
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  // ------------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------------
  const filteredItems = items.filter(i =>
    (i.im_name || i.name || '').toLowerCase().includes(searchItem.toLowerCase())
  );
  const selectedItem = items.find(i => i.im_id === selectedItemId || i.id === selectedItemId);

  const openGroupModal = (group?: AddonGroupEntity) => {
    setSelectedGroup(group || null);
    setGroupModalOpen(true);
  };

  const openItemModal = (groupId: number, item?: AddonItemEntity) => {
    setActiveGroupId(groupId);
    setSelectedAddonItem(item || null);
    setItemModalOpen(true);
  };

  // Get items for a specific group
  const getGroupItems = (groupId: number) => {
    return allAddonItems.filter(item => item.group_id === groupId);
  };

  // ------------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------------
  return (
    <div className="max-w-[1400px] mx-auto pb-20 lg:pb-6 relative flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      <Toaster position="top-right" toastOptions={{ style: isDark ? { background: '#1f2937', color: '#fff' } : {} }} />

      {/* LEFT SIDEBAR */}
      <div className={`w-full lg:w-[350px] flex flex-col rounded-[32px] border shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="p-6 border-b border-inherit">
          <h2 className={`text-xl font-black ${textMain}`}>Menu Items</h2>
          <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${textMuted}`}>Select item to manage addons</p>
          <div className="mt-4 relative">
            <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchItem}
              onChange={e => setSearchItem(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              style={{ '--tw-ring-color': primaryColor?.value } as any}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loadingItems ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400" /></div>
          ) : filteredItems.length === 0 ? (
            <p className={`text-center py-10 text-sm font-bold ${textMuted}`}>No items found.</p>
          ) : (
            filteredItems.map(item => {
              const itemId = item.im_id ?? item.id;
              const isActive = selectedItemId === itemId;
              return (
                <button
                  key={itemId}
                  onClick={() => setSelectedItemId(itemId)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${isActive ? 'ring-2 shadow-md' : (isDark ? 'border-transparent hover:bg-gray-700/50' : 'border-transparent hover:bg-gray-50')}`}
                  style={isActive ? { borderColor: 'transparent', '--tw-ring-color': primaryColor?.value, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#fff' } as any : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      {item.im_image_url ? (
                        <img src={item.im_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><LayoutGrid size={16} /></div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold line-clamp-1 ${isActive ? textMain : textMuted}`}>
                        {item.im_name || item.name}
                      </p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${textMuted}`}>
                        {item.category_name || ''}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} className={`transition-transform ${isActive ? 'translate-x-1' : 'opacity-0'}`} style={{ color: primaryColor?.value }} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN PANEL */}
      <div className={`flex-1 flex flex-col rounded-[32px] border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {!selectedItemId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <Layers size={40} className={textMuted} />
            </div>
            <h2 className={`text-2xl font-black ${textMain}`}>Manage Addon Ecosystem</h2>
            <p className={`text-sm mt-2 max-w-md ${textMuted}`}>Select a base item from the sidebar to configure its addon groups, optional extras, and customization choices.</p>
          </div>
        ) : (
          <>
            <div className={`p-8 border-b flex justify-between items-center ${isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-100 bg-gray-50/50'}`}>
              <div>
                <h2 className={`text-2xl font-black ${textMain}`}>
                  {selectedItem?.im_name || selectedItem?.name || 'Selected Item'} <span className="font-medium opacity-50">Addons</span>
                </h2>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>Configure groups and choices</p>
              </div>
              <button
                onClick={() => openGroupModal()}
                className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform text-sm"
                style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}
              >
                <Plus size={18} /> New Group
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {loadingAddons ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400 w-10 h-10" /></div>
              ) : groups.length === 0 ? (
                <div className={`p-10 border border-dashed rounded-[24px] text-center ${isDark ? 'border-gray-700 bg-gray-900/20' : 'border-gray-300 bg-gray-50/50'}`}>
                  <p className={`text-lg font-black ${textMain}`}>No Addon Groups configured</p>
                  <p className={`text-sm mt-1 ${textMuted}`}>Customers will not see any customization options for this item.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {groups
                    .sort((a, b) => (a.ag_sort_order ?? 0) - (b.ag_sort_order ?? 0))
                    .map(group => {
                      const groupItems = getGroupItems(group.ag_id);
                      return (
                        <AddonGroupCard
                          key={group.ag_id}
                          group={group}
                          items={groupItems}
                          onEditGroup={openGroupModal}
                          onDeleteGroup={handleGroupDelete}
                          onAddItem={(gid) => openItemModal(gid)}
                          onEditItem={(item) => openItemModal(item.group_id, item)}
                          onDeleteItem={handleItemDelete}
                          isDark={isDark}
                          primaryColor={primaryColor}
                        />
                      );
                    })}
                </AnimatePresence>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODALS */}
      <AddonGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onSubmit={handleGroupSubmit}
        initialData={selectedGroup}
        itemId={selectedItemId!}
        primaryColor={primaryColor}
        isDark={isDark}
      />
      <AddonItemModal
        isOpen={isItemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSubmit={handleItemSubmit}
        initialData={selectedAddonItem}
        groupId={activeGroupId}
        primaryColor={primaryColor}
        isDark={isDark}
      />
    </div>
  );
};

export default AddonsPage;