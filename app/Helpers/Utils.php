<?php

namespace App\Helpers;

class Utils
{
    public static function getInitials($string)
    {
        $words = explode(' ', $string); // Split the string into words
        $initials = '';

        foreach ($words as $word) {
            if (!empty($word)) {
                $initials .= strtoupper($word[0]); // Get the first letter and make it uppercase
            }
        }

        return $initials;
    }

    public static function apiResponse($success, $message, $data = null, $status = 200)
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data
        ], $status);
    }

    public static function apiResponseWithError($error, $status)
    {
        return response()->json([
            'success' => false,
            'error' => $error
        ], $status);
    }

    public static function apiResponseWithMultipleErrors($errors, $status)
    {
        return response()->json([
            'success' => false,
            'errors' => $errors
        ], $status);
    }
}
