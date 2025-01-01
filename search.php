<?php get_header(); ?>

	<?php if ( have_posts() ) : ?>

		<h1><?php printf( __( 'Search Results for: "%s"', 'blankslate' ), get_search_query() ); ?></h1>

		<?php while ( have_posts() ) : the_post(); ?>

			<h2><?php echo get_the_title();?></h2>
			<p><?php echo get_the_date(); ?></p>
			<p><?php echo wp_trim_words(get_the_excerpt(), 50); ?></p>

		<?php endwhile; ?>

	<?php else : ?>

		<h2><?php _e( 'Nothing Found', 'blankslate' ); ?></h2>
		<p><?php _e( 'Sorry, nothing matched your search. Please try again.', 'blankslate' ); ?></p>
				
	<?php endif; ?>

<?php get_footer(); ?>