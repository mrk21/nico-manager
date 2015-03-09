Rails.application.routes.draw do
  namespace 'api', format: 'json' do
    resource 'session', only: [:show, :create, :destroy]
  end
end
