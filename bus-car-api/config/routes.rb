Rails.application.routes.draw do
  get 'private/test'
  
  devise_for :users, 
    path: '', 
    path_names: {
      sign_in: 'login',
      sign_out: 'logout',
      registration: 'signup'
    },
    controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations',
      passwords: 'users/passwords'
    }
   
    devise_scope :user do
      post '/forgot_password', to: 'users/passwords#forgot_password'
      put '/password/edit', to: 'users/passwords#update' 
    end

    namespace :api do
      resources :locations, only: [:index, :create, :destroy] do
        delete 'destroy', on: :collection, to: 'locations#destroy'
      end
      resources :routes, only: [:index, :create, :destroy]
      patch 'locations/:id/hide', to: 'locations#hide'
    end
    
end
