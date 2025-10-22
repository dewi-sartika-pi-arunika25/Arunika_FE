"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, LogIn, Chrome, Home } from 'lucide-react'; 
import { signIn } from 'next-auth/react'; 
import Link from 'next/link';


// Komponen Separator (untuk memisahkan opsi login)
const Separator = () => (
    <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground dark:bg-gray-900">
                Atau
            </span>
        </div>
    </div>
);

/**
 * Komponen Halaman Login
 * Menyediakan opsi login manual dan login dengan Google.
 */
const LoginPage = () => {
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

   
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Logika login ke backend (menggunakan NextAuth.js credentials provider atau API)
        if (formData.email && formData.password) {
            console.log("Mencoba Login Manual:", formData);
    
            alert(`Mencoba login dengan ${formData.email}. (Login berhasil)`);
        } else {
            alert("Harap isi semua kolom.");
        }
    };

    // Handler untuk Login dengan Google (OAuth)
    const handleGoogleSignIn = () => {
        // Panggil fungsi signIn dari NextAuth.js dengan provider 'google'
        signIn('google', { callbackUrl: '/dashboard' }); 
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-sm shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mb-4">
                        <Link href="/" passHref className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex justify-center items-center">
                            <Home className="w-4 h-4 mr-1" /> Kembali ke Beranda
                        </Link>
                    </div>
                    <CardTitle className="text-3xl font-bold flex items-center justify-center">
                        <LogIn className="w-7 h-7 mr-2 text-primary" /> Masuk
                    </CardTitle>
                    <CardDescription>
                        Selamat datang kembali. Masuk ke akun Anda.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    {/* Tombol Login dengan Google (OAuth) */}
                    <Button 
                        variant="outline" 
                        onClick={handleGoogleSignIn} 
                        className="w-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Chrome className="mr-2 h-4 w-4" />
                        Masuk dengan Google
                    </Button>

                    <Separator />

                    {/* Formulir Login Manual */}
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        {/* Input Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Input Kata Sandi */}
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Kata Sandi</Label>
                                {/* Opsi Lupa Kata Sandi */}
                                <a
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline text-primary hover:text-primary/80"
                                >
                                    Lupa kata sandi?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Masukkan kata sandi Anda"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            Masuk <LogIn className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-0">
                    <p className="text-sm text-center text-gray-500">
                        Belum punya akun?
                        <a href="/register" className="ml-1 font-medium text-primary hover:underline">
                            Daftar di sini
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;