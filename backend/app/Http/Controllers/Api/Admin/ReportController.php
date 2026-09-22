<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    // Menampilkan semua laporan untuk admin
    public function index()
    {
        $reports = Report::with([
            'user',
            'facility',
        ])
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Semua laporan berhasil diambil',
            'data' => $reports,
        ]);
    }

    // Menampilkan detail laporan
    public function show(Report $report)
    {
        $report->load([
            'user',
            'facility',
            'statusHistories.changedByUser',
        ]);

        return response()->json([
            'message' => 'Detail laporan berhasil diambil',
            'data' => $report,
        ]);
    }

    // Mengubah status laporan
    public function updateStatus(Request $request, Report $report)
    {
        $request->validate([
            'status' => 'required|in:reported,processing,repaired,completed',
            'note' => 'nullable|string',
        ]);

        $allowedTransitions = [
            'reported' => 'processing',
            'processing' => 'repaired',
            'repaired' => 'completed',
            'completed' => null,
        ];

        $nextStatus = $allowedTransitions[$report->status] ?? null;

        if ($nextStatus === null) {
            return response()->json([
                'message' => 'Laporan sudah selesai dan status tidak dapat diubah lagi',
            ], 422);
        }

        if ($request->status !== $nextStatus) {
            return response()->json([
                'message' => "Status hanya dapat diubah dari {$report->status} menjadi {$nextStatus}",
            ], 422);
        }

        DB::transaction(function () use ($request, $report) {
            $report->update([
                'status' => $request->status,
                'admin_note' => $request->note,
            ]);

            ReportStatusHistory::create([
                'report_id' => $report->id,
                'changed_by' => $request->user()->id,
                'status' => $request->status,
                'note' => $request->note,
            ]);
        });

        return response()->json([
            'message' => 'Status laporan berhasil diperbarui',
            'data' => $report->fresh()->load([
                'user',
                'facility',
                'statusHistories.changedByUser',
            ]),
        ]);
    }
}