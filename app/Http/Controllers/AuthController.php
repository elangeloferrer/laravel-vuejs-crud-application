<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Resources\UserResource;
use App\Facades\TokenAuthFacade;

use App\Helpers\Utils;

use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'username_or_email' => 'required',
                'password' => 'required',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return Utils::apiResponseWithMultipleErrors($e->errors(), 422);
        }

        $usernameOrEmail = $credentials['username_or_email'];
        $password = $credentials['password'];

        // Check if username_or_email is an email or username
        $field = filter_var($usernameOrEmail, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        // Find user
        $user = User::where($field, $usernameOrEmail)->first();

        if (!$user || !Auth::attempt([$field => $usernameOrEmail, 'password' => $password])) {
            return Utils::apiResponseWithError("Unauthorized", 401);
        }

        $user = Auth::user();
        $token = TokenAuthFacade::generateToken($user, $request->remember);

        $data = [
            'token' => $token,
            'user' => new UserResource($user)
        ];


        return Utils::apiResponse(true, "Successful login!", $data);
    }
}
