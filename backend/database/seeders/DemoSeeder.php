<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Akun Karyawan Demo
        User::updateOrCreate(
            [
                'email' => 'karyawan.test@example.com',
            ],
            [
                'name' => 'Karyawan Test',
                'password' => 'password123',
                'role' => 'employee',
            ]
        );

        // Akun Admin Demo
        User::updateOrCreate(
            [
                'email' => 'admin.test@example.com',
            ],
            [
                'name' => 'Admin Test',
                'password' => 'password123',
                'role' => 'admin',
            ]
        );

        // Fasilitas contoh
        Facility::updateOrCreate(
            [
                'name' => 'AC Ruang Produksi',
            ],
            [
                'location' => 'Gedung A Lantai 1',
                'category' => 'Pendingin',
                'status' => 'active',
            ]
        );

        Facility::updateOrCreate(
            [
                'name' => 'Lampu Koridor',
            ],
            [
                'location' => 'Gedung A Lantai 2',
                'category' => 'Penerangan',
                'status' => 'active',
            ]
        );

        Facility::updateOrCreate(
            [
                'name' => 'Printer Ruang Administrasi',
            ],
            [
                'location' => 'Gedung B Lantai 1',
                'category' => 'Elektronik',
                'status' => 'active',
            ]
        );
    }
}