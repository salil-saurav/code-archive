<?php


// Register Custom Post Type "Car"
function register_car_posttype()
{

    $name = "Car";

    $labels = [
        'name'               => __("{$name}s"),
        'singular_name'      => __($name),
        'menu_name'          => __($name),
        'name_admin_bar'     => __($name),
        'add_new'            => __("Add New {$name}"),
        'add_new_item'       => __("Add New {$name}"),
        'new_item'           => __("New {$name}"),
        'edit_item'          => __("Edit {$name}"),
        'view_item'          => __("View {$name}"),
        'all_items'          => __("All {$name}s"),
        'search_items'       => __("Search {$name}s"),
        'parent_item_colon'  => __("Parent {$name}s:"),
        'not_found'          => __("No {$name}s found."),
        'not_found_in_trash' => __("No {$name}s found in Trash")
    ];

    $args = [
        'public'             => true,
        'labels'             => $labels,
        'supports'           => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon'          => 'dashicons-car',
        'menu_position'      => 5,
        'has_archive'        => true,
        'taxonomies'         => ['category', 'post_tag'],
    ];

    register_post_type('car', $args);
}
add_action('init', 'register_car_posttype');

// Register Custom Taxonomy "Car Type"

function register_car_taxonomy()
{

    $name = "Car";

    $labels = [
        'name'              => __("{$name} Types"),
        'singular_name'     => __("{$name} Type"),
        'search_items'      => __("Search {$name} Types"),
        'all_items'         => __("All {$name} Types"),
        'parent_item'       => __("Parent {$name} Type"),
        'parent_item_colon' => __("Parent {$name} Type:"),
        'edit_item'         => __("Edit {$name} Type"),
        'update_item'       => __("Update {$name} Type"),
        'add_new_item'      => __("Add New {$name} Type"),
        'new_item_name'     => __("New {$name} Type Name"),
        'menu_name'         => __("{$name} Type"),
    ];

    $args = [
        'labels'            => $labels,
        'hierarchical'      => true,
        'public'            => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_nav_menus' => true,
        'show_tagcloud'     => true,
    ];

    // Register taxonomy and associate it with the 'car' post type

    register_taxonomy('car_type', ['car'], $args);
}
add_action('init', 'register_car_taxonomy');
