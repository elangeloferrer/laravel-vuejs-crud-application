<?php

namespace App\Facades;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Carbon;

class TokenAuthFacade
{
    public static function generateToken($user, $remember = false)
    {
        $payload = [
            'iss' => env('APP_URL'),
            'sub' => $user->id,
            'email' => $user->email,
            'role' => $user->role->code,
            'iat' => Carbon::now()->timestamp,
            'exp' => ($remember) ? Carbon::now()->addDays(3)->timestamp : Carbon::now()->addHours(1)->timestamp, // if $remember is TRUE, token expires in 3days else in 1hour

        ];

        $privateKey = config('jwt.private-key.pbe-jwt');

        return JWT::encode($payload, $privateKey, 'RS256');
    }

    public static function verifyToken($token)
    {
        try {
            $publicKey = config('jwt.public-key.pbe-jwt');

            return JWT::decode($token, new Key($publicKey, 'RS256'));
        } catch (\Exception $e) {
            return null;
        }
    }
}
