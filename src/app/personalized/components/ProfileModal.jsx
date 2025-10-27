"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";

export default function ProfileModal({ profile, setProfile }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
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

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  // === AMBIL PROVINSI ===
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
        );
        if (!response.ok) throw new Error("Gagal mengambil data provinsi");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // === AMBIL KOTA SESUAI PROVINSI ===
  useEffect(() => {
    const fetchCities = async () => {
      if (!form.province) {
        setCities([]);
        return;
      }
      try {
        const response = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${form.province}.json`
        );
        if (!response.ok) throw new Error("Gagal mengambil data kota");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, [form.province]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
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
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#E4B200] hover:bg-[#D19C00] text-[#2C2C2C] text-sm font-medium rounded-xl">
          Perbarui Profil
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-2xl bg-[#FFFDF5] border border-[#E4B200]/30 rounded-2xl shadow-lg overflow-visible"
        style={{ overflowY: "auto" }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#A56400]">
            Perbarui Profil Pengguna
          </DialogTitle>
        </DialogHeader>

        {/* === FORM === */}
        <div className="space-y-4 mt-4">
          {/* FOTO PROFIL */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-[#E4B200]/50 flex items-center justify-center bg-[#FFF6DC]">
              {form.photo ? (
                <Image
                  src={form.photo}
                  alt="Foto Profil"
                  width={80}
                  height={80}
                  className="object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Photo</span>
              )}
            </div>
            <div>
              <Label
                htmlFor="photo"
                className="text-sm font-medium text-[#2C2C2C]"
              >
                Foto Profil
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="mt-1 text-sm"
              />
            </div>
          </div>

          {/* NAMA */}
          <div>
            <Label className="text-sm font-medium text-[#2C2C2C]">
              Nama Lengkap
            </Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="mt-1"
            />
          </div>

          {/* TEMPAT & TANGGAL LAHIR */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Tempat Lahir</Label>
              <Input
                value={form.birthPlace}
                onChange={(e) => handleChange("birthPlace", e.target.value)}
                placeholder="Contoh: Jakarta"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Tanggal Lahir</Label>
              <Input
                type="date"
                value={form.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

         {/* ALAMAT */}
<div className="space-y-2">
  <Label className="text-sm font-medium text-[#2C2C2C]">Alamat</Label>
  <div className="grid grid-cols-3 gap-2">
    {/* === NEGARA === */}
    <div className="w-full">
      <Label
        htmlFor="country"
        className="text-sm font-medium text-gray-700"
      >
        Negara
      </Label>
      <Select
        value={form.country}
        onValueChange={(v) => handleChange("country", v)}
      >
        <SelectTrigger className="w-full border border-gray-300 rounded-lg p-2 bg-background text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300">
          <SelectValue placeholder="Negara" />
        </SelectTrigger>
        <SelectContent className="bg-[#FFF6DC] text-gray-800">
          <SelectItem value="Indonesia">Indonesia</SelectItem>
          <SelectItem value="Malaysia">Malaysia</SelectItem>
          <SelectItem value="Singapore">Singapore</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* === PROVINSI === */}
    <div className="w-full">
      <Label
        htmlFor="province"
        className="text-sm font-medium text-gray-700"
      >
        Provinsi
      </Label>
      <Select
    value={form.province}
    onValueChange={(v) => handleChange("province", v)}
  >
    <SelectTrigger className="w-full border border-gray-300 rounded-lg p-2 bg-background text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300">
      <SelectValue placeholder="Pilih Provinsi" />
    </SelectTrigger>
    <SelectContent className="bg-[#FFF6DC] text-gray-800">
      {provinces.map((prov) => (
        <SelectItem key={prov.id} value={prov.id}>
          {prov.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
    </div>

    {/* === KOTA === */}
    <div className="w-full">
      <Label
        htmlFor="city"
        className="text-sm font-medium text-gray-700"
      >
        Kota / Kabupaten
      </Label>
      <Select
    value={form.city}
    onValueChange={(v) => handleChange("city", v)}
    disabled={!form.province}
  >
    <SelectTrigger className="w-full border border-gray-300 rounded-lg p-2 bg-background text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300">
      <SelectValue
        placeholder={
          form.province
            ? "Pilih Kota/Kabupaten"
            : "Pilih Provinsi terlebih dahulu"
        }
      />
    </SelectTrigger>
    <SelectContent className="bg-[#FFF6DC] text-gray-800">
      {cities.map((city) => (
        <SelectItem key={city.id} value={city.name}>
          {city.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
    </div>
  </div>

            <Input
              value={form.addressDetail}
              onChange={(e) => handleChange("addressDetail", e.target.value)}
              placeholder="Alamat detail"
              className="mt-2"
            />
          </div>

          {/* PEKERJAAN */}
          <div>
            <Label className="text-sm">Pekerjaan</Label>
            <Input
              value={form.job}
              onChange={(e) => handleChange("job", e.target.value)}
              placeholder="Contoh: Frontend Developer"
              className="mt-1"
            />
          </div>

          {/* PENGALAMAN KERJA */}
          <div>
            <Label className="text-sm">Pengalaman Kerja</Label>
            <Select
              value={form.experience}
              onValueChange={(v) => handleChange("experience", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih pengalaman" />
              </SelectTrigger>
              <SelectContent className="bg-[#FFF6DC] text-gray-800">
                <SelectItem value="<1 tahun">Kurang dari 1 tahun</SelectItem>
                <SelectItem value="1-5 tahun">1 - 5 tahun</SelectItem>
                <SelectItem value=">5 tahun">Lebih dari 5 tahun</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PENDIDIKAN */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm">Pendidikan</Label>
              <Select
                value={form.education}
                onValueChange={(v) => handleChange("education", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pendidikan" />
                </SelectTrigger>
                <SelectContent className="bg-[#FFF6DC] text-gray-800">
                  <SelectItem value="SMA">SMA</SelectItem>
                  <SelectItem value="Sarjana">Sarjana</SelectItem>
                  <SelectItem value="Pasca Sarjana">Pasca Sarjana</SelectItem>
                  <SelectItem value="Doktoral">Doktoral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Jurusan Pendidikan</Label>
              <Input
                value={form.major}
                onChange={(e) => handleChange("major", e.target.value)}
                placeholder="Contoh: Hukum"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="mt-6">
          <Button
            onClick={handleSave}
            className="bg-[#FF8C00] hover:bg-[#E67600] text-white rounded-lg"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
