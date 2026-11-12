<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $dealers = DB::table('dealers')->select('id', 'manufacture_id', 'created_at', 'updated_at')->get();

        foreach ($dealers as $dealer) {
            if ($dealer->manufacture_id === null) {
                continue;
            }

            DB::table('dealer_manufacture')->updateOrInsert(
                [
                    'dealer_id' => $dealer->id,
                    'manufacture_id' => $dealer->manufacture_id,
                ],
                [
                    'created_at' => $dealer->created_at,
                    'updated_at' => $dealer->updated_at,
                ],
            );
        }

        Schema::table('dealers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('manufacture_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dealers', function (Blueprint $table) {
            $table->foreignId('manufacture_id')->nullable()->constrained('manufactures');
        });

        $pivots = DB::table('dealer_manufacture')
            ->select('dealer_id', 'manufacture_id')
            ->orderBy('id')
            ->get()
            ->groupBy('dealer_id');

        foreach ($pivots as $dealerId => $rows) {
            DB::table('dealers')
                ->where('id', $dealerId)
                ->update(['manufacture_id' => $rows->first()->manufacture_id]);
        }
    }
};
