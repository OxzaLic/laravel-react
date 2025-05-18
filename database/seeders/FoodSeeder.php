<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FoodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('foods')->insert([
            [
                "name" => "Tacos",
                "category" =>  "Mexican",
                "calories" =>     300,
                "price" =>  95,
                "available_date" =>  "2025-05-18",
                'created_at' => now(),
                'updated_at' => now()


            ],
            [
                "name" => "Cheeseburger",
                "category" =>  "American",
                "calories" =>     750,
                "price" =>  99,
                "available_date" =>  "2025-05-18",
                'created_at' => now(),
                'updated_at' => now()
            ]

        ]);
    }
}
