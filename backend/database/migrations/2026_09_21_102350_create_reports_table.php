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
        Schema::create('reports', function (Blueprint $table) {
        $table->id();

        $table->foreignId('user_id')
            ->constrained('users')
            ->onDelete('cascade');

        $table->foreignId('facility_id')
            ->constrained('facilities')
            ->onDelete('restrict');

        $table->text('description');

        $table->string('photo')->nullable();

        $table->enum('priority', ['low', 'medium', 'high'])
            ->default('medium');

        $table->enum('status', [
            'reported',
            'processing',
            'repaired',
            'completed'
        ])->default('reported');

        $table->text('admin_note')->nullable();

        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
