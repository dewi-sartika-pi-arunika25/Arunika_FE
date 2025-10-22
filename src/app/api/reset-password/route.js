// app/api/reset-password/route.js

import { NextResponse } from 'next/server';
// Import bcrypt untuk hashing kata sandi yang aman (Asumsikan sudah terinstal)
// import bcrypt from 'bcryptjs'; 

// Fungsi untuk menangani permintaan POST (Reset Password)
export async function POST(request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token dan kata sandi baru diperlukan." }, 
                { status: 400 }
            );
        }

        // --- 1. VERIFIKASI TOKEN (Logika Database) ---
        // Anda perlu mencari pengguna di database berdasarkan token reset.
        
        // Simulasikan mencari pengguna dan memverifikasi token/kedaluwarsa
        const user = { 
            id: 'user123', 
            resetToken: 'xyz123', 
            tokenExpires: Date.now() + 3600000 // Token berlaku 1 jam
        }; 
        
        if (user.resetToken !== token || user.tokenExpires < Date.now()) {
            // Jika token tidak cocok atau sudah kadaluarsa
            return NextResponse.json(
                { error: "Token tidak valid atau sudah kadaluarsa." }, 
                { status: 401 }
            );
        }

        // --- 2. HASH KATA SANDI BARU (Sangat Penting!) ---
        // const hashedPassword = await bcrypt.hash(password, 10);
        
        // Simulasi Hashing
        const hashedPassword = `hashed_${password}`; 

        // --- 3. UPDATE DATABASE ---
        // Perbarui pengguna di database dengan kata sandi yang di-hash.
        // Hapus token reset dan tanggal kadaluarsa dari database.
        
        // Simulasikan Update
        console.log(`Pengguna ${user.id} berhasil mereset kata sandi.`);
        // await db.user.update({
        //     where: { id: user.id },
        //     data: { password: hashedPassword, resetToken: null, tokenExpires: null },
        // });

        // --- 4. RESPON BERHASIL ---
        return NextResponse.json(
            { message: "Kata sandi berhasil diatur ulang." }, 
            { status: 200 }
        );

    } catch (error) {
        console.error("Kesalahan Reset Password API:", error);
        return NextResponse.json(
            { error: "Kesalahan internal server." }, 
            { status: 500 }
        );
    }
}