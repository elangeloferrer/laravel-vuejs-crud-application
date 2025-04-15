<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Facades\TokenAuthFacade;
use App\Helpers\Utils;

class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return Utils::apiResponseWithError('Token not provided', 401);
        }

        $decoded = TokenAuthFacade::verifyToken($token);

        if (!$decoded) {
            return Utils::apiResponseWithError('Invalid or expired token', 401);
        }

        $request->merge(['auth_user_id' => $decoded->sub]);
        // $request->attributes->set('user', $decoded);

        return $next($request);
    }
}
