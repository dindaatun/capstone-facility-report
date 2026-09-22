<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    // Menampilkan semua fasilitas
    public function index()
    {
        $facilities = Facility::where('status', 'active')
            ->orderBy('name')
            ->get();

        return response()->json([
            'message' => 'Data fasilitas berhasil diambil',
            'data' => $facilities,
        ]);
    }

    // Menambahkan fasilitas
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $facility = Facility::create([
            'name' => $request->name,
            'location' => $request->location,
            'category' => $request->category,
            'status' => $request->status ?? 'active',
        ]);

        return response()->json([
            'message' => 'Fasilitas berhasil ditambahkan',
            'data' => $facility,
        ], 201);
    }

    // Menampilkan semua fasilitas untuk admin
    public function adminIndex()
    {
        $facilities = Facility::orderBy('name')->get();

        return response()->json([
            'message' => 'Semua fasilitas berhasil diambil',
            'data' => $facilities,
        ]);
    }

    // Menampilkan satu fasilitas
    public function show(Facility $facility)
    {
        return response()->json([
            'message' => 'Data fasilitas berhasil diambil',
            'data' => $facility,
        ]);
    }

    // Mengubah fasilitas
    public function update(Request $request, Facility $facility)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $facility->update($request->only([
            'name',
            'location',
            'category',
            'status',
        ]));

        return response()->json([
            'message' => 'Fasilitas berhasil diperbarui',
            'data' => $facility,
        ]);
    }

    // Menonaktifkan fasilitas
    public function destroy(Facility $facility)
    {
        $facility->update([
            'status' => 'inactive',
        ]);

        return response()->json([
            'message' => 'Fasilitas berhasil dinonaktifkan',
        ]);
    }
}