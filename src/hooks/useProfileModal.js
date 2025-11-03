/**
 * Custom hook untuk ProfileModal logic
 * Memisahkan business logic dari UI presentation
 */
import { useState, useEffect } from "react";

const PROVINCES_API = "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json";
const CITIES_API_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api/regencies";

export function useProfileModal(profile, setProfile, open) {
  const [form, setForm] = useState({
    photo: profile?.photo || "",
    name: profile?.name || "",
    birthPlace: profile?.birthPlace || "",
    birthDate: profile?.birthDate || "",
    country: profile?.country || "",
    province: profile?.province || "",
    city: profile?.city || "",
    addressDetail: profile?.addressDetail || "",
    job: profile?.job || "",
    experience: profile?.experience || "",
    education: profile?.education || "",
    major: profile?.major || "",
  });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Update form ketika profile berubah
  useEffect(() => {
    if (profile) {
      setForm({
        photo: profile.photo || "",
        name: profile.name || "",
        birthPlace: profile.birthPlace || "",
        birthDate: profile.birthDate || "",
        country: profile.country || "",
        province: profile.province || "",
        city: profile.city || "",
        addressDetail: profile.addressDetail || "",
        job: profile.job || "",
        experience: profile.experience || "",
        education: profile.education || "",
        major: profile.major || "",
      });
    }
  }, [profile]);

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetch(PROVINCES_API);
        if (!response.ok) throw new Error("Gagal mengambil data provinsi");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    
    if (open) {
      fetchProvinces();
    }
  }, [open]);

  // Fetch cities berdasarkan province
  useEffect(() => {
    const fetchCities = async () => {
      if (!form.province) {
        setCities([]);
        return;
      }
      
      setLoadingCities(true);
      try {
        const response = await fetch(`${CITIES_API_BASE}/${form.province}.json`);
        if (!response.ok) throw new Error("Gagal mengambil data kota");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    
    if (form.province) {
      fetchCities();
    }
  }, [form.province]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("photo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfile(form);
  };

  return {
    form,
    provinces,
    cities,
    loadingProvinces,
    loadingCities,
    handleChange,
    handlePhotoUpload,
    handleSave,
  };
}

