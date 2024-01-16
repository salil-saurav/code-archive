<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/wp-load.php');

function get_body_content($url)
{
    $response = wp_remote_get($url, array('headers' => array('Accept-Charset' => 'UTF-8')));

    if (is_wp_error($response)) {
        // Handle error
        return 'Error fetching content: ' . $response->get_error_message();
    } else {
        $body = wp_remote_retrieve_body($response);

        $dom = new DOMDocument();
        libxml_use_internal_errors(true); // Disable error reporting for invalid HTML
        $dom->loadHTML('<?xml encoding="UTF-8">' . $body);
        libxml_use_internal_errors(false);

        // Create a DOMXPath object
        $xpath = new DOMXPath($dom);

        // Remove script elements
        foreach ($xpath->query('//*[@style]') as $ele) {
            $ele->removeAttribute("style");
        }
        foreach ($xpath->query('//script|//link|//img|//style|//iframe|//svg|//path|//video|//input|//textarea|//select') as $element) {
            $element->parentNode->removeChild($element);
        }

        $bodyContent = '';

        // Get the content within the <body> tag
        $bodyElement = $dom->getElementsByTagName('body')->item(0);
        if ($bodyElement) {
            foreach ($bodyElement->childNodes as $node) {
                $bodyContent .= $dom->saveHTML($node);
            }
        }
        $decodedBody = html_entity_decode($bodyContent, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $decodedBody = iconv('UTF-8', 'UTF-8//IGNORE', $decodedBody);

        return $decodedBody;
    }
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Store POST data in the session
    $_SESSION['postdata'] = $_POST;

    // Clear the POST data
    $_POST = array();

    // Redirect to the same page to prevent form resubmission
    header('Location: ' . $_SERVER['REQUEST_URI']);
    exit;
}

if (isset($_SESSION['postdata'])) {
    // Restore POST data from the session
    $_POST = $_SESSION['postdata'];

    // Clear stored POST data in the session
    unset($_SESSION['postdata']);
}

$entered_url = isset($_POST['url']) ? $_POST['url'] : "";


if ($entered_url) {
    function sanitize_given_url($url)
    {
        $pattern = '/^(http|https|ftp):\/\/([a-z0-9-]+\.)+[a-z]{2,6}([\/?].*)?$/i';

        $url = strtolower($url);

        if (preg_match($pattern, $url) === 1) {
            if (!parse_url($url, PHP_URL_SCHEME)) {
                $url = 'http://' . $url;
            }
            return $url;
        }
    }
    $returned_url = get_body_content(sanitize_given_url($entered_url));
    $u = sanitize_given_url($entered_url);
}



$url_to_fetch = isset($returned_url) ? $returned_url : "";
$url_to_print = isset($u) ? $u : "";
