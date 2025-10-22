"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, ArrowRight, Chrome, Home} from 'lucide-react'; 
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const Separator = () => (
    <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground dark:bg-gray-900">
                Atau
            </span>
        </div>
    </div>
);

/**
 * Komponen Halaman Pendaftaran (Register) dengan OAuth
 */
const RegisterPage = () => {
    // State dan handler form yang sudah ada...
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logika pendaftaran manual
        if (formData.password !== formData.confirmPassword) {
            alert("Kata sandi dan konfirmasi kata sandi tidak cocok!");
            return;
        }
        console.log("Data Pendaftaran Manual:", formData);
        alert("Pendaftaran manual berhasil! (Simulasi)");
    };

    // Handler untuk Login/Daftar dengan Google
    const handleGoogleSignIn = () => {
        
        signIn('google', { callbackUrl: '/dashboard' });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mb-4">
                        <Link href="/" passHref className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex justify-center items-center">
                            <Home className="w-4 h-4 mr-1" /> Kembali ke Beranda
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold flex items-center justify-center">
                        <User className="w-6 h-6 mr-2 text-primary" /> Buat Akun Baru
                    </CardTitle>
                    <CardDescription>
                        Daftar dengan email atau gunakan akun sosial Anda.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    {/* Tombol Daftar dengan Google */}
                    <Button 
                        variant="outline" 
                        onClick={handleGoogleSignIn} 
                        className="w-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Chrome className="mr-2 h-4 w-4" />
                        Daftar dengan Google
                    </Button>

                    <Separator />

                    {/* Formulir Pendaftaran Manual */}
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        {/* Input Nama Lengkap */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Input Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m.doe@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Input Kata Sandi */}
                        <div className="grid gap-2">
                            <Label htmlFor="password">Kata Sandi</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimal 8 karakter"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Input Konfirmasi Kata Sandi */}
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Ketik ulang kata sandi"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-0">
                    <p className="text-sm text-center text-gray-500">
                        Sudah punya akun?
                        <a href="/login" className="ml-1 font-medium text-primary hover:underline">
                            Masuk di sini
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;