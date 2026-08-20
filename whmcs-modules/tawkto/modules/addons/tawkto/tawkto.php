<?php
/**
 * Tawk.to Live Chat — WHMCS addon module
 *
 * Injects the Tawk.to embed script on every client-area page via the
 * ClientAreaFooterOutput hook so live chat appears site-wide.
 *
 * Configuration (WHMCS admin -> Addons -> Tawk.to Live Chat):
 *   propertyId : your Tawk.to property ID (e.g. 67eb013beb0591190d9dbd6c)
 *   widgetId   : your widget ID (e.g. default)
 *
 * If either value is empty the widget is not rendered, so the module
 * can be left enabled safely.
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

/**
 * Module metadata.
 */
function tawkto_MetaData()
{
    return [
        'DisplayName' => 'Tawk.to Live Chat',
        'Version' => '1.0.0',
        'Author' => 'CHV HOST',
        'Description' => 'Adds the Tawk.to live chat widget to every client area page.',
    ];
}

/**
 * Admin configuration form.
 */
function tawkto_config()
{
    return [
        'name' => 'Tawk.to Live Chat',
        'description' => 'Configure your Tawk.to property and widget IDs. The chat widget then appears on every client area page.',
        'version' => '1.0.0',
        'author' => 'CHV HOST',
        'fields' => [
            'propertyId' => [
                'FriendlyName' => 'Property ID',
                'Type' => 'text',
                'Size' => '40',
                'Description' => 'From tawk.to dashboard -> Administration -> Chat Widget. Example: 67eb013beb0591190d9dbd6c',
            ],
            'widgetId' => [
                'FriendlyName' => 'Widget ID',
                'Type' => 'text',
                'Size' => '40',
                'Description' => 'Usually "default" unless you created multiple widgets.',
            ],
        ],
    ];
}

/**
 * Admin area activation.
 */
function tawkto_activate()
{
    return [
        'status' => 'success',
        'description' => 'Tawk.to Live Chat module activated. Configure it in Setup -> Addon Modules.',
    ];
}

/**
 * Admin area deactivation.
 */
function tawkto_deactivate()
{
    return [
        'status' => 'success',
        'description' => 'Tawk.to Live Chat module deactivated.',
    ];
}

/**
 * Client area footer hook — injects the Tawk.to widget script.
 */
function tawkto_client_area_footer_output($vars)
{
    $propertyId = trim((string) getTawkSetting('propertyId'));
    $widgetId = trim((string) getTawkSetting('widgetId'));

    if ($propertyId === '' || $widgetId === '') {
        return '';
    }

    $name = '';
    $email = '';
    if (isset($vars['clientsdetails']) && is_array($vars['clientsdetails'])) {
        $cd = $vars['clientsdetails'];
        $name = trim(($cd['firstname'] ?? '') . ' ' . ($cd['lastname'] ?? ''));
        $email = trim((string) ($cd['email'] ?? ''));
    }

    $nameJs = $name !== '' ? json_encode($name) : 'null';
    $emailJs = $email !== '' ? json_encode($email) : 'null';

    return <<<HTML
<!-- Tawk.to Live Chat -->
<script type="text/javascript">
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script");
    s1.async = true;
    s1.src = 'https://embed.tawk.to/{$propertyId}/{$widgetId}';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    var s0 = document.getElementsByTagName("script")[0];
    s0.parentNode.insertBefore(s1, s0);
})();
if (typeof Tawk_API !== "undefined") {
    Tawk_API.onLoad = function () {
        if ({$nameJs} !== null) { Tawk_API.setAttributes({name: {$nameJs}}, function (err) {}); }
        if ({$emailJs} !== null) { Tawk_API.setAttributes({email: {$emailJs}}, function (err) {}); }
    };
}
</script>
HTML;
}

add_hook('ClientAreaFooterOutput', 1, 'tawkto_client_area_footer_output');

/**
 * Reads a module setting from tbladdonmodules.
 */
function getTawkSetting($key)
{
    static $cache = null;
    if ($cache === null) {
        $cache = [];
        try {
            $result = localAPI('GetModuleConfiguration', ['moduleName' => 'tawkto']);
            if (!empty($result['result']) && $result['result'] === 'success' && isset($result['setting'])) {
                $cache = $result['setting'];
            }
        } catch (Exception $e) {
            $cache = [];
        }
    }
    return $cache[$key] ?? '';
}