Rails.application.routes.draw do
  namespace 'api', format: 'json' do
    resource 'session', only: [:show, :create, :destroy]
    resources :entries, only: :index
    resources :mylists, only: :index
  end
end
