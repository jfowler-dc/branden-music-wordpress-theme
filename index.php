<?php get_header(); ?>
	
	<?php 
		$args = array('post_type' => 'post');
		$the_query = new WP_Query( $args );
		if ( $the_query->have_posts() ) : while ( $the_query->have_posts() ) : $the_query->the_post();
	?>

	<?php
		endwhile; endif;
		wp_reset_postdata();
	?>

<?php get_footer(); ?>