# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "css"
sass_dir = "sass"
images_dir = "img"
javascripts_dir = "js"
fonts_dir = "fonts"

output_style = :compact
environment = :production

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

color_output = false

preferred_syntax = :sass

require File.join(File.dirname(__FILE__), 'timestamp.rb')
