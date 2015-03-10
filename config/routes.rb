Rails.application.routes.draw do
  namespace 'api', format: 'json' do
    resource 'session', only: [:show, :create, :destroy]
    resources :entries, except: [:new, :edit]
  end
end
