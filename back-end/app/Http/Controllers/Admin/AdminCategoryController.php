<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    // GET admin/categories
    public function index()
    {
        return response()->json(Category::latest()->get());
    }

    // POST admin/category/store
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);

        $category = Category::create($request->only('name', 'type'));

        return response()->json([
            'message' => 'Catégorie créée',
            'category' => $category
        ], 201);
    }

    // PUT admin/category/update/{id}
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);

        $category = Category::findOrFail($id);
        $category->update($request->only('name', 'type'));

        return response()->json([
            'message' => 'Catégorie mise à jour',
            'category' => $category
        ]);
    }

    // DELETE admin/category/delete/{id}
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée']);
    }
}