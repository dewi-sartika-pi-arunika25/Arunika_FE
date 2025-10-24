"use client";

import React, { useState } from 'react';
import Head from 'next/head';
// Import icon yang relevan dari lucide-react
import { GraduationCap, Briefcase, Target, Send, ChevronDown, List, BookOpen, Clock } from 'lucide-react';
// Import UI Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

// --- Data Pilihan Dropdown ---
const experienceLevels = [ // Data baru untuk Lama Pengalaman Kerja
    { label: "Junior ( < 1 tahun)", value: "junior" },
    { label: "Senior (1 - 5 tahun)", value: "senior" },
    { label: "Expert ( > 5 tahun)", value: "expert" },
];
const educationLevels = ["SMA/SMK", "D3", "S1", "S2", "S3"];
const interests = ["UI/UX Designer", "Front End Developer", "Back End Developer", "Product Manager"];

// --- Komponen Formulir Screening ---
const ScreeningPage = () => {
    // State untuk menyimpan data formulir
    const [formData, setFormData] = useState({
        latestJob: '',
        experienceLevel: '',
        educationLevel: '',
        major: '',
        interest: '',
        goal: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSelectChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };
const router = useRouter();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Data Screening Dikirim:', formData);
        // Di sini Anda bisa menambahkan logika POST API untuk mengirim data
        alert('Data berhasil disimpan! Anda akan diarahkan ke SKILLMATCH.');
        router.push('/skill-match');
};


    return (
        <div className="min-h-screen bg-yellow-50 py-16 text-gray-900 flex items-center justify-center">
            <Head>
                <title>Lengkapi Profil - Arunika</title>
            </Head>

            <Card className="w-full max-w-2xl shadow-xl bg-white border border-yellow-200">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center space-x-3 text-orange-600 mb-2">
                        <BookOpen className="h-7 w-7" />
                        <CardTitle className="text-3xl font-bold">Lengkapi Profil Awal</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                        Isi data berikut untuk mengaktifkan Analisis Karir AI yang dipersonalisasi.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* 1. Pekerjaan Terakhir / Saat Ini */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
    {/* Kolom Kiri: 1. Pekerjaan Terakhir / Saat Ini */}
    <div>
        <Label htmlFor="latestJob" className="flex items-center space-x-2 mb-2 font-semibold">
            <Briefcase className="h-4 w-4 text-gray-600" />
            <span>Pekerjaan Terakhir/Saat Ini</span>
        </Label>
        <Input
            id="latestJob"
            type="text"
            placeholder="Contoh: Junior Web Developer"
            value={formData.latestJob}
            onChange={handleChange}
            className="bg-yellow-100/50 border-yellow-300 focus:border-orange-500"
        />
    </div>

    {/* Kolom Kanan: 1.5. Lama Pengalaman Kerja */}
    <div>
        <Label htmlFor="experienceLevel" className="flex items-center space-x-2 mb-2 font-semibold">
            <Clock className="h-4 w-4 text-gray-600" />
            <span>Lama Pengalaman Kerja</span>
        </Label>
        <Select
            id="experienceLevel"
            onValueChange={(value) => handleSelectChange('experienceLevel', value)}
            value={formData.experienceLevel}
        >
            <SelectTrigger className="bg-yellow-100/50 border-yellow-300 focus:ring-orange-500">
                <SelectValue placeholder="Pilih Tingkat Pengalaman" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-xl border border-yellow-300">
                {experienceLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
</div>
                        

                        {/* 2. Pendidikan Terakhir (Dropdown & Input Jurusan) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="educationLevel" className="flex items-center space-x-2 mb-2 font-semibold">
                                    <GraduationCap className="h-4 w-4 text-gray-600" />
                                    <span>Pendidikan Terakhir</span>
                                </Label>
                                <Select
                                id="educationLevel"
                                onValueChange={(value) => handleSelectChange('educationLevel', value)}
                                value={formData.educationLevel}
    >
                                <SelectTrigger className="bg-yellow-100/50 border-yellow-300 focus:ring-orange-500">
                                <SelectValue placeholder="Pilih Jenjang" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-xl border border-yellow-300"> {/* <-- PERUBAHAN DI SINI */}
                                {educationLevels.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                                 </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Label htmlFor="major" className="flex items-center space-x-2 mb-2 font-semibold">
                                    <List className="h-4 w-4 text-gray-600" />
                                    <span>Jurusan</span>
                                </Label>
                                <Input
                                    id="major"
                                    type="text"
                                    placeholder="Contoh: Teknik Informatika"
                                    value={formData.major}
                                    onChange={handleChange}
                                    className="bg-yellow-100/50 border-yellow-300 focus:border-orange-500"
                                />
                            </div>
                        </div>

                        {/* 3. Minat Karir (Dropdown) */}
                        <div>
                            <Label htmlFor="interest" className="flex items-center space-x-2 mb-2 font-semibold">
                                <Target className="h-4 w-4 text-gray-600" />
                                <span>Minat Karir Saat Ini</span>
                            </Label>
                            <Select
                                id="interest"
                                onValueChange={(value) => handleSelectChange('interest', value)}
                                value={formData.interest}
>
                                <SelectTrigger className="bg-yellow-100/50 border-yellow-300 focus:ring-orange-500">
                                <SelectValue placeholder="Pilih Bidang Minat" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-xl border border-yellow-300"> {/* <-- PERUBAHAN DI SINI */}
                                {interests.map(interest => (
                                <SelectItem key={interest} value={interest}>{interest}</SelectItem>
             ))}
                                </SelectContent>
                                </Select>
                        </div>

                        {/* 4. Tujuan Karir (Textarea Bebas) */}
                        <div>
                            <Label htmlFor="goal" className="flex items-center space-x-2 mb-2 font-semibold">
                                <Send className="h-4 w-4 text-gray-600" />
                                <span>Tuliskan Tujuan Karir Anda</span>
                            </Label>
                            <Textarea
                                id="goal"
                                placeholder="Contoh: Dalam 1 tahun, saya ingin menjadi Front End Developer di perusahaan startup teknologi."
                                value={formData.goal}
                                onChange={handleChange}
                                rows={4}
                                className="bg-yellow-100/50 border-yellow-300 focus:border-orange-500"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-lg transition-colors"
                        >
                            Lakukan SkillMatch
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ScreeningPage;