<?php
/*
Template Name: React App
*/


// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

get_header(); // Include the header if needed (can be skipped)

// React app root
echo '<div id="root"></div>';

get_footer(); // Include the footer if needed (can be skipped)
