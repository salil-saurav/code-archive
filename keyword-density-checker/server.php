<?php

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

        $htmlContent = $dom->saveHTML();

        // Decode HTML entities
        $decodedBody = html_entity_decode($htmlContent, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $decodedBody = iconv('UTF-8', 'UTF-8//IGNORE', $decodedBody);

        return $decodedBody;
    }
}


add_action('wp_ajax_get_body_content_ajax', 'get_body_content_ajax');
add_action('wp_ajax_nopriv_get_body_content_ajax', 'get_body_content_ajax'); // For non-logged-in users

function get_body_content_ajax()
{
    if (isset($_POST['url'])) {
        $url = $_POST['url'];

        $content = get_body_content($url);

        echo $content;
    }
}
