// components/ForgotPassword.jsx atau app/forgot-password/page.jsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react'; 

/**
 * Komponen Halaman Lupa Kata Sandi (Forgot Password)
 */
const ForgotPasswordPage = () => {
    const [email, setEmail] = React.useState('');
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email) {
            alert("Harap masukkan alamat email.");
            return;
        }

        // --- Logika Backend Simulasi ---
        console.log(`Mengirim tautan reset ke: ${email}`);
        
        // Dalam aplikasi nyata, panggil API untuk mengirim email reset.
        
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
                <Card className="w-full max-w-sm shadow-2xl text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl">Cek Email Anda 📧</CardTitle>
                        <CardDescription>
                            Kami telah mengirimkan tautan pemulihan kata sandi ke **{email}**. Silakan periksa kotak masuk Anda (dan folder spam).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Link href="/login" passHref>
                            <Button variant="link" className="text-primary hover:underline">
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
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            Kirim Tautan Reset <RefreshCw className="ml-2 h-4 w-4" />
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