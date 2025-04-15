<?php

return [
    'private-key' => [
        'pbe-jwt' => file_get_contents(storage_path('keys/jwtRS256.key'))
    ],

    'public-key' => [
        'pbe-jwt' => file_get_contents(storage_path('keys/jwtRS256.key.pub'))
    ]
];
