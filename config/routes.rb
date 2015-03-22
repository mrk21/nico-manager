Rails.application.routes.draw do
  namespace 'api', format: 'json' do
    resource 'session', only: [:show, :create, :destroy]
    resources :entries, only: :index
    
    resources :mylists, only: :index do
      get ':group_id/entries'=> 'mylists#entries', on: :collection
    end
    
    resources :tags, only: :index do
      get ':name/entries'=> 'tags#entries', on: :collection
    end
  end
end
