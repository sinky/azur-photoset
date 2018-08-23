<?php
/*
Plugin Name: Azur Photoset Shortcode
Plugin URI: https://github.com/sinky/azur-photoset
Version: 1.0
Author: Marco Krage
Author URI: http://my-azur.de
Description: Photoset Grid Shortcode
GitHub Plugin URI: https://github.com/sinky/azur-photoset
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

//error_reporting(E_ALL);
//ini_set('display_errors', 1);

remove_filter( 'the_content', 'wpautop' );
add_filter( 'the_content', 'wpautop' , 99 );
add_filter( 'the_content', 'shortcode_unautop', 100 );


function azur_photoset_editor_buttons(){ ?>
  <script type="text/javascript">
    QTags.addButton( 'azur-photoset', 'Photoset', '[azur-photoset cssclass="wide"]', '[/azur-photoset]' );
  </script>
<?php }
add_action('admin_print_footer_scripts',  'azur_photoset_editor_buttons');


/*
function azur_link_imagePrepare( $links ) {
  $mylinks = array(
    sprintf('<a href="%s" target="_blank">Image Prepare</a>', plugins_url('photoset-img-prepare.html', __FILE__ ) )
  );
  return array_merge( $links, $mylinks );
}
add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'azur_link_imagePrepare' );

function azur_video_extensions_deactivate_mp4 ( $extensions ) {
  $myExtensions = array();
  foreach($extensions as $ext) {
    if($ext == "mp4") { continue; }
    $myExtensions[] = $ext;
  }
  return $myExtensions;
}
add_filter( 'wp_video_extensions', 'azur_video_extensions_deactivate_mp4' );
*/

function azur_media_send_to_editor( $html, $send_id, $attachment  ) {
  if(is_admin()) {
    $meta = wp_get_attachment_metadata($attachment['id']);
    $ratio = $meta['width']/$meta['height'];
    if(preg_match('/^\[video/i', $html)){
      $html = '<video data-ratio="'.$ratio.'" preload="auto" loop><source src="'.$attachment['url'].'" type="video/mp4">Your browser does not support HTML5 video.</video>';
    }
  }
  return $html;
}
add_filter( 'media_send_to_editor', 'azur_media_send_to_editor', 10, 3 );


function azur_photoset_shortcode( $atts, $content = null ) {
  $a = shortcode_atts( array(
    'cssclass' => ''
  ), $atts );

  $cssClasses = 'photoset ' . $a['cssclass'];

  $html = '';
  $html .= '<div class="photoset-row" >';

  $content = trim($content);

  foreach(preg_split("/((\r?\n)|(\r\n?))/", $content) as $line){
    $line = trim($line);
    if(empty($line)) {
      $html .= '</div><div class="photoset-row" >';
      continue;
    }

    $html .= '<div class="photoset-item">'.$line.'</div>';

  }
  $html .= '</div>';

  return '<div class="'.$cssClasses.'">' . $html . '</div>';
}
add_shortcode('azur-photoset', 'azur_photoset_shortcode');
