<?php
/**
 * ZiniPay WHMCS Payment Gateway — module definition (fallback module).
 *
 * NOTE: Prefer the official ZiniPay WHMCS module:
 *   https://zinipay.com/downloads/zinipay_whmcs_module_v2.2.zip
 *
 * This file is provided as a standards-compliant fallback following
 * the WHMCS payment gateway architecture (merchant gateway).
 * It creates a ZiniPay hosted invoice and redirects the customer.
 *
 * PHP version: 7.4+
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

/**
 * Gateway metadata.
 */
function zinipay_MetaData()
{
    return [
        'DisplayName' => 'ZiniPay (bKash, Nagad, Rocket, Cards)',
        'APIVersion' => '1.1',
        'DisableLocalCredtCardInput' => true,
        'TokenisedStorage' => false,
        'Endpoints' => [
            'storeinvoice' => [
                'method' => 'POST',
                'path' => '/v1/payment/create',
            ],
            'verifyinvoice' => [
                'method' => 'POST',
                'path' => '/v1/payment/verify',
            ],
        ],
    ];
}

/**
 * Gateway configuration fields.
 */
function zinipay_config()
{
    return [
        'FriendlyName' => [
            'Type' => 'System',
            'Value' => 'ZiniPay',
        ],
        'apikey' => [
            'FriendlyName' => 'ZiniPay API Key',
            'Type' => 'password',
            'Size' => '64',
            'Description' => 'Your ZiniPay Brand/API key.',
        ],
        'sandbox' => [
            'FriendlyName' => 'Sandbox Mode',
            'Type' => 'yesno',
            'Description' => 'Tick to test with sandbox transactions.',
        ],
    ];
}

/**
 * Create the ZiniPay invoice and redirect the customer.
 *
 * @param array $params
 * @return array
 */
function zinipay_link($params)
{
    $apiKey = trim((string) $params['apikey']);
    $sandbox = !empty($params['sandbox']);
    $baseUrl = 'https://api.zinipay.com';
    $secureBase = $sandbox ? 'https://secure.zinipay.com/demo' : 'https://secure.zinipay.com';

    if ($apiKey === '') {
        return '<p class="alert alert-danger">ZiniPay is not configured. Please contact support.</p>';
    }

    $invoiceId = (int) $params['invoiceid'];
    $amount = (float) $params['amount'];
    $currency = $params['currency'];
    $customerName = trim(($params['clientdetails']['firstname'] ?? '') . ' ' . ($params['clientdetails']['lastname'] ?? ''));
    $customerEmail = $params['clientdetails']['email'] ?? '';
    $systemUrl = rtrim($params['systemurl'], '/');

    $payload = [
        'cus_name' => $customerName,
        'cus_email' => $customerEmail,
        'amount' => round($amount, 2),
        'metadata' => [
            'whmcs_invoice_id' => (string) $invoiceId,
            'whmcs_currency' => (string) $currency,
        ],
        'redirect_url' => $systemUrl . '/modules/gateways/callback/zinipay.php?invoiceid=' . $invoiceId . '&success=1',
        'cancel_url' => $systemUrl . '/modules/gateways/callback/zinipay.php?invoiceid=' . $invoiceId . '&cancelled=1',
        'webhook_url' => $systemUrl . '/modules/gateways/callback/zinipay.php',
    ];

    $response = zinipay_api_request($baseUrl, '/v1/payment/create', $payload, $apiKey);

    if ($response === null || empty($response['payment_url'])) {
        return '<p class="alert alert-danger">Payment service is temporarily unavailable. Please try again later.</p>';
    }

    return '<form method="GET" action="' . htmlspecialchars((string) $response['payment_url']) . '">'
        . '<input type="submit" value="' . htmlspecialchars($params['langpaynow'] ?? 'Pay Now') . '" class="btn btn-success btn-lg" />'
        . '</form>';
}

/**
 * Server-side request helper for the ZiniPay API.
 *
 * @param string $baseUrl
 * @param string $endpoint
 * @param array  $payload
 * @param string $apiKey
 * @return array|null
 */
function zinipay_api_request($baseUrl, $endpoint, array $payload, $apiKey)
{
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $baseUrl . $endpoint,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'zini-api-key: ' . $apiKey,
        ],
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CONNECTTIMEOUT => 10,
    ]);
    $raw = curl_exec($ch);
    $errno = curl_errno($ch);
    curl_close($ch);

    if ($raw === false || $errno !== 0) {
        logModuleCall('zinipay', 'api_request', $payload, 'curl error: ' . $errno);
        return null;
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        logModuleCall('zinipay', 'api_request', $payload, 'invalid JSON response');
        return null;
    }
    return $data;
}
