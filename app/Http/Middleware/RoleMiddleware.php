<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Exception;

use App\Facades\TokenAuthFacade;
use App\Helpers\Utils;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role): Response
    {
        $token = $request->bearerToken();

        if (!$token) {

            return Utils::apiResponseWithError('Unauthorized', 401);
        }

        try {
            $decoded = TokenAuthFacade::verifyToken($token);
            if (!$decoded) {
                return Utils::apiResponseWithError('Invalid or expired token', 401);
            }


            $userRole = $decoded->role ?? null;

            if ($userRole !== $role) {
                return Utils::apiResponseWithError('Forbidden', 403);
            }

            $request->attributes->set('user', $decoded);
        } catch (\Firebase\JWT\ExpiredException $e) {
            return Utils::apiResponseWithError('Token expired. Please refresh your token.', 401);
        } catch (Exception $e) {
            return Utils::apiResponseWithError('Invalid token', 401);
        }

        return $next($request);
    }
}
