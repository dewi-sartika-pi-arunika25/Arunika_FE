"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, ArrowRight, Chrome, Home } from 'lucide-react'; 
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { authAPI } from '@/app/lib/api';

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

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        pendidikan: '',
        pekerjaan: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Kata sandi dan konfirmasi tidak cocok!');
            return;
        }

        if (formData.password.length < 6) {
            setError('Kata sandi minimal 6 karakter!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                pendidikan: formData.pendidikan,
                pekerjaan: formData.pekerjaan,
            });

            if (response.data.success) {
                const { access_token, refresh_token, user } = response.data.data;

                // Simpan tokens
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('user', JSON.stringify(user));

                setSuccess('Pendaftaran berhasil! Anda akan diarahkan ke dashboard...');
                
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Pendaftaran gagal. Silakan coba lagi.');
            console.error('Register error:', err);
        } finally {
            setIsLoading(false);
        }
    };

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
                    {error && (
                        <div className="p-3 rounded-md bg-red-100 text-red-700 text-sm border border-red-300">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 rounded-md bg-green-100 text-green-700 text-sm border border-green-300">
                            {success}
                        </div>
                    )}

                    <Button 
                        variant="outline" 
                        onClick={handleGoogleSignIn} 
                        className="w-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Chrome className="mr-2 h-4 w-4" />
                        Daftar dengan Google
                    </Button>

                    <Separator />

                    <form onSubmit={handleSubmit} className="grid gap-4">
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
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

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
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="pendidikan">Pendidikan</Label>
                            <Input
                                id="pendidikan"
                                type="text"
                                placeholder="Mis: S1 Informatika"
                                value={formData.pendidikan}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="pekerjaan">Pekerjaan Saat Ini</Label>
                            <Input
                                id="pekerjaan"
                                type="text"
                                placeholder="Mis: Software Engineer"
                                value={formData.pekerjaan}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Kata Sandi</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimal 6 karakter"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="pl-10"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

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
                                    minLength={6}
                                    className="pl-10"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full mt-2"
                            disabled={isLoading || success}
                        >
                            {isLoading ? 'Memproses...' : 'Daftar Sekarang'} 
                            {!isLoading && success === '' && <ArrowRight className="ml-2 h-4 w-4" />}
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