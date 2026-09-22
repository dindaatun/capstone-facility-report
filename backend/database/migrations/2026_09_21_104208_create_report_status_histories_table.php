<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('report_status_histories', function (Blueprint $table) {
        $table->id();

        $table->foreignId('report_id')
            ->constrained('reports')
            ->onDelete('cascade');

        $table->foreignId('changed_by')
            ->constrained('users')
            ->onDelete('restrict');

        $table->enum('status', [
            'reported',
            'processing',
            'repaired',
            'completed'
        ]);

        $table->text('note')->nullable();

        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_status_histories');
    }
};
