// components/ForgotPassword.jsx atau app/forgot-password/page.jsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '@/lib/api';

/**
 * Komponen Halaman Lupa Kata Sandi (Forgot Password)
 * Menggunakan Zustand store dan backend API
 */
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email) {
            setError("Harap masukkan alamat email.");
            return;
        }

        // Validasi email format sederhana
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Format email tidak valid.");
            return;
        }

        setIsLoading(true);

        try {
            // Panggil backend API untuk kirim email reset password
            const response = await authAPI.forgotPassword(email);

            if (response?.data?.success) {
                setIsSubmitted(true);
            } else {
                setError(response?.data?.error || response?.data?.message || 'Gagal mengirim email reset. Silakan coba lagi.');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(
                err?.response?.data?.error || 
                err?.response?.data?.message ||
                'Gagal mengirim email reset. Pastikan email Anda terdaftar dan coba lagi.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
                <Card className="w-full max-w-sm shadow-2xl text-center">
                    <CardHeader className="space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Cek Email Anda 📧</CardTitle>
                        <CardDescription>
                            Kami telah mengirimkan tautan pemulihan kata sandi ke <strong>{email}</strong>. 
                            Silakan periksa kotak masuk Anda (dan folder spam).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Jika email tidak muncul dalam beberapa menit, periksa folder spam atau coba lagi.
                        </p>
                        <Link href="/login" className="w-full block">
                            <Button className="w-full">
                                Kembali ke Halaman Masuk
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
            <Card className="w-full max-w-sm shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 mr-2 text-primary" /> Lupa Kata Sandi
                    </CardTitle>
                    <CardDescription>
                        Masukkan alamat email Anda, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4">
                        {error && (
                            <div className="p-3 rounded-md bg-red-100 text-red-700 text-sm border border-red-300 flex gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Input Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    required
                                    className="pl-10"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full mt-2" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    Kirim Tautan Reset <RefreshCw className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </CardContent>
                </form>

                <CardFooter className="flex flex-col gap-4 pt-0">
                    <p className="text-sm text-center text-gray-500">
                        <Link href="/login" passHref className="font-medium text-primary hover:underline flex items-center justify-center">
                           <ArrowLeft className="w-4 h-4 mr-1"/> Kembali ke Masuk
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;