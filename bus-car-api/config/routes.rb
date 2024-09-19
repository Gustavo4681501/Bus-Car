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
    resources :locations, only: [:index, :create, :update, :destroy] do
      collection do
        get 'user/:user_id', to: 'locations#show_by_user_id'
        delete 'user/:user_id', to: 'locations#destroy'  # Ruta para eliminar por user_id
        put '/user/:user_id', to: 'locations#update_by_user'
      end
    end
    resources :routes, only: [:index, :show, :create, :update, :destroy]
  end
end
