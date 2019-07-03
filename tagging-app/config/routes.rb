Rails.application.routes.draw do
  root 'main#index'
  get '/cordinates', to: 'main#cordinates'
  post '/', to: 'user#new'
  get '/lastuser', to: 'user#lastid'
  put '/users/:id', to: 'user#update'
end
