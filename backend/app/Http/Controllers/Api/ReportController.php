<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    // Menampilkan laporan milik user yang sedang login
    public function index(Request $request)
    {
        $reports = Report::with('facility')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Data laporan berhasil diambil',
            'data' => $reports,
        ]);
    }

    // Membuat laporan baru
    public function store(Request $request)
    {
        $request->validate([
            'facility_id' => [
                'required',
                Rule::exists('facilities', 'id')
                    ->where(fn ($query) => $query->where('status', 'active')),
            ],
            'description' => 'required|string',
            'photo' => 'nullable|image|max:8192',
            'priority' => 'required|in:low,medium,high',
        ]);

        $photoPath = null;

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('reports', 'public');
        }

        $report = DB::transaction(function () use ($request, $photoPath) {
            $report = Report::create([
                'user_id' => $request->user()->id,
                'facility_id' => $request->facility_id,
                'description' => $request->description,
                'photo' => $photoPath,
                'priority' => $request->priority,
                'status' => 'reported',
            ]);

        ReportStatusHistory::create([
            'report_id' => $report->id,
            'changed_by' => $request->user()->id,
            'status' => 'reported',
            'note' => 'Laporan dibuat',
        ]);

    return $report;
});

        return response()->json([
            'message' => 'Laporan berhasil dibuat',
            'data' => $report->load('facility'),
        ], 201);
    }

    // Menampilkan detail satu laporan
    public function show(Request $request, Report $report)
    {
        if ($report->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke laporan ini',
            ], 403);
        }

        return response()->json([
            'message' => 'Detail laporan berhasil diambil',
            'data' => $report->load([
                'facility',
                'statusHistories.changedByUser',
            ]),
        ]);
    }

    // Fungsi update sementara
    public function update(Request $request, Report $report)
    {
        // Pastikan laporan milik user yang sedang login
        if ($report->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke laporan ini',
            ], 403);
        }

        // Laporan hanya boleh diedit selama masih reported
        if ($report->status !== 'reported') {
            return response()->json([
                'message' => 'Laporan yang sudah diproses tidak dapat diubah',
            ], 422);
        }

        $request->validate([
            'facility_id' => [
                'sometimes',
                Rule::exists('facilities', 'id')
                    ->where(fn ($query) => $query->where('status', 'active')),
            ],
            'description' => 'sometimes|string',
            'priority' => 'sometimes|in:low,medium,high',
            'photo' => 'nullable|image|max:8192',
        ]);

        $data = $request->only([
            'facility_id',
            'description',
            'priority',
        ]);

        // Jika user mengirim foto baru
        if ($request->hasFile('photo')) {
            $oldPhoto = $report->photo;

            // Simpan foto baru
            $newPhoto = $request->file('photo')->store('reports', 'public');

            $data['photo'] = $newPhoto;

            // Update laporan terlebih dahulu
            $report->update($data);

            // Setelah update berhasil, hapus foto lama
            if ($oldPhoto) {
                Storage::disk('public')->delete($oldPhoto);
            }
        } else {
            $report->update($data);
        }

        return response()->json([
            'message' => 'Laporan berhasil diperbarui',
            'data' => $report->fresh()->load('facility'),
        ]);
    }

    public function destroy(Request $request, Report $report)
    {
        // Pastikan laporan milik user yang sedang login
        if ($report->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke laporan ini',
            ], 403);
        }

        // Hanya laporan dengan status reported yang boleh dihapus
        if ($report->status !== 'reported') {
            return response()->json([
            'message' => 'Laporan yang sudah diproses tidak dapat dihapus',
            ], 422);
        }

        // Hapus foto dari storage jika ada
        if ($report->photo) {
            Storage::disk('public')->delete($report->photo);
        }

        // Hapus laporan
        $report->delete();

        return response()->json([
            'message' => 'Laporan berhasil dihapus',
        ]);
    }
}