require File.expand_path('../boot', __FILE__)

require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"

Bundler.require(*Rails.groups)

module NicoManager
  class Application < Rails::Application
    config.time_zone = 'Tokyo'
    config.active_record.raise_in_transactional_callbacks = true
    config.action_controller.action_on_unpermitted_parameters = :raise
    
    config.generators do |g|
      g.javascripts false
      g.stylesheets false
      g.helper false
      g.template_engine :jbuilder
      g.test_framework :rspec,
        view_specs: false,
        controller_specs: false,
        routing_specs: false
    end
  end
end
