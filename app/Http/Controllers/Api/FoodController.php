<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Food;

class FoodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $foods = Food::all();
        return response()->json($foods);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $food = Food::find($id);
        if (!$food) {
            return response()->json(['error' => 'Food not found'], 404);
        }

        return response()->json($food);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'calories' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'available_date' => 'required|date',
        ]);

        $food = Food::create($validated);

        return response()->json(['message' => 'Food created successfully!', 'food' => $food], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $food = Food::find($id);

        if (!$food) {
            return response()->json(['error' => 'Food not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'calories' => 'sometimes|required|integer|min:0',
            'price' => 'sometimes|required|numeric|min:0',
            'available_date' => 'sometimes|date',
        ]);

        $food->update($validated);

        return response()->json(['message' => 'Food updated successfully!', 'food' => $food]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $food = Food::find($id);

        if (!$food) {
            return response()->json(['error' => 'Food not found'], 404);
        }

        $food->delete();

        return response()->json(['message' => 'Food deleted successfully!']);
    }
}
