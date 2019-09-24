Rails.application.routes.draw do
  root 'main#index'
  get '/cordinates', to: 'main#cordinates'
  post '/', to: 'user#new'
  get '/lastuser', to: 'user#lastid'
  put '/users/:id', to: 'user#update'
  get '/users_for_img/:id', to: 'main#users_for_img'
  get '/get_images_and_chars', to: 'main#get_images_and_chars'
end
