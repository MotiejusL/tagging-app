Rails.application.routes.draw do
  root 'main#index'
  get '/cordinates', to: 'main#cordinates'
end
