Rails.application.routes.draw do
  namespace 'api', format: 'json' do
    resource 'session', only: [:show, :create, :destroy]
    resources :entries, only: :index
    resources :mylists, only: :index do
      get ':group_id/entries'=> 'entries#index', on: :collection
    end
  end
end
