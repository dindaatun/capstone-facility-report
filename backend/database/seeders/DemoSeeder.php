<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Report;
use App\Models\ReportStatusHistory;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // =========================================
        // USER DEMO
        // =========================================

        $employee = User::updateOrCreate(
            [
                'email' => 'karyawan.test@example.com',
            ],
            [
                'name' => 'Karyawan Test',
                'password' => 'password123',
                'role' => 'employee',
            ]
        );

        $employeeTwo = User::updateOrCreate(
            [
                'email' => 'karyawan2.test@example.com',
            ],
            [
                'name' => 'Karyawan Kedua',
                'password' => 'password123',
                'role' => 'employee',
            ]
        );

        $admin = User::updateOrCreate(
            [
                'email' => 'admin.test@example.com',
            ],
            [
                'name' => 'Admin Test',
                'password' => 'password123',
                'role' => 'admin',
            ]
        );

        // =========================================
        // FASILITAS DEMO
        // =========================================

        $ac = Facility::updateOrCreate(
            [
                'name' => 'AC Ruang Produksi',
            ],
            [
                'location' => 'Gedung A Lantai 1',
                'category' => 'Pendingin',
                'status' => 'active',
            ]
        );

        $lamp = Facility::updateOrCreate(
            [
                'name' => 'Lampu Koridor',
            ],
            [
                'location' => 'Gedung A Lantai 2',
                'category' => 'Penerangan',
                'status' => 'active',
            ]
        );

        $printer = Facility::updateOrCreate(
            [
                'name' => 'Printer Ruang Administrasi',
            ],
            [
                'location' => 'Gedung B Lantai 1',
                'category' => 'Elektronik',
                'status' => 'active',
            ]
        );

        // =========================================
        // LAPORAN 1 - REPORTED
        // =========================================

        $reportOne = Report::updateOrCreate(
            [
                'user_id' => $employee->id,
                'facility_id' => $ac->id,
                'description' => 'AC mengeluarkan air dan tidak mendinginkan ruangan dengan baik.',
            ],
            [
                'photo' => null,
                'priority' => 'high',
                'status' => 'reported',
                'admin_note' => null,
            ]
        );

        $reportOne->statusHistories()->delete();

        ReportStatusHistory::create([
            'report_id' => $reportOne->id,
            'changed_by' => $employee->id,
            'status' => 'reported',
            'note' => 'Laporan dibuat',
        ]);

        // =========================================
        // LAPORAN 2 - PROCESSING
        // =========================================

        $reportTwo = Report::updateOrCreate(
            [
                'user_id' => $employeeTwo->id,
                'facility_id' => $lamp->id,
                'description' => 'Lampu koridor berkedip dan beberapa kali mati secara tiba-tiba.',
            ],
            [
                'photo' => null,
                'priority' => 'medium',
                'status' => 'processing',
                'admin_note' => 'Teknisi sedang melakukan pemeriksaan instalasi lampu.',
            ]
        );

        $reportTwo->statusHistories()->delete();

        ReportStatusHistory::create([
            'report_id' => $reportTwo->id,
            'changed_by' => $employeeTwo->id,
            'status' => 'reported',
            'note' => 'Laporan dibuat',
        ]);

        ReportStatusHistory::create([
            'report_id' => $reportTwo->id,
            'changed_by' => $admin->id,
            'status' => 'processing',
            'note' => 'Teknisi sedang melakukan pemeriksaan instalasi lampu.',
        ]);

        // =========================================
        // LAPORAN 3 - REPAIRED
        // =========================================

        $reportThree = Report::updateOrCreate(
            [
                'user_id' => $employee->id,
                'facility_id' => $printer->id,
                'description' => 'Printer sering mengalami paper jam ketika digunakan untuk mencetak dokumen.',
            ],
            [
                'photo' => null,
                'priority' => 'medium',
                'status' => 'repaired',
                'admin_note' => 'Roller printer telah dibersihkan dan diganti.',
            ]
        );

        $reportThree->statusHistories()->delete();

        ReportStatusHistory::create([
            'report_id' => $reportThree->id,
            'changed_by' => $employee->id,
            'status' => 'reported',
            'note' => 'Laporan dibuat',
        ]);

        ReportStatusHistory::create([
            'report_id' => $reportThree->id,
            'changed_by' => $admin->id,
            'status' => 'processing',
            'note' => 'Printer sedang diperiksa oleh teknisi.',
        ]);

        ReportStatusHistory::create([
            'report_id' => $reportThree->id,
            'changed_by' => $admin->id,
            'status' => 'repaired',
            'note' => 'Roller printer telah dibersihkan dan diganti.',
        ]);

        // =========================================
        // LAPORAN 4 - COMPLETED
        // =========================================

        $reportFour = Report::updateOrCreate(
            [
                'user_id' => $employeeTwo->id,
                'facility_id' => $ac->id,
                'description' => 'Remote AC tidak berfungsi sehingga suhu tidak dapat diatur.',
            ],
            [
                'photo' => null,
                'priority' => 'low',
                'status' => 'completed',
                'admin_note' => 'Remote AC sudah diganti dan fasilitas kembali normal.',
            ]
        );

        $reportFour->statusHistories()->delete();

        ReportStatusHistory::create([
            'report_id' => $reportFour->id,
            'changed_by' => $employeeTwo->id,
            'status' => 'reported',
            'note' => 'Laporan dibuat',
        ]);

        ReportStatusHistory::create([
            'report_id' => $reportFour->id,
            'changed_by' => $admin->id,
            'status' => 'processing',
            'note' => 'Remote AC sedang diperiksa.',
        ]);

        ReportStatusHistory::create([
            'report_id' => $reportFour->id,
            'changed_by' => $admin->id,
            'status' => 'repaired',
            'note' => 'Remote AC telah diganti.',
        ]);

        ReportStatusHistory::create([
            'report_id' => $reportFour->id,
            'changed_by' => $admin->id,
            'status' => 'completed',
            'note' => 'Perbaikan selesai dan fasilitas telah diuji.',
        ]);
    }
}