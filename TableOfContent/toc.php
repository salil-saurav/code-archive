<?php

$heading_ID_list = [];

$content = get_the_content();

if ($content === false || empty($content)) {
    error_log('Failed to retrieve content.');
    return;
}

$dom = new DOMDocument();

libxml_use_internal_errors(true);

if (!$dom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD)) {
    error_log('Failed to load HTML content.');
    return;
}

libxml_clear_errors();

$xpath = new DOMXPath($dom);
if (!$xpath) {
    error_log('Failed to create DOMXPath.');
    return;
}

$headings = $xpath->query("//h1|//h2|//h3");
if ($headings === false) {
    error_log('XPath query failed.');
    return;
}

foreach ($headings as $heading) {
    $textContent = $heading->textContent;
    if ($textContent === null) {
        continue;
    }

    $textContent = trim(strtolower($textContent));
    $words = preg_replace('/[^a-zA-Z\s]+/', '', $textContent);
    $headingId = str_replace(' ', '-', $words);

    $heading_ID_list[] = $headingId;
    $heading->setAttribute('id', $headingId);
}

$modifiedContent = $dom->saveHTML();
if ($modifiedContent === false) {
    error_log('Failed to save modified HTML.');
    return;
}

?>


<!-- TOC -->

<?php
$domTwo = new DOMDocument();
libxml_use_internal_errors(true);

if (!$domTwo->loadHTML($modifiedContent)) {
    error_log('Failed to load modified HTML content.');
    libxml_clear_errors();
    return;
}

libxml_clear_errors();

$xpath = new DOMXPath($domTwo);
if (!$xpath) {
    error_log('Failed to create DOMXPath.');
    return;
}

$headings = $xpath->query("//h1|//h2|//h3");
if ($headings === false) {
    error_log('XPath query failed.');
    return;
}

if ($headings->length > 0) { ?>
    <ol id="toc_list">
        <?php
        foreach ($headings as $heading) {
            if ($heading === null) {
                continue;
            }
            $sanitized_heading = preg_replace('/[0-9.]+/', '', $heading->nodeValue);
        ?>
            <li><a href="#<?= htmlspecialchars($heading->getAttribute("id")) ?>"> <?= htmlspecialchars($sanitized_heading); ?> </a></li>
        <?php
        }
        ?>
    </ol>
<?php } else {
    echo '<p>No headings found.</p>';
}
?>