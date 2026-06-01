'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import type { OfficeSpace } from '@/src/features/offices/types/officeSpace.types';
import {
  createProviderOffice,
  deleteProviderOffice,
  getProviderOffices,
  toggleProviderOfficeFullyBooked,
  updateProviderOffice,
} from '@/src/features/offices/store/providerOffices.store';

export default function ProviderOfficesPage() {
  const { user } = useAuth();
  const providerId = user?.id;
  const [version, setVersion] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<OfficeSpace | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = useMemo(
    () => ({
      title: '',
      location: '',
      address: '',
      price: 1000000,
      duration: '20 days',
      about: '',
      rating: 4.5,
      tags: ['Popular'],
      image: '/assets/images/thumbnails/thumbnails-1.png',
      images: [] as string[],
      features: [] as string[],
      salesContacts: [] as Array<{ name: string; role: string; photo: string; email: string; phone: string }>,
      isFullyBooked: false,
    }),
    [],
  );

  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null]);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([false, false, false]);

  // Re-rendering (via `version`) is enough; reading storage on render keeps UI in sync.
  void version;
  const myOffices = getProviderOffices(providerId);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImagePreview(null);
    setImagePreviews([null, null, null]);
    setIsModalOpen(true);
  };

  const openEdit = (office: OfficeSpace) => {
    setEditing(office);
    setForm({
      title: office.title,
      location: office.location,
      address: office.address,
      price: office.price,
      duration: office.duration,
      about: office.about,
      rating: office.rating,
      tags: office.tags,
      image: office.image,
      features: office.features || [],
      salesContacts: office.salesContacts || [],
      isFullyBooked: office.isFullyBooked,
    });
    setImagePreview(office.image);
    setImagePreviews(office.images?.slice(0, 3) || [null, null, null]);
    setIsModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm((p) => ({ ...p, image: data.url }));
      } else {
        alert('Gagal upload gambar');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    

  const handleMultipleImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = event.target?.result as string;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const newUploading = [...uploadingImages];
    newUploading[index] = true;
    setUploadingImages(newUploading);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm((p) => {
          const newImages = [...(p.images || [])];
          newImages[index] = data.url;
          return { ...p, images: newImages };
        });
      } else {
        alert('Gagal upload gambar');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      newUploading[index] = false;
      setUploadingImages(newUploading);
    }
  };

  const handleSalesContactImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm((p) => {
          const newContacts = [...p.salesContacts];
          newContacts[index].photo = data.url;
          return { ...p, salesContacts: newContacts };
        });
      } else {
        alert('Gagal upload foto sales');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading sales photo');
    }
  };}
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setSaving(false);
    setImagePreview(null);
  };

  const handleSave = async () => {
    if (!providerId) return;
    if (!form.title.trim()) {
      alert('Judul kantor wajib diisi.');
      return;
    }
    if (!form.location.trim()) {
      alert('Lokasi wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      const mainImage = form.image.trim() || '/assets/images/thumbnails/thumbnails-1.png';
      const additionalImages = Array.isArray(form.images) ? form.images.filter(Boolean) : [];
      const allImages = [mainImage, ...additionalImages].filter((img, idx, arr) => arr.indexOf(img) === idx); // Deduplicate

      const input = {
        title: form.title.trim(),
        location: form.location.trim(),
        address: form.address.trim(),
        price: Number(form.price),
        duration: form.duration.trim() || '20 days',
        about: form.about.trim(),
        rating: Number(form.rating),
        tags: Array.isArray(form.tags) ? form.tags : ['Popular'],
        image: mainImage,
        images: allImages,
        features: Array.isArray(form.features) ? form.features.filter((f) => f.trim()) : [],
        salesContacts: Array.isArray(form.salesContacts) ? form.salesContacts.filter((c) => c.name && c.email) : [],
        isFullyBooked: Boolean(form.isFullyBooked),
      };

      if (editing) {
        updateProviderOffice(providerId, editing.id, input);
      } else {
        createProviderOffice(providerId, input);
      }
      setVersion((v) => v + 1);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg text-[#000929]">Kantor Saya ({myOffices.length})</h2>
          <p className="text-sm opacity-60 mt-1">Kelola listing kantor yang Anda daftarkan</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-[#FF852D] text-white font-semibold px-6 py-2.5 text-sm hover:opacity-90 transition"
        >
          + Tambah Kantor
        </button>
      </div>

      {myOffices.length === 0 ? (
        <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-12 text-center">
          <p className="text-lg font-semibold opacity-60 mb-2">Belum ada kantor terdaftar</p>
          <p className="text-sm opacity-40">Tambahkan kantor pertama Anda dari tombol di kanan atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {myOffices.map((office) => (
            <div key={office.id} className="bg-white border border-[#E0DEF7] rounded-[20px] overflow-hidden">
              <div className="relative h-[180px]">
                <Image src={office.image} alt={office.title} fill className="object-cover" />
                {office.isFullyBooked && (
                  <span className="absolute top-4 right-4 bg-[#FF2D2D] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Fully Booked
                  </span>
                )}
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-[#000929] leading-snug">{office.title}</h3>
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Image src="/assets/images/icons/location.svg" width={16} height={16} alt="" />
                  {office.location}
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#FF852D]">
                    Rp {office.price.toLocaleString('id-ID')}
                    <span className="text-xs font-normal opacity-60"> / {office.duration}</span>
                  </p>
                  <span className="text-sm font-semibold">⭐ {office.rating}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      if (!providerId) return;
                      toggleProviderOfficeFullyBooked(providerId, office.id);
                      setVersion((v) => v + 1);
                    }}
                    className="text-xs font-semibold px-3 py-2 rounded-full border border-[#E0DEF7] hover:border-[#FF852D] transition"
                    title="Toggle status fully booked"
                  >
                    {office.isFullyBooked ? 'Set Available' : 'Set Fully Booked'}
                  </button>
                  <button
                    onClick={() => {
                      if (!providerId) return;
                      const ok = confirm('Hapus kantor ini?');
                      if (!ok) return;
                      deleteProviderOffice(providerId, office.id);
                      setVersion((v) => v + 1);
                    }}
                    className="text-xs font-semibold px-3 py-2 rounded-full border border-[#E0DEF7] text-[#FF2D2D] hover:border-[#FF2D2D] transition"
                  >
                    Hapus
                  </button>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/office/${office.slug}`}
                    className="flex-1 text-center rounded-full border border-[#E0DEF7] py-2 text-sm font-semibold hover:border-[#FF852D] transition-all"
                  >
                    Lihat
                  </Link>
                  <button
                    onClick={() => openEdit(office)}
                    className="flex-1 rounded-full bg-[#FF852D] text-white py-2 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative w-full max-w-[720px] bg-white rounded-[20px] border border-[#E0DEF7] p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-lg text-[#000929]">{editing ? 'Edit Kantor' : 'Tambah Kantor'}</h3>
                <p className="text-sm opacity-60 mt-1">Data ini disimpan lokal (browser) untuk demo.</p>
              </div>
              <button onClick={closeModal} className="text-sm font-semibold opacity-60 hover:opacity-100">
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-semibold">Judul</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="mt-2 w-full border border-[#E0DEF7] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                  placeholder="Nama kantor"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Lokasi</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="mt-2 w-full border border-[#E0DEF7] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                  placeholder="Jakarta, Bandung, dll"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Harga</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                  className="mt-2 w-full border border-[#E0DEF7] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Durasi</label>
                <input
                  value={form.duration}
                  onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                  className="mt-2 w-full border border-[#E0DEF7] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                  placeholder="20 days"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                  className="mt-2 w-full border border-[#E0DEF7] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-semibold">Alamat</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className="mt-2 w-full border border-[#E0DEF7] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                  placeholder="Alamat detail"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-semibold">Deskripsi</label>
                <textarea
                  value={form.about}
                  onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))}
                  className="mt-2 w-full border border-[#E0DEF7] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF852D] min-h-[110px]"
                  placeholder="Tentang kantor"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-semibold">Gambar Kantor Utama</label>
                <div className="mt-2 flex flex-col gap-3">
                  {imagePreview && (
                    <div className="w-full h-[150px] rounded-[14px] overflow-hidden border border-[#E0DEF7]">
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                    className="w-full border border-[#E0DEF7] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF852D] disabled:opacity-50"
                  />
                  {uploadingImage && <p className="text-xs text-[#FF852D]">Uploading...</p>}
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-semibold">Gambar Kantor Tambahan (3 foto)</label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      {imagePreviews[idx] && (
                        <div className="w-full h-[120px] rounded-[14px] overflow-hidden border border-[#E0DEF7]">
                          <img src={imagePreviews[idx]!} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleMultipleImageChange(idx, e)}
                        disabled={uploadingImages[idx]}
                        className="w-full border border-[#E0DEF7] rounded-[8px] px-2 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF852D] disabled:opacity-50"
                      />
                      {uploadingImages[idx] && <p className="text-xs text-[#FF852D]">Uploading...</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-semibold">Features (pisahkan dengan koma)</label>
                <input
                  value={Array.isArray(form.features) ? form.features.join(', ') : ''}
                  onChange={(e) => setForm((p) => ({ ...p, features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean) }))}
                  className="mt-2 w-full border border-[#E0DEF7] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                  placeholder="High Speed Wifi, 100% Privacy, Free Move, Sustainability, Parking Space, Compact"
                />
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold">Sales Contacts</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((p) => ({
                        ...p,
                        salesContacts: [...(p.salesContacts || []), { name: '', role: '', photo: '', email: '', phone: '' }],
                      }));
                    }}
                    className="text-xs font-semibold text-[#FF852D] hover:opacity-80"
                  >
                    + Tambah Contact
                  </button>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {Array.isArray(form.salesContacts) && form.salesContacts.length > 0 ? (
                    form.salesContacts.map((contact, idx) => (
                      <div key={idx} className="border border-[#E0DEF7] rounded-[14px] p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={contact.name}
                            onChange={(e) => {
                              const newContacts = [...form.salesContacts];
                              newContacts[idx].name = e.target.value;
                              setForm((p) => ({ ...p, salesContacts: newContacts }));
                            }}
                            className="border border-[#E0DEF7] rounded-[8px] px-2 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF852D]"
                            placeholder="Nama"
                          />
                          <input
                            value={contact.role}
                            onChange={(e) => {
                              const newContacts = [...form.salesContacts];
                              newContacts[idx].role = e.target.value;
                              setForm((p) => ({ ...p, salesContacts: newContacts }));
                            }}
                            className="border border-[#E0DEF7] rounded-[8px] px-2 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF852D]"
                            placeholder="Role (Sales Manager, etc)"
                          />
                        </div>
                        <input
                          value={contact.email}
                          onChange={(e) => {
                            const newContacts = [...form.salesContacts];
                            newContacts[idx].email = e.target.value;
                            setForm((p) => ({ ...p, salesContacts: newContacts }));
                          }}
                          className="w-full border border-[#E0DEF7] rounded-[8px] px-2 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF852D]"
                          placeholder="Email"
                        />
                        <input
                          value={contact.phone}
                          onChange={(e) => {
                            const newContacts = [...form.salesContacts];
                            newContacts[idx].phone = e.target.value;
                            setForm((p) => ({ ...p, salesContacts: newContacts }));
                          }}
                          className="w-full border border-[#E0DEF7] rounded-[8px] px-2 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF852D]"
                          placeholder="No Telepon"
                        />
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold">Foto Profile</label>
                          {contact.photo && (
                            <div className="w-full h-[60px] rounded-[8px] overflow-hidden border border-[#E0DEF7]">
                              <img src={contact.photo} alt={contact.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/images/photos/photo-1.png'; }} />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSalesContactImageChange(idx, e)}
                            className="w-full border border-[#E0DEF7] rounded-[8px] px-2 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF852D]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setForm((p) => ({
                              ...p,
                              salesContacts: p.salesContacts.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="w-full text-xs font-semibold text-[#FF2D2D] hover:opacity-80 py-1"
                        >
                          Hapus
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs opacity-50 text-center py-2">Belum ada sales contact</p>
                  )}
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-4 rounded-[14px] border border-[#E0DEF7] px-4 py-3">                <div>
                  <p className="text-sm font-semibold text-[#000929]">Full bookings</p>
                  <p className="text-xs opacity-60">Jika aktif, kantor tampil “Fully Booked” dan tidak bisa dibooking.</p>
                </div>
                <button
                  onClick={() => setForm((p) => ({ ...p, isFullyBooked: !p.isFullyBooked }))}
                  className="text-xs font-semibold px-3 py-2 rounded-full"
                  style={{ backgroundColor: form.isFullyBooked ? '#FF2D2D' : '#F7F7FD', color: form.isFullyBooked ? 'white' : '#000929' }}
                >
                  {form.isFullyBooked ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="rounded-full border border-[#E0DEF7] px-6 py-2.5 text-sm font-semibold hover:border-[#FF852D] transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-[#FF852D] text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
