<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

use App\Http\Resources\UserResource;
use App\Facades\TokenAuthFacade;

use App\Helpers\Utils;

use App\Models\User;
use App\Models\RefreshToken;

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

        // Generate access token and refresh token
        $accessToken = TokenAuthFacade::generateToken($user, $request->remember);


        $refreshToken = Str::random(64);
        RefreshToken::insert([
            'user_id' => $user->id,
            'token' => hash('sha256', $refreshToken),
            'expires_at' => Carbon::now()->addDays(7),
        ]);

        $data = [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'user' => new UserResource($user)
        ];


        return Utils::apiResponse(true, "Successful login!", $data);
    }

    public function refreshToken(Request $request)
    {
        $refreshToken = $request->refresh_token;

        if (!$refreshToken) {
            return Utils::apiResponseWithError("Refresh token required", 400);
        }

        $hashedToken = hash('sha256', $refreshToken);

        $tokenRecord = RefreshToken::where('token', $hashedToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$tokenRecord) {
            return Utils::apiResponseWithError("Invalid or expired refresh token", 401);
        }

        $user = User::find($tokenRecord->user_id);

        // Generate new Access Token
        $newAccessToken = TokenAuthFacade::generateToken($user);

        $data = [
            'access_token' => $newAccessToken,
            'refresh_token' => $refreshToken,
            'user' => new UserResource($user)
        ];

        return Utils::apiResponse(true, "Refresh token success", $data);
    }
}
