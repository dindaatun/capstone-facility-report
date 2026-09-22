<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\Report;

class DashboardController extends Controller
{
    public function index()
    {
        $data = [
            'total_reports' => Report::count(),

            'status' => [
                'reported' => Report::where('status', 'reported')->count(),
                'processing' => Report::where('status', 'processing')->count(),
                'repaired' => Report::where('status', 'repaired')->count(),
                'completed' => Report::where('status', 'completed')->count(),
            ],

            'priority' => [
                'low' => Report::where('priority', 'low')->count(),
                'medium' => Report::where('priority', 'medium')->count(),
                'high' => Report::where('priority', 'high')->count(),
            ],

            'active_facilities' => Facility::where('status', 'active')->count(),

            'recent_reports' => Report::with([
                'user',
                'facility',
            ])
                ->latest()
                ->take(5)
                ->get(),
            ];

        return response()->json([
            'message' => 'Data dashboard berhasil diambil',
            'data' => $data,
        ]);
    }
}