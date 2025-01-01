<?php
add_action( 'after_setup_theme', 'blankslate_setup' );
function blankslate_setup() {
    load_theme_textdomain( 'blankslate', get_template_directory() . '/languages' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'post-thumbnails' );
    global $content_width;
    if ( ! isset( $content_width ) ) $content_width = 640;
    register_nav_menus(
        array( 'main-menu' => __( 'Main Menu', 'blankslate' ) )
    );
}

add_action( 'wp_enqueue_scripts', 'blankslate_load_scripts' );
function blankslate_load_scripts() {
    wp_enqueue_script( 'jquery' );
}

// Enqueue Vite-built React app assets
add_action( 'wp_enqueue_scripts', 'enqueue_react_app_assets' );
function enqueue_react_app_assets() {
    // Adjust the paths to your Vite output directory
    $react_js_path = get_template_directory() . '/dist/assets/main.js';
    $react_css_path = get_template_directory() . '/dist/assets/main.css';

    // Check if files exist before enqueuing
    if (file_exists($react_js_path)) {
        wp_enqueue_script(
            'react-app-js',
            get_template_directory_uri() . '/dist/assets/main.js',
            [],
            filemtime($react_js_path),
            true
        );
    }

    if (file_exists($react_css_path)) {
        wp_enqueue_style(
            'react-app-css',
            get_template_directory_uri() . '/dist/assets/main.css',
            [],
            filemtime($react_css_path)
        );
    }

    // Get Songs Data
    $songsArgs = array(
        'post_type' => 'song',
        'post_status' => 'publish', 
        'posts_per_page' => -1,
    );
    $songsQuery = new WP_Query($songsArgs);
    $songData = [];
    if ($songsQuery->have_posts()) {
        while ($songsQuery->have_posts()) {
            $songsQuery->the_post();
            $song = new stdClass();
            $song->title = get_the_title();
            $song->image = get_the_post_thumbnail_url();
            $song->url = get_field('song_file')['url'];
            $song->artist = get_field('artist_name');
            $song->songLinks = get_field('song_links');
            $songData[] = $song;
        }
        wp_reset_postdata();
    }
    // Get Profile Data
    $homepage_id = 31;
    $homepage_content = new stdClass();
    if ($homepage_id) {
        $homepage = get_post($homepage_id); 
        $homepage_content->content = apply_filters('the_content', $homepage->post_content);
        $homepage_content->image = get_the_post_thumbnail_url($homepage_id, 'full');
        $homepage_content->social_links = get_field('social_links', $homepage_id);
    }
    // Add data to window object
    wp_localize_script('react-app-js', 'wpData', [
        'siteUrl' => get_site_url(),
        'restUrl' => rest_url(),
        'songs' => $songData,
        'profile' => $homepage_content
    ]);
}

add_action( 'comment_form_before', 'blankslate_enqueue_comment_reply_script' );
function blankslate_enqueue_comment_reply_script() {
    if ( get_option( 'thread_comments' ) ) { 
        wp_enqueue_script( 'comment-reply' ); 
    }
}

add_filter( 'the_title', 'blankslate_title' );
function blankslate_title( $title ) {
    if ( $title == '' ) {
        return '&rarr;';
    } else {
        return $title;
    }
}

add_filter( 'wp_title', 'blankslate_filter_wp_title' );
function blankslate_filter_wp_title( $title ) {
    return $title . esc_attr( get_bloginfo( 'name' ) );
}

add_action( 'widgets_init', 'blankslate_widgets_init' );
function blankslate_widgets_init() {
    register_sidebar( array (
        'name' => __( 'Sidebar Widget Area', 'blankslate' ),
        'id' => 'primary-widget-area',
        'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
        'after_widget' => "</li>",
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ) );
}

function blankslate_custom_pings( $comment ) {
    $GLOBALS['comment'] = $comment;
    ?>
    <li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>"><?php echo comment_author_link(); ?></li>
    <?php 
}

add_filter( 'get_comments_number', 'blankslate_comments_number' );
function blankslate_comments_number( $count ) {
    if ( !is_admin() ) {
        global $id;
        $comments_by_type = &separate_comments( get_comments( 'status=approve&post_id=' . $id ) );
        return count( $comments_by_type['comment'] );
    } else {
        return $count;
    }
}
