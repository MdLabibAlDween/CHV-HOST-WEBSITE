<?php
/**
 * ZiniPay WHMCS callback endpoint (fallback module).
 *
 * SECURITY (PRD §21–§22):
 *  - Never trusts the callback alone: payment is re-verified
 *    server-side with ZiniPay POST /v1/payment/verify.
 *  - Amount is validated against the WHMCS invoice balance.
 *  - addInvoicePayment() with the real transaction id means a
 *    duplicate callback cannot double-credit the invoice.
 */

require_once dirname(__DIR__, 3) . '/init.php';
require_once dirname(__DIR__, 3) . '/includes/gatewayfunctions.php';
require_once dirname(__DIR__, 3) . '/includes/invoicefunctions.php';

$gatewayModuleName = 'zinipay';
$gateway = getGatewayVariables($gatewayModuleName);

if (!$gateway['type']) {
    die('Module not activated');
}

$apiKey = trim((string) $gateway['apikey']);
$sandbox = !empty($gateway['sandbox']);
$baseUrl = 'https://api.zinipay.com';

$invoiceId = (int) ($_REQUEST['invoiceid'] ?? 0);
$cancelled = !empty($_REQUEST['cancelled']);
$invoiceId = checkCbInvoiceID($invoiceId, $gatewayModuleName);

// If the customer cancelled, keep the invoice unpaid and return them.
if ($cancelled) {
    header('Location: ' . $gateway['systemurl'] . 'viewinvoice.php?id=' . $invoiceId);
    exit;
}

// Resolve the ZiniPay invoice id from the metadata we sent at create time.
// The hosted invoice echoes the same metadata object on verify.
$znpInvoiceId = isset($_REQUEST['invoice_id'])
    ? trim((string) $_REQUEST['invoice_id'])
    : '';

if ($znpInvoiceId === '') {
    header('Location: ' . $gateway['systemurl'] . 'viewinvoice.php?id=' . $invoiceId . '&paymentsuccess=false');
    exit;
}

// 1. Server-side verification.
$payload = ['invoice_id' => $znpInvoiceId];
$verified = zinipay_api_request($baseUrl, '/v1/payment/verify', $payload, $apiKey);

if (!is_array($verified) || ($verified['status'] ?? '') !== 'COMPLETED') {
    logModuleCall($gatewayModuleName, 'verify_failed', $payload, $verified);
    header('Location: ' . $gateway['systemurl'] . 'viewinvoice.php?id=' . $invoiceId . '&paymentsuccess=false');
    exit;
}

$paidAmount = (float) ($verified['amount'] ?? 0.0);
$transactionId = (string) ($verified['transaction_id'] ?? $znpInvoiceId);
$invoiceAmount = (float) getInvoiceBalance($invoiceId);

// 2. Amount validation — never credit a mismatched payment.
if (abs($paidAmount - $invoiceAmount) > 0.01) {
    logModuleCall($gatewayModuleName, 'amount_mismatch', [
        'invoiceid' => $invoiceId,
        'expected' => $invoiceAmount,
        'paid' => $paidAmount,
    ]);
    header('Location: ' . $gateway['systemurl'] . 'viewinvoice.php?id=' . $invoiceId . '&paymentsuccess=false');
    exit;
}

// 3. Record payment (idempotent: WHMCS dedupes by transaction id).
addInvoicePayment(
    $invoiceId,
    $transactionId,
    $paidAmount,
    0,
    $gatewayModuleName
);

logTransaction($gatewayModuleName, $verified, 'Successful');

header('Location: ' . $gateway['systemurl'] . 'viewinvoice.php?id=' . $invoiceId . '&paymentsuccess=true');
exit;
