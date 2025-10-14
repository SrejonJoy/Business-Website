<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    // List all users (basic info)
    public function users(Request $request)
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')->orderBy('id', 'desc')->get();
        return response()->json($users);
    }

    // Update a user's role
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string',
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->input('role');
        $user->save();

        return response()->json(['message' => 'Role updated', 'user' => $user]);
    }
}
