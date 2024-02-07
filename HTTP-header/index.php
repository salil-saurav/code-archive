<?php

function get_header_content(string $url): array
{
    $response = wp_safe_remote_get($url, ['headers' => ['Accept-Charset' => 'UTF-8']]);

    $content_to_ignore = [
        'report-to', 'set-cookie', 'content-security-policy', 'etag',
        'link', 'server-timing', 'nel', 'access-control-allow-origin'
    ];

    if (is_wp_error($response)) {
        // Handle error
        return ['error' => 'Error fetching header: ' . $response->get_error_message()];
    } else {
        // Handle success
        $header = wp_remote_retrieve_header($response, 'content-type');

        $http_status_code = wp_remote_retrieve_response_code($response);
        $http_status_message = wp_remote_retrieve_response_message($response);



        // Check if the header is present and is of type 'text/html'
        if ($header && strpos($header, 'text/html') !== false) {
            $headerDetails = [];
            $headerDetails["HTTP/1.1"] = $http_status_code . " " . $http_status_message;

            foreach ($response['headers'] as $key => $value) {
                $key = strtolower($key);

                if (!in_array($key, $content_to_ignore, true) && strpos($key, 'x-') !== 0 && strpos($key, 'policy') === false) {
                    if (is_array($value)) {
                        $value = implode(', ', $value);
                    }
                    $headerDetails[$key] = $value;
                }
            }

            return $headerDetails;
        }
    }

    return [];
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

    return null;
}

if ($entered_url) {

    if (sanitize_given_url($entered_url) === null) {
        $returned_res = ['Error' => 'Invalid URL. Please enter a valid URL.'];
    } else {
        $returned_res = get_header_content(sanitize_given_url($entered_url));
        $u = sanitize_given_url($entered_url);
    }
}


$result = isset($returned_res) ? $returned_res : "";
$url_to_print = isset($u) ? $u : "";

?>

<!--  Loop for the result -->

<div class="res-container">

    <?php if (is_array($result)) { ?>
        <div class="result">
            <h2>Result</h2>

            <table>
                <tr>
                    <th>URL</th>
                    <td>
                        <a href="<?= $url_to_print ?>"><?= $url_to_print ?></a>
                    </td>
                </tr>

                <?php foreach ($result as $key => $value) { ?>
                    <tr>
                        <td><strong><?= $key; ?></strong> </td>
                        <td><?= $value; ?></td>
                    </tr>
                <?php } ?>
            </table>
        </div>
    <?php } ?>
</div>